'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function CookieBanner() {
  const t = useTranslations('cookie');
  const locale = useLocale();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('dinand_cookie_consent');
    if (!consent) setShow(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('dinand_cookie_consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('dinand_cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink-900 text-ink-100 border-t-2 border-saffron-600 shadow-xl">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <p className="text-sm text-ink-200 max-w-3xl">
          {t('message')}{' '}
          <Link
            href={`/${locale}/privacy-policy`}
            className="text-saffron-400 underline hover:text-saffron-300"
          >
            {t('learn_more')}
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm border border-ink-600 text-ink-200 hover:bg-ink-800 rounded transition-colors"
          >
            {t('decline')}
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-sm bg-saffron-600 hover:bg-saffron-700 text-ink-50 font-medium rounded transition-colors"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
