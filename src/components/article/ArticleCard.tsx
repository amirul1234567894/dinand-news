import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import type { ArticleWithTranslation, Locale } from '@/types';
import { getCategoryName } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

interface Props {
  article: ArticleWithTranslation;
  locale: Locale;
  variant?: 'default' | 'featured' | 'compact';
}

export default function ArticleCard({ article, locale, variant = 'default' }: Props) {
  const { translation, category } = article;
  const href = `/${locale}/article/${article.slug}`;
  const categoryName = category ? getCategoryName(category, locale) : null;

  if (variant === 'featured') {
    return (
      <article className="group relative overflow-hidden bg-ink-900 text-ink-50 aspect-[16/10]">
        <Link href={href} className="absolute inset-0">
          {article.cover_image_url && (
            <Image
              src={article.cover_image_url}
              alt={article.cover_image_alt || translation.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            {categoryName && (
              <span className="inline-block px-2 py-1 bg-saffron-600 text-ink-50 text-xs uppercase tracking-widest font-bold mb-3">
                {categoryName}
              </span>
            )}
            <h2 className="font-display text-2xl md:text-4xl font-bold leading-tight mb-2 group-hover:text-saffron-200 transition-colors">
              {translation.title}
            </h2>
            <p className="text-ink-200 text-sm md:text-base line-clamp-2 max-w-3xl">
              {translation.summary}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group flex gap-3 py-3 border-b border-ink-200 last:border-0">
        <Link href={href} className="flex gap-3 flex-1">
          {article.cover_image_url && (
            <div className="relative shrink-0 w-20 h-20 bg-ink-100 overflow-hidden rounded">
              <Image
                src={article.cover_image_url}
                alt={article.cover_image_alt || translation.title}
                fill
                sizes="80px"
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {categoryName && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700">
                {categoryName}
              </span>
            )}
            <h3 className="font-display font-semibold text-sm leading-snug line-clamp-3 mt-1 group-hover:text-saffron-700 transition-colors">
              {translation.title}
            </h3>
            <p className="text-xs text-ink-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.published_at && formatRelativeTime(article.published_at)}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  // Default
  return (
    <article className="group bg-ink-50 border border-ink-200 hover:border-saffron-400 transition-colors overflow-hidden">
      <Link href={href} className="block">
        {article.cover_image_url && (
          <div className="relative aspect-[16/9] bg-ink-100 overflow-hidden">
            <Image
              src={article.cover_image_url}
              alt={article.cover_image_alt || translation.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-5">
          {categoryName && (
            <span className="text-[11px] font-bold uppercase tracking-widest text-saffron-700">
              {categoryName}
            </span>
          )}
          <h3 className="font-display text-xl font-semibold leading-tight mt-2 mb-2 group-hover:text-saffron-700 transition-colors line-clamp-3">
            {translation.title}
          </h3>
          <p className="text-sm text-ink-600 line-clamp-2 leading-relaxed">
            {translation.summary}
          </p>
          <div className="flex items-center gap-3 mt-4 text-xs text-ink-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.published_at && formatRelativeTime(article.published_at)}
            </span>
            {article.reading_time_minutes && (
              <span>{article.reading_time_minutes} min read</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
