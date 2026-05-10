import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 min for full pipeline

const SOURCES = [
  { name: 'PIB India', url: 'https://www.pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3', category: 'india' },
  { name: 'India.gov.in', url: 'https://www.india.gov.in/news_feeds/feed/rss', category: 'india' },
  { name: 'Google Blog', url: 'https://blog.google/rss/', category: 'tech' },
  { name: 'OpenAI News', url: 'https://openai.com/news/rss.xml', category: 'tech' },
  { name: 'Microsoft News', url: 'https://news.microsoft.com/feed/', category: 'tech' },
  { name: 'AWS Blog', url: 'https://aws.amazon.com/blogs/aws/feed/', category: 'tech' },
  { name: 'Cloudflare Blog', url: 'https://blog.cloudflare.com/rss/', category: 'tech' },
  { name: 'PR Newswire', url: 'https://www.prnewswire.com/rss/news-releases-list.rss', category: 'business' },
];

interface IngestResult {
  source: string;
  url?: string;
  status?: number;
  slug?: string;
  error?: string;
}

export async function GET(req: NextRequest) {
  // Verify Vercel cron auth header (Vercel automatically sends this for cron routes)
  const authHeader = req.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET || process.env.INGEST_API_SECRET}`;
  if (authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parser = new Parser({ timeout: 15000 });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const ingestSecret = process.env.INGEST_API_SECRET!;
  const results: IngestResult[] = [];

  for (const source of SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      const items = (feed.items || []).slice(0, 3); // top 3 per source

      for (const item of items) {
        const facts = (item.contentSnippet || item.content || item.summary || item.title || '').slice(0, 4000);
        if (facts.length < 50 || !item.link) {
          results.push({ source: source.name, error: 'Insufficient content' });
          continue;
        }

        try {
          const res = await fetch(`${baseUrl}/api/ingest`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${ingestSecret}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              source_url: item.link,
              source_name: source.name,
              source_published_at: item.isoDate || item.pubDate,
              category_slug: source.category,
              facts,
            }),
          });

          const data = await res.json();
          results.push({
            source: source.name,
            url: item.link,
            status: res.status,
            slug: data.slug,
            error: data.error,
          });
        } catch (err: any) {
          results.push({ source: source.name, url: item.link, error: err.message });
        }
      }
    } catch (err: any) {
      results.push({ source: source.name, error: `Feed parse failed: ${err.message}` });
    }
  }

  const summary = {
    total: results.length,
    published: results.filter((r) => r.status === 201).length,
    duplicates: results.filter((r) => r.status === 200).length,
    errors: results.filter((r) => r.error).length,
    timestamp: new Date().toISOString(),
    results,
  };

  return NextResponse.json(summary);
}
