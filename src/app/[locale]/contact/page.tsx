export const dynamic = 'force-dynamic';

import { setRequestLocale } from 'next-intl/server';


export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 article-content">
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
      <p className="text-xl text-ink-600 mb-8">We respond within 48 working hours.</p>

      <h2>Editorial</h2>
      <p>
        For story tips, factual corrections, or feedback on coverage:<br />
        <a href="mailto:editorial@autoflowa.in">editorial@autoflowa.in</a>
      </p>

      <h2>Copyright & DMCA</h2>
      <p>
        For takedown requests or copyright concerns, please review our{' '}
        <a href={`/${locale}/dmca`}>DMCA Policy</a>, then write to{' '}
        <a href="mailto:dmca@autoflowa.in">dmca@autoflowa.in</a>.
      </p>

      <h2>Advertising & Partnerships</h2>
      <p>
        For advertising inquiries: <a href="mailto:ads@autoflowa.in">ads@autoflowa.in</a>
      </p>

      <h2>Postal Address</h2>
      <p>
        Autoflowa Media<br />
        Kolkata, West Bengal, India
      </p>
    </article>
  );
}
