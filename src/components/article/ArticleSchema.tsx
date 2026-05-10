import type { ArticleWithTranslation, Locale } from '@/types';

export default function ArticleSchema({
  article,
  locale,
}: {
  article: ArticleWithTranslation;
  locale: Locale;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://news.autoflowa.in';
  const url = `${baseUrl}/${locale}/article/${article.slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.translation.title,
    description: article.translation.summary,
    image: article.cover_image_url ? [article.cover_image_url] : undefined,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Organization',
      name: 'Dinand News Editorial Team',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dinand News',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 841,
        height: 240,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: article.category?.name_en,
    inLanguage: locale,
    isAccessibleForFree: true,
    isBasedOn: article.source_url,
    citation: {
      '@type': 'CreativeWork',
      url: article.source_url,
      publisher: { '@type': 'Organization', name: article.source_name },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
