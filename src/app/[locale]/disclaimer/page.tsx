import { setRequestLocale } from 'next-intl/server';

export default async function DisclaimerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 article-content">
      <h1 className="font-display text-4xl font-bold mb-4">Disclaimer</h1>

      <h2>General Information Only</h2>
      <p>
        Articles on Dinand News are summaries of publicly available official sources, prepared by our
        editorial team with AI assistance. They are intended for general information only and do not
        constitute professional advice of any kind.
      </p>

      <h2>AI-Assisted Editorial Process</h2>
      <p>
        We disclose this clearly: Dinand News uses AI tools to draft summaries from official sources, and to
        translate articles into India's major languages. Every article is structured around a verified
        primary source which is linked in the article. We do not invent facts and we do not republish
        copyrighted text from other publishers.
      </p>

      <h2>No Investment, Legal, or Medical Advice</h2>
      <p>
        Nothing on Dinand News should be taken as financial, legal, or medical advice. Always consult a
        licensed professional.
      </p>

      <h2>Accuracy & Corrections</h2>
      <p>
        While we take care to summarize sources accurately, errors can happen. If you find one, please
        write to <a href="mailto:editorial@autoflowa.in">editorial@autoflowa.in</a> with the article URL and
        the correction.
      </p>

      <h2>External Links</h2>
      <p>
        Every article links to its primary source. We do not control external content and are not
        responsible for it.
      </p>

      <h2>Trademarks</h2>
      <p>
        All product names, logos, and brands referenced are the property of their respective owners.
        Mention of a product or company does not imply endorsement.
      </p>
    </article>
  );
}
