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
  // Use a deterministic Unsplash collection or a generated SVG placeholder
  const seed = slug.charCodeAt(0) + slug.length;
  const collections: Record<string, string> = {
    tech: '2243781',
    business: '3330448',
    india: '1080368',
    sports: '4458655',
    entertainment: '317099',
    auto: '1118895',
    startup: '317099',
    breaking: '1080368',
    trending: '317099',
  };
  const collectionId = collections[category] || '1080368';
  return `https://source.unsplash.com/collection/${collectionId}/1200x630?sig=${seed}`;
}
