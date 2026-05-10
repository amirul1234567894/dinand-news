import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import slugify from 'slugify';
import { createAdminSupabase } from '@/lib/supabase';
import { generateEnglishArticle, translateArticle, estimatePlagiarismScore } from '@/lib/groq';
import { calculateReadingTime, generatePlaceholderCover } from '@/lib/utils';
import { LOCALES } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for translation pipeline

const IngestSchema = z.object({
  source_url: z.string().url(),
  source_name: z.string().min(1),
  source_published_at: z.string().optional(),
  category_slug: z.string().min(1),
  facts: z.string().min(50, 'Facts must be at least 50 chars'),
  is_breaking: z.boolean().optional().default(false),
  cover_image_url: z.string().url().optional(),
});

function authorize(req: NextRequest): boolean {
  const auth = req.headers.get('authorization') || '';
  const expected = `Bearer ${process.env.INGEST_API_SECRET}`;
  return auth === expected && !!process.env.INGEST_API_SECRET;
}

export async function POST(req: NextRequest) {
  // 1. Auth
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Validate
  let payload;
  try {
    const body = await req.json();
    payload = IngestSchema.parse(body);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Invalid payload', details: err.errors || err.message },
      { status: 400 }
    );
  }

  const supabase = createAdminSupabase();

  // 3. Dedupe by source_url
  const { data: existing } = await supabase
    .from('articles')
    .select('id, slug')
    .eq('source_url', payload.source_url)
    .maybeSingle();

  if (existing) {
    await supabase.from('ingestion_log').insert({
      source_url: payload.source_url,
      status: 'duplicate',
      reason: 'source_url already ingested',
      article_id: existing.id,
    });
    return NextResponse.json(
      { ok: true, status: 'duplicate', article_id: existing.id, slug: existing.slug },
      { status: 200 }
    );
  }

  // 4. Resolve category
  const { data: category } = await supabase
    .from('categories')
    .select('id, slug')
    .eq('slug', payload.category_slug)
    .single();

  if (!category) {
    return NextResponse.json({ error: 'Invalid category_slug' }, { status: 400 });
  }

  // 5. Resolve source
  const { data: source } = await supabase
    .from('sources')
    .select('id')
    .eq('name', payload.source_name)
    .maybeSingle();

  // 6. Generate English article
  let englishArticle;
  try {
    englishArticle = await generateEnglishArticle({
      facts: payload.facts,
      category: payload.category_slug,
      source_name: payload.source_name,
    });
  } catch (err: any) {
    await supabase.from('ingestion_log').insert({
      source_url: payload.source_url,
      status: 'failed',
      reason: `Groq generation failed: ${err.message}`,
      raw_payload: payload as any,
    });
    return NextResponse.json({ error: 'AI generation failed', message: err.message }, { status: 500 });
  }

  // 7. Plagiarism check
  const plagiarismScore = estimatePlagiarismScore(
    payload.facts,
    `${englishArticle.what_happened} ${englishArticle.why_it_matters} ${englishArticle.future_impact}`
  );

  if (plagiarismScore > 30) {
    await supabase.from('ingestion_log').insert({
      source_url: payload.source_url,
      status: 'rejected',
      reason: `Plagiarism score too high: ${plagiarismScore.toFixed(1)}`,
      raw_payload: payload as any,
    });
    return NextResponse.json(
      { error: 'Generated article failed plagiarism check', score: plagiarismScore },
      { status: 422 }
    );
  }

  // 8. Generate unique slug
  let baseSlug = englishArticle.slug;
  let finalSlug = baseSlug;
  let attempt = 0;
  while (true) {
    const { data: clash } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', finalSlug)
      .maybeSingle();
    if (!clash) break;
    attempt++;
    finalSlug = `${baseSlug}-${attempt}`;
    if (attempt > 5) {
      finalSlug = `${baseSlug}-${Date.now().toString(36)}`;
      break;
    }
  }

  // 9. Cover image
  const coverImage = payload.cover_image_url || generatePlaceholderCover(finalSlug, payload.category_slug);

  // 10. Insert article master record
  const { data: article, error: articleError } = await supabase
    .from('articles')
    .insert({
      slug: finalSlug,
      category_id: category.id,
      source_id: source?.id || null,
      source_url: payload.source_url,
      source_name: payload.source_name,
      source_published_at: payload.source_published_at || null,
      cover_image_url: coverImage,
      cover_image_alt: englishArticle.title,
      cover_image_credit: 'Royalty-free',
      status: 'published',
      is_breaking: payload.is_breaking || false,
      plagiarism_score: plagiarismScore,
      word_count: englishArticle.word_count,
      reading_time_minutes: calculateReadingTime(englishArticle.word_count),
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (articleError || !article) {
    return NextResponse.json({ error: 'DB insert failed', details: articleError }, { status: 500 });
  }

  // 11. Insert English translation
  await supabase.from('article_translations').insert({
    article_id: article.id,
    locale: 'en',
    title: englishArticle.title,
    summary: englishArticle.summary,
    key_highlights: englishArticle.key_highlights,
    what_happened: englishArticle.what_happened,
    why_it_matters: englishArticle.why_it_matters,
    future_impact: englishArticle.future_impact,
    seo_title: englishArticle.seo_title,
    seo_description: englishArticle.seo_description,
    og_title: englishArticle.title,
    og_description: englishArticle.summary,
  });

  // 12. Translate to all other languages (parallel)
  const otherLocales = LOCALES.filter((l) => l !== 'en');
  const translationPromises = otherLocales.map(async (locale) => {
    try {
      const translated = await translateArticle(englishArticle, locale);
      await supabase.from('article_translations').insert({
        article_id: article.id,
        locale,
        title: translated.title,
        summary: translated.summary,
        key_highlights: translated.key_highlights || [],
        what_happened: translated.what_happened,
        why_it_matters: translated.why_it_matters,
        future_impact: translated.future_impact,
        seo_title: translated.seo_title,
        seo_description: translated.seo_description,
        og_title: translated.title,
        og_description: translated.summary,
      });
      return { locale, ok: true };
    } catch (err: any) {
      console.error(`Translation failed for ${locale}:`, err.message);
      return { locale, ok: false, error: err.message };
    }
  });

  const translationResults = await Promise.all(translationPromises);

  // 13. Tags
  if (englishArticle.tags && englishArticle.tags.length > 0) {
    for (const tagName of englishArticle.tags) {
      const tagSlug = slugify(tagName, { lower: true, strict: true });
      const { data: tag } = await supabase
        .from('tags')
        .upsert({ slug: tagSlug, name: tagName }, { onConflict: 'slug' })
        .select('id')
        .single();
      if (tag) {
        await supabase.from('article_tags').insert({ article_id: article.id, tag_id: tag.id }).select();
      }
    }
  }

  // 14. Log success
  await supabase.from('ingestion_log').insert({
    source_id: source?.id || null,
    source_url: payload.source_url,
    status: 'success',
    article_id: article.id,
  });

  return NextResponse.json(
    {
      ok: true,
      status: 'published',
      article_id: article.id,
      slug: finalSlug,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/en/article/${finalSlug}`,
      plagiarism_score: plagiarismScore.toFixed(1),
      translations: translationResults,
    },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Dinand News Ingest API',
    method: 'POST',
    auth: 'Bearer token via INGEST_API_SECRET',
    schema: {
      source_url: 'string (URL, required)',
      source_name: 'string (required)',
      source_published_at: 'ISO date string (optional)',
      category_slug: 'one of: breaking, india, tech, business, startup, auto, sports, entertainment',
      facts: 'extracted facts text (required, min 50 chars)',
      is_breaking: 'boolean (optional)',
      cover_image_url: 'royalty-free image URL (optional)',
    },
  });
}
