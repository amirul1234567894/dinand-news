import { setRequestLocale } from 'next-intl/server';

export default async function DMCAPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 article-content">
      <h1 className="font-display text-4xl font-bold mb-4">DMCA & Copyright Policy</h1>

      <h2>Our Position on Copyright</h2>
      <p>
        Dinand News respects copyright. Our editorial policy explicitly forbids the republishing of
        copyrighted articles, headlines, or images. Every article on this site is an original summary based
        on publicly available official sources, with a link back to that source.
      </p>

      <h2>If You Believe Your Copyright Has Been Infringed</h2>
      <p>
        If you are a copyright owner (or authorized to act on behalf of one) and believe that material on
        Dinand News infringes your rights, please send a written notice to{' '}
        <a href="mailto:dmca@autoflowa.in">dmca@autoflowa.in</a> containing:
      </p>
      <ol>
        <li>Your full legal name and contact information.</li>
        <li>A description of the copyrighted work you believe has been infringed.</li>
        <li>The exact URL on Dinand News where the alleged infringement appears.</li>
        <li>A statement, made in good faith, that the use is not authorized by the copyright owner, its agent, or the law.</li>
        <li>A statement, under penalty of perjury, that the information in your notice is accurate and that you are the owner or authorized to act on the owner's behalf.</li>
        <li>Your physical or electronic signature.</li>
      </ol>

      <h2>Our Response</h2>
      <p>
        We aim to acknowledge valid notices within 48 hours and to take down or modify the disputed content
        within 72 hours of confirmation. We will inform you of the outcome.
      </p>

      <h2>Counter-Notices</h2>
      <p>
        If you believe content was removed in error, you may submit a counter-notice to the same email
        address with a clear explanation and contact details.
      </p>

      <h2>Repeat Infringers</h2>
      <p>
        We take repeat infringement seriously. If a source we summarize is the subject of multiple valid
        complaints, we will remove it from our whitelist.
      </p>
    </article>
  );
}
