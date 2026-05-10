import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function FactCheckPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 article-content">
      <h1 className="font-display text-4xl font-bold mb-4">Fact Check Policy</h1>

      <h2>Our Verification Standard</h2>
      <p>
        Every article published on Dinand News links to a primary source — a government press release, an
        official corporate announcement, or a press distribution network. We verify each fact against that
        primary source before publication.
      </p>

      <h2>What We Don't Do</h2>
      <ul>
        <li>We don't combine claims from multiple unverified sources without checking each against an official record.</li>
        <li>We don't speculate about motives, intentions, or unconfirmed events.</li>
        <li>We don't republish viral or trending claims without verifying the underlying source.</li>
      </ul>

      <h2>Reporting an Error</h2>
      <p>
        If you spot a factual error, please email{' '}
        <a href="mailto:editorial@autoflowa.in">editorial@autoflowa.in</a> with:
      </p>
      <ul>
        <li>The article URL</li>
        <li>The specific claim you believe is incorrect</li>
        <li>A source that supports the correct information</li>
      </ul>

      <h2>Correction Timeline</h2>
      <p>
        We aim to review correction requests within 24 hours and to publish corrections (if needed) within
        48 hours. Material corrections are noted at the bottom of the article along with the date of the
        update.
      </p>

      <h2>Categories of Updates</h2>
      <ul>
        <li><strong>Correction:</strong> a factual error has been fixed.</li>
        <li><strong>Clarification:</strong> wording was improved to better match the source.</li>
        <li><strong>Update:</strong> new official information has emerged and the article has been updated.</li>
      </ul>
    </article>
  );
}
