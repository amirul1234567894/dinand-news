export type Locale = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr';

export const LOCALES: Locale[] = ['en', 'hi', 'bn', 'ta', 'te', 'mr'];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  mr: 'मराठी',
};

export type ArticleStatus = 'pending' | 'published' | 'rejected' | 'draft';
export type SourceType = 'rss' | 'api' | 'official_blog' | 'press_release' | 'government';

export interface Article {
  id: string;
  slug: string;
  category_id: string | null;
  source_id: string | null;
  source_url: string;
  source_name: string;
  source_published_at: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  cover_image_credit: string | null;
  status: ArticleStatus;
  is_breaking: boolean;
  is_trending: boolean;
  is_featured: boolean;
  plagiarism_score: number | null;
  word_count: number | null;
  reading_time_minutes: number | null;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleTranslation {
  id: string;
  article_id: string;
  locale: Locale;
  title: string;
  summary: string;
  key_highlights: string[];
  what_happened: string;
  why_it_matters: string;
  future_impact: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_title: string | null;
  og_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_hi: string | null;
  name_bn: string | null;
  name_ta: string | null;
  name_te: string | null;
  name_mr: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

export interface Source {
  id: string;
  name: string;
  url: string;
  type: SourceType;
  category: string | null;
  is_active: boolean;
  trust_score: number;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
  usage_count: number;
}

/** Article with its translations and category - used in UI */
export interface ArticleWithTranslation extends Article {
  translation: ArticleTranslation;
  category: Category | null;
  tags?: Tag[];
}

/** Payload sent from n8n to /api/ingest */
export interface IngestPayload {
  source_url: string;
  source_name: string;
  source_published_at?: string;
  category_slug: string;
  facts: string;
  is_breaking?: boolean;
  cover_image_url?: string;
}

/** AI-generated article content (one language) */
export interface GeneratedArticle {
  title: string;
  summary: string;
  key_highlights: string[];
  what_happened: string;
  why_it_matters: string;
  future_impact: string;
  seo_title: string;
  seo_description: string;
  slug: string;
  tags: string[];
  word_count: number;
}

export function getCategoryName(category: Category, locale: Locale): string {
  const map: Record<Locale, string | null> = {
    en: category.name_en,
    hi: category.name_hi,
    bn: category.name_bn,
    ta: category.name_ta,
    te: category.name_te,
    mr: category.name_mr,
  };
  return map[locale] || category.name_en;
}
