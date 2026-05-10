import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'errors' });

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="font-display text-7xl font-bold text-saffron-700 mb-4">404</p>
      <h1 className="font-display text-3xl font-bold mb-4">{t('not_found')}</h1>
      <p className="text-ink-600 mb-8">{t('not_found_description')}</p>
      <Link
        href={`/${locale}`}
        className="inline-block px-6 py-3 bg-ink-900 text-ink-50 hover:bg-saffron-700 transition-colors rounded font-medium"
      >
        {t('go_home')}
      </Link>
    </div>
  );
}
