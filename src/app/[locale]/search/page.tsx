export const dynamic = 'force-dynamic';

import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Search } from 'lucide-react';
import { searchArticles } from '@/lib/articles';
import ArticleCard from '@/components/article/ArticleCard';
import type { Locale } from '@/types';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'search' });

  const results = q ? await searchArticles(q, locale as Locale) : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl font-bold mb-6">{t('title')}</h1>

      <form method="get" className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
          <input
            type="search"
            name="q"
            defaultValue={q || ''}
            placeholder={t('placeholder')}
            className="w-full pl-12 pr-4 py-4 border-2 border-ink-300 focus:border-saffron-600 outline-none text-lg bg-ink-50 rounded"
            autoFocus
          />
        </div>
      </form>

      {q && (
        <p className="text-sm text-ink-600 mb-6">
          {t('results_for')}: <strong>"{q}"</strong> · {results.length} found
        </p>
      )}

      {q && results.length === 0 && (
        <p className="text-ink-500 py-12 text-center">{t('no_results')}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((a) => (
          <ArticleCard key={a.id} article={a} locale={locale as Locale} />
        ))}
      </div>
    </div>
  );
}
