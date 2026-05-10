import Groq from 'groq-sdk';
import slugify from 'slugify';
import type { GeneratedArticle, Locale } from '@/types';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = 'llama-3.3-70b-versatile';

const LANGUAGE_NAMES: Record<Locale, string> = {
  en: 'English',
  hi: 'Hindi (हिन्दी)',
  bn: 'Bengali (বাংলা)',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  mr: 'Marathi (मराठी)',
};

/**
 * Generate a fully transformed English article from extracted facts.
 * NEVER copies original wording. Plagiarism similarity must be < 30%.
 */
export async function generateEnglishArticle(params: {
  facts: string;
  category: string;
  source_name: string;
}): Promise<GeneratedArticle> {
  const { facts, category, source_name } = params;

  const systemPrompt = `You are the senior editor of Dinand News, an independent Indian news platform.

CRITICAL RULES (FOLLOW STRICTLY):
1. NEVER copy any wording from the source. Rewrite EVERYTHING in your own words.
2. Use a clear, professional, human editorial tone — NOT generic AI tone.
3. Word count: 500-700 words for "what_happened" + "why_it_matters" + "future_impact" combined.
4. Plagiarism similarity must be below 30%. Restructure sentences, change vocabulary, reorder ideas.
5. NEVER reproduce headlines verbatim — write a fresh, original SEO title.
6. Add value through analysis, context, and implications — not just rephrasing.
7. Indian context: Where relevant, explain how this affects Indian readers/economy/policy.
8. Never invent facts. Only use what's in the provided facts. If something is unknown, say so or omit.

OUTPUT FORMAT: Pure JSON, no markdown fences, no commentary.`;

  const userPrompt = `Source: ${source_name}
Category: ${category}

Extracted facts:
"""
${facts}
"""

Generate a Dinand News article as JSON with these exact keys:
{
  "title": "Original SEO-optimized headline, 50-70 chars, never matches source headline",
  "summary": "Crisp 2-line summary (max 200 chars total)",
  "key_highlights": ["bullet 1", "bullet 2", "bullet 3", "bullet 4"],
  "what_happened": "200-300 words describing the event in fresh wording",
  "why_it_matters": "150-200 words on significance and stakes",
  "future_impact": "100-150 words on what comes next",
  "seo_title": "60-70 char SEO title (can match title)",
  "seo_description": "150-160 char meta description",
  "slug": "url-friendly-slug-from-title",
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}

Return ONLY the JSON object. No prose, no markdown.`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 2500,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from Groq');

  const parsed = JSON.parse(content);

  // Compute word count
  const allText = `${parsed.what_happened} ${parsed.why_it_matters} ${parsed.future_impact}`;
  const word_count = allText.split(/\s+/).filter(Boolean).length;

  // Sanitize slug
  const slug = slugify(parsed.slug || parsed.title, {
    lower: true,
    strict: true,
    trim: true,
  }).slice(0, 80);

  return {
    title: parsed.title,
    summary: parsed.summary,
    key_highlights: parsed.key_highlights || [],
    what_happened: parsed.what_happened,
    why_it_matters: parsed.why_it_matters,
    future_impact: parsed.future_impact || '',
    seo_title: parsed.seo_title || parsed.title,
    seo_description: parsed.seo_description || parsed.summary,
    slug,
    tags: parsed.tags || [],
    word_count,
  };
}

/**
 * Translate an English article into a target Indian language.
 * Uses Groq (free, high-quality, context-aware).
 */
export async function translateArticle(
  article: GeneratedArticle,
  targetLocale: Locale
): Promise<Omit<GeneratedArticle, 'slug' | 'word_count' | 'tags'>> {
  if (targetLocale === 'en') {
    return article;
  }

  const langName = LANGUAGE_NAMES[targetLocale];

  const systemPrompt = `You are a professional news translator for Indian audiences.
Translate the article into natural, native-sounding ${langName}.
- Preserve all facts exactly.
- Use natural ${langName} idioms — do NOT translate word-for-word.
- Keep technical terms in English where that's the local convention (e.g. "AI", "startup").
- Keep the tone professional and human.
- Output PURE JSON only, no markdown.`;

  const userPrompt = `Translate this article into ${langName}:

${JSON.stringify({
    title: article.title,
    summary: article.summary,
    key_highlights: article.key_highlights,
    what_happened: article.what_happened,
    why_it_matters: article.why_it_matters,
    future_impact: article.future_impact,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
  }, null, 2)}

Return JSON with the SAME keys, with all string values translated to ${langName}.`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 2500,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Empty translation response');

  return JSON.parse(content);
}

/**
 * Estimate plagiarism similarity (cheap heuristic).
 * Compares n-gram overlap between facts and generated content.
 */
export function estimatePlagiarismScore(originalFacts: string, generatedText: string): number {
  const ngrams = (text: string, n = 4) => {
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    const grams = new Set<string>();
    for (let i = 0; i <= words.length - n; i++) {
      grams.add(words.slice(i, i + n).join(' '));
    }
    return grams;
  };

  const originalNgrams = ngrams(originalFacts);
  const generatedNgrams = ngrams(generatedText);

  if (originalNgrams.size === 0) return 0;

  let overlap = 0;
  for (const gram of generatedNgrams) {
    if (originalNgrams.has(gram)) overlap++;
  }

  return Math.min(100, (overlap / originalNgrams.size) * 100);
}
