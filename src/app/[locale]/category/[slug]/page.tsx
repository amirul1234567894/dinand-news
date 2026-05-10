export const dynamic = 'force-dynamic';

import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchArticles, fetchCategories } from '@/lib/articles';
import ArticleCard from '@/components/article/ArticleCard';
import { getCategoryName, type Locale } from '@/types';

export const revalidate = 600;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const categories = await fetchCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return { title: 'Category Not Found' };

  const name = getCategoryName(cat, locale as Locale);
  return {
    title: `${name} News`,
    description: `Latest ${name} news, official announcements, and verified updates from Dinand News.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const categories = await fetchCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const articles = await fetchArticles({
    locale: locale as Locale,
    category_slug: slug,
    limit: 30,
  });

  const name = getCategoryName(category, locale as Locale);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8 pb-6 border-b-2 border-ink-900">
        <p className="text-xs uppercase tracking-widest text-saffron-700 font-bold mb-2">Category</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-950">{name}</h1>
        {category.description && (
          <p className="text-ink-600 mt-3 max-w-2xl">{category.description}</p>
        )}
      </header>

      {articles.length === 0 ? (
        <div className="py-16 text-center bg-ink-100 rounded">
          <p className="text-ink-500">No articles in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} locale={locale as Locale} />
          ))}
        </div>
      )}
    </div>
  );
}
