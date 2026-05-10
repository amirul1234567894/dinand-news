export const dynamic = 'force-dynamic';
export const revalidate = 3600;

import { fetchAllPublishedSlugs } from '@/lib/articles';
import { LOCALES } from '@/types';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://news.autoflowa.in';
  const articles = await fetchAllPublishedSlugs();

  const staticPages = ['', '/about', '/contact', '/privacy-policy', '/terms', '/disclaimer', '/editorial-policy', '/fact-check-policy', '/dmca', '/search'];
  const categories = ['breaking', 'india', 'tech', 'business', 'startup', 'auto', 'sports', 'entertainment'];

  const urls: string[] = [];

  // Homepage + static pages × all locales
  for (const locale of LOCALES) {
    for (const path of staticPages) {
      urls.push(`
  <url>
    <loc>${baseUrl}/${locale}${path}</loc>
    <changefreq>${path === '' ? 'hourly' : 'monthly'}</changefreq>
    <priority>${path === '' ? '1.0' : '0.5'}</priority>
    ${LOCALES.map(l => `<xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/${l}${path}"/>`).join('\n    ')}
  </url>`);
    }

    // Category pages
    for (const cat of categories) {
      urls.push(`
  <url>
    <loc>${baseUrl}/${locale}/category/${cat}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`);
    }
  }

  // Articles × all locales
  for (const article of articles) {
    for (const locale of LOCALES) {
      urls.push(`
  <url>
    <loc>${baseUrl}/${locale}/article/${article.slug}</loc>
    <lastmod>${new Date(article.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    ${LOCALES.map(l => `<xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/${l}/article/${article.slug}"/>`).join('\n    ')}
  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
