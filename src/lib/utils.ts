import { format, formatDistanceToNow } from 'date-fns';

export function calculateReadingTime(wordCount: number): number {
  // Average reading speed: 200 wpm
  return Math.max(1, Math.round(wordCount / 200));
}

export function formatDate(date: string | Date, locale = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMM d, yyyy');
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

export function buildCanonicalUrl(locale: string, path = ''): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://news.autoflowa.in';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}

export function generatePlaceholderCover(slug: string, category: string): string {
  const seed = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const id = (seed % 1000) + 1;
  return `https://picsum.photos/seed/${id}/1200/630`;
}

export async function fetchRelatedImage(title: string, category: string): Promise<string> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return generatePlaceholderCover(title, category);

  const keywords: Record<string, string> = {
    tech: 'technology computer',
    business: 'business finance office',
    india: 'india government',
    startup: 'startup entrepreneur',
    sports: 'sports stadium',
    entertainment: 'entertainment media',
    auto: 'automobile car',
    breaking: 'news breaking',
    trending: 'viral trending',
  };

  const query = encodeURIComponent(`${title} ${keywords[category] || category}`);

  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=1&orientation=landscape`, {
      headers: { Authorization: apiKey },
    });
    const data = await res.json();
    const photo = data?.photos?.[0];
    if (photo) return photo.src.large2x || photo.src.original;
  } catch {
    // fallback to picsum
  }
  return generatePlaceholderCover(title, category);
}
