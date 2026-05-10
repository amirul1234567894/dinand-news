export const dynamic = 'force-dynamic';

import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { fetchArticles, fetchCategories } from '@/lib/articles';
import ArticleCard from '@/components/article/ArticleCard';
import { ChevronRight } from 'lucide-react';
import { getCategoryName, type Locale } from '@/types';

export const revalidate = 600; // ISR: refresh every 10 minutes

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });

  const [breaking, trending, latest, categories] = await Promise.all([
    fetchArticles({ locale: locale as Locale, is_breaking: true, limit: 1 }),
    fetchArticles({ locale: locale as Locale, is_trending: true, limit: 4 }),
    fetchArticles({ locale: locale as Locale, limit: 12 }),
    fetchCategories(),
  ]);

  const featured = breaking[0] || latest[0];
  const remainingLatest = latest.filter((a) => a.id !== featured?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* HERO + TRENDING */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {featured && (
          <div className="lg:col-span-2">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                {t('breaking_now')}
              </h2>
            </div>
            <ArticleCard article={featured} locale={locale as Locale} variant="featured" />
          </div>
        )}

        <aside>
          <h2 className="font-display text-xl font-bold mb-3">{t('trending_today')}</h2>
          <div className="bg-ink-50 border border-ink-200 px-4">
            {trending.length > 0 ? (
              trending.map((article) => (
                <ArticleCard key={article.id} article={article} locale={locale as Locale} variant="compact" />
              ))
            ) : (
              <p className="py-8 text-sm text-ink-500 text-center">No trending stories yet.</p>
            )}
          </div>
        </aside>
      </section>

      {/* LATEST */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-6 border-b-2 border-ink-900 pb-2">
          <h2 className="font-display text-2xl font-bold">{t('latest_updates')}</h2>
          <Link
            href={`/${locale}/category/india`}
            className="text-sm font-medium text-saffron-700 hover:text-saffron-800 flex items-center gap-1"
          >
            {t('view_all')}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {remainingLatest.length === 0 ? (
          <div className="text-center py-16 bg-ink-100 rounded">
            <p className="text-ink-500">No articles published yet.</p>
            <p className="text-xs text-ink-400 mt-1">The automation will publish at 5:00 AM IST daily.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingLatest.map((article) => (
              <ArticleCard key={article.id} article={article} locale={locale as Locale} />
            ))}
          </div>
        )}
      </section>

      {/* CATEGORIES */}
      <section>
        <h2 className="font-display text-2xl font-bold mb-6 border-b-2 border-ink-900 pb-2">
          {t('by_category')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}/category/${cat.slug}`}
              className="group bg-ink-900 hover:bg-saffron-700 text-ink-50 px-4 py-6 text-center transition-colors rounded"
            >
              <h3 className="font-display text-lg font-semibold">
                {getCategoryName(cat, locale as Locale)}
              </h3>
              <p className="text-xs text-ink-400 group-hover:text-ink-100 uppercase tracking-wider mt-1">
                {cat.slug}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
