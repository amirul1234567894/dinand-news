export const dynamic = 'force-dynamic';

import { setRequestLocale } from 'next-intl/server';


export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 article-content">
      <h1 className="font-display text-4xl font-bold mb-4">Terms of Use</h1>
      <p className="text-sm text-ink-500 mb-8">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

      <h2>1. Acceptance</h2>
      <p>By accessing Dinand News, you agree to these terms. If you don't agree, please don't use the site.</p>

      <h2>2. License to Use</h2>
      <p>
        Content on Dinand News (text written by our editorial team) is provided for personal, non-commercial
        reading. You may share article links freely. You may not republish full article text without
        permission.
      </p>

      <h2>3. Source Material</h2>
      <p>
        Each article cites and links to a primary source (government press release, official corporate blog,
        or press distribution network). Source content remains the property of its publisher.
      </p>

      <h2>4. Accuracy</h2>
      <p>
        We work hard to summarize official sources accurately. If you spot an error, please follow our{' '}
        <a href={`/${locale}/fact-check-policy`}>Fact Check Policy</a> to request a correction.
      </p>

      <h2>5. No Investment / Legal / Medical Advice</h2>
      <p>
        Articles on business, finance, health, or legal topics are summaries of public information. They are
        not professional advice. Consult a qualified expert before making decisions.
      </p>

      <h2>6. Third-Party Links</h2>
      <p>
        We link to original sources and may link to other websites. We don't control or endorse third-party
        content.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        Dinand News is provided "as is." We are not liable for any losses resulting from use of, or inability
        to use, the site.
      </p>

      <h2>8. Governing Law</h2>
      <p>These terms are governed by the laws of India. Disputes are subject to the courts of Kolkata.</p>

      <h2>9. Contact</h2>
      <p>Questions: <a href="mailto:legal@autoflowa.in">legal@autoflowa.in</a></p>
    </article>
  );
}
