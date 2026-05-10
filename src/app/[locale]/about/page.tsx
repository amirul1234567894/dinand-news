export const dynamic = 'force-dynamic';

import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Dinand News',
  description: 'Dinand News is an independent Indian news platform that publishes only verified, official information from government and corporate press releases.',
};


export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 article-content">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">About Dinand News</h1>
      <p className="text-xl text-ink-600 leading-relaxed mb-8">
        India's transparent, source-first daily news brief — built for readers who want facts before opinion.
      </p>

      <h2>Our Mission</h2>
      <p>
        Dinand News exists to bring Indian readers a clear, fact-checked daily summary of what's happening in
        government, technology, business, sports, and entertainment — drawn directly from official sources.
        We believe news should be transparent about where it comes from. Every article on Dinand News links
        back to its primary source.
      </p>

      <h2>Editorial Philosophy</h2>
      <p>
        We do not scrape news websites. We do not republish articles. Instead, our editorial system reads
        government press releases, official company blogs, public announcements, and verified press
        distribution networks, then produces an original summary that explains what happened, why it matters,
        and what it means for India.
      </p>

      <h2>Sources We Trust</h2>
      <p>
        Government channels (Press Information Bureau, India.gov.in, ISRO and other ministries), official
        corporate blogs (Google, Microsoft, OpenAI, Amazon, Cloudflare, and others), and standard press release
        distribution networks (PR Newswire, GlobeNewswire). We never quote or republish content from
        commercial newspapers or premium news services.
      </p>

      <h2>Our Editorial Team</h2>
      <p>
        Dinand News is operated by Autoflowa Media. Our editorial system combines automated
        fact-extraction with editorial AI assistance, and every published article is reviewed against our
        editorial policy before going live. We disclose this clearly on every article.
      </p>

      <h2>How We Use AI</h2>
      <p>
        We use AI tools to help summarize publicly available official documents and translate articles into
        India's major languages. AI is a drafting tool. The decisions about what to cover, which sources to
        trust, and how to frame each story are guided by our editorial policy. Read our{' '}
        <a href={`/${locale}/editorial-policy`}>Editorial Policy</a> for full details.
      </p>

      <h2>Contact</h2>
      <p>
        Reach the editorial team at <a href="mailto:editorial@autoflowa.in">editorial@autoflowa.in</a>.<br />
        For corrections, please see our <a href={`/${locale}/fact-check-policy`}>Fact Check Policy</a>.<br />
        For copyright concerns, see our <a href={`/${locale}/dmca`}>DMCA</a> page.
      </p>
    </article>
  );
}
