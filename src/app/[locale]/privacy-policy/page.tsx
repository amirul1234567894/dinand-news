export const dynamic = 'force-dynamic';

import { setRequestLocale } from 'next-intl/server';


export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 article-content">
      <h1 className="font-display text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-ink-500 mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <p>
        Dinand News (operated by Autoflowa Media) is committed to protecting your privacy. This policy
        explains what we collect, how we use it, and your rights under India's Digital Personal Data
        Protection Act 2023 (DPDP Act) and the EU GDPR.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        <strong>Anonymous usage data:</strong> We log page views, referrer URLs, country (city-level), and
        anonymized device information to understand which articles readers find useful.
      </p>
      <p>
        <strong>Cookies:</strong> We use essential cookies to remember your language preference and consent
        choices. With your consent, we also use analytics and advertising cookies (Google Analytics, Google
        AdSense).
      </p>
      <p>
        <strong>Submitted information:</strong> If you contact us via email, we keep your message and email
        address only for the purpose of responding to you.
      </p>

      <h2>2. How We Use Information</h2>
      <p>To deliver and improve Dinand News, measure traffic, prevent abuse, and (with your consent) display
        relevant advertising.</p>

      <h2>3. Advertising</h2>
      <p>
        Dinand News uses Google AdSense to display advertisements. Google may use cookies to serve ads based
        on your visits to this and other websites. You can opt out of personalized ads via{' '}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>.
      </p>

      <h2>4. Data Sharing</h2>
      <p>
        We do not sell your personal data. We share data only with: (a) hosting and analytics providers
        (Vercel, Supabase, Google Analytics), (b) advertising partners as described above, and (c) law
        enforcement when legally required.
      </p>

      <h2>5. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Request access to data we hold about you</li>
        <li>Request correction or deletion</li>
        <li>Withdraw consent for cookies and advertising</li>
        <li>File a complaint with India's Data Protection Board</li>
      </ul>
      <p>
        Exercise these rights by writing to <a href="mailto:privacy@autoflowa.in">privacy@autoflowa.in</a>.
      </p>

      <h2>6. Data Retention</h2>
      <p>Analytics data is retained for 26 months. Email correspondence is retained for 2 years.</p>

      <h2>7. Children</h2>
      <p>Dinand News is not directed at children under 18. We do not knowingly collect data from minors.</p>

      <h2>8. Changes</h2>
      <p>
        We may update this policy. Material changes will be announced on the homepage at least 14 days before
        taking effect.
      </p>

      <h2>9. Contact</h2>
      <p>
        Data Protection Officer: <a href="mailto:privacy@autoflowa.in">privacy@autoflowa.in</a>
      </p>
    </article>
  );
}
