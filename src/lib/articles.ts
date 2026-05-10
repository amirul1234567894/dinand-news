import { createServerSupabase, createAdminSupabase } from './supabase';
import type { ArticleWithTranslation, Locale, Category } from '@/types';

interface FetchArticlesOptions {
  locale: Locale;
  limit?: number;
  offset?: number;
  category_slug?: string;
  is_breaking?: boolean;
  is_trending?: boolean;
  is_featured?: boolean;
  exclude_id?: string;
}

export async function fetchArticles(opts: FetchArticlesOptions): Promise<ArticleWithTranslation[]> {
  const supabase = await createServerSupabase();
  const { locale, limit = 20, offset = 0, category_slug, is_breaking, is_trending, is_featured, exclude_id } = opts;

  let query = supabase
    .from('articles')
    .select(`
      *,
      translation:article_translations!inner(*),
      category:categories(*)
    `)
    .eq('status', 'published')
    .eq('article_translations.locale', locale)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category_slug) {
    query = query.eq('categories.slug', category_slug);
  }
  if (is_breaking) query = query.eq('is_breaking', true);
  if (is_trending) query = query.eq('is_trending', true);
  if (is_featured) query = query.eq('is_featured', true);
  if (exclude_id) query = query.neq('id', exclude_id);

  const { data, error } = await query;
  if (error) {
    console.error('fetchArticles error:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    ...row,
    translation: Array.isArray(row.translation) ? row.translation[0] : row.translation,
    category: row.category,
  }));
}

export async function fetchArticleBySlug(slug: string, locale: Locale): Promise<ArticleWithTranslation | null> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      translation:article_translations(*),
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;

  // Pick the correct translation, fallback to English
  const translations = Array.isArray(data.translation) ? data.translation : [data.translation];
  const translation =
    translations.find((t: any) => t.locale === locale) ||
    translations.find((t: any) => t.locale === 'en') ||
    translations[0];

  if (!translation) return null;

  return { ...data, translation, category: data.category };
}

export async function fetchCategories(): Promise<Category[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) {
    console.error('fetchCategories error:', error);
    return [];
  }
  return data || [];
}

export async function searchArticles(query: string, locale: Locale, limit = 20): Promise<ArticleWithTranslation[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from('article_translations')
    .select(`
      *,
      article:articles!inner(*, category:categories(*))
    `)
    .eq('locale', locale)
    .textSearch('title', query, { type: 'websearch' })
    .eq('article.status', 'published')
    .limit(limit);

  if (error) {
    console.error('searchArticles error:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    ...row.article,
    translation: row,
    category: row.article.category,
  }));
}

export async function incrementViewCount(articleId: string): Promise<void> {
  const supabase = createAdminSupabase();
  await supabase.rpc('increment', { article_id: articleId }).catch(() => {
    // Fallback: direct update
    supabase
      .from('articles')
      .update({ view_count: 1 })
      .eq('id', articleId)
      .then(() => {});
  });
}

export async function fetchAllPublishedSlugs(): Promise<Array<{ slug: string; updated_at: string }>> {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(5000);

  if (error) return [];
  return data || [];
}
