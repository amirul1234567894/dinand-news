import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Clock, ExternalLink, Calendar, User } from 'lucide-react';
import { fetchArticleBySlug, fetchArticles } from '@/lib/articles';
import ArticleSchema from '@/components/article/ArticleSchema';
import ArticleCard from '@/components/article/ArticleCard';
import { formatDate } from '@/lib/utils';
import { getCategoryName, type Locale } from '@/types';

export const revalidate = 3600; // ISR: 1 hour

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await fetchArticleBySlug(slug, locale as Locale);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://news.autoflowa.in';
  const url = `${baseUrl}/${locale}/article/${slug}`;

  return {
    title: article.translation.seo_title || article.translation.title,
    description: article.translation.seo_description || article.translation.summary,
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/article/${slug}`,
        hi: `${baseUrl}/hi/article/${slug}`,
        bn: `${baseUrl}/bn/article/${slug}`,
        ta: `${baseUrl}/ta/article/${slug}`,
        te: `${baseUrl}/te/article/${slug}`,
        mr: `${baseUrl}/mr/article/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title: article.translation.og_title || article.translation.title,
      description: article.translation.og_description || article.translation.summary,
      url,
      siteName: 'Dinand News',
      images: article.cover_image_url ? [{ url: article.cover_image_url, width: 1200, height: 630 }] : [],
      publishedTime: article.published_at || undefined,
      modifiedTime: article.updated_at,
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.translation.title,
      description: article.translation.summary,
      images: article.cover_image_url ? [article.cover_image_url] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'article' });

  const article = await fetchArticleBySlug(slug, locale as Locale);
  if (!article) notFound();

  const related = await fetchArticles({
    locale: locale as Locale,
    limit: 4,
    exclude_id: article.id,
    category_slug: article.category?.slug,
  });

  const categoryName = article.category ? getCategoryName(article.category, locale as Locale) : null;

  return (
    <>
      <ArticleSchema article={article} locale={locale as Locale} />

      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-xs text-ink-500 mb-6 flex items-center gap-2">
          <Link href={`/${locale}`} className="hover:text-saffron-700">Home</Link>
          {article.category && (
            <>
              <span>/</span>
              <Link
                href={`/${locale}/category/${article.category.slug}`}
                className="hover:text-saffron-700"
              >
                {categoryName}
              </Link>
            </>
          )}
        </nav>

        {/* Header */}
        <header className="mb-8">
          {categoryName && (
            <span className="inline-block px-3 py-1 bg-saffron-700 text-ink-50 text-xs uppercase tracking-widest font-bold mb-4">
              {categoryName}
            </span>
          )}
          <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight text-ink-950 mb-4">
            {article.translation.title}
          </h1>
          <p className="text-lg md:text-xl text-ink-600 leading-relaxed font-serif">
            {article.translation.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 pb-6 border-b border-ink-200 text-sm text-ink-500">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" /> Dinand News Editorial Team
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {article.published_at && formatDate(article.published_at)}
            </span>
            {article.reading_time_minutes && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.reading_time_minutes} {t('min_read')}
              </span>
            )}
          </div>
        </header>

        {/* Cover image */}
        {article.cover_image_url && (
          <figure className="mb-8 -mx-4 md:mx-0">
            <div className="relative aspect-[16/9] bg-ink-100 overflow-hidden">
              <Image
                src={article.cover_image_url}
                alt={article.cover_image_alt || article.translation.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            {article.cover_image_credit && (
              <figcaption className="text-xs text-ink-500 px-4 md:px-0 mt-2">
                Image: {article.cover_image_credit}
              </figcaption>
            )}
          </figure>
        )}

        {/* Key Highlights */}
        {article.translation.key_highlights && article.translation.key_highlights.length > 0 && (
          <section className="mb-8 bg-saffron-50 border-l-4 border-saffron-600 p-5">
            <h2 className="font-display text-lg font-bold mb-3 text-ink-950">
              {t('key_highlights')}
            </h2>
            <ul className="space-y-2">
              {article.translation.key_highlights.map((point, i) => (
                <li key={i} className="flex gap-2 text-ink-800">
                  <span className="text-saffron-700 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Content */}
        <div className="article-content">
          <h2>{t('what_happened')}</h2>
          <p>{article.translation.what_happened}</p>

          <h2>{t('why_it_matters')}</h2>
          <p>{article.translation.why_it_matters}</p>

          {article.translation.future_impact && (
            <>
              <h2>{t('future_impact')}</h2>
              <p>{article.translation.future_impact}</p>
            </>
          )}
        </div>

        {/* Source attribution (CRITICAL for copyright safety) */}
        <section className="mt-10 p-5 bg-ink-100 border border-ink-200 rounded">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-700 mb-2">
            {t('source')}
          </h3>
          <p className="text-sm text-ink-600 mb-3">
            This article is based on an official announcement from{' '}
            <strong>{article.source_name}</strong>.
          </p>
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-saffron-700 hover:text-saffron-800"
          >
            <ExternalLink className="w-4 h-4" />
            {t('read_source')}
          </a>
        </section>

        {/* AI disclosure */}
        <p className="mt-6 text-xs text-ink-500 italic leading-relaxed border-t border-ink-200 pt-4">
          {t('ai_disclosure')}
        </p>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 border-t border-ink-200 mt-12">
          <h2 className="font-display text-2xl font-bold mb-6">{t('related')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} locale={locale as Locale} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
