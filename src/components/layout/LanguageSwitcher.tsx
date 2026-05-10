'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import { LOCALES, LOCALE_NAMES, type Locale } from '@/types';

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const switchLocale = (newLocale: Locale) => {
    // Replace the first segment of the path with the new locale
    const segments = pathname.split('/').filter(Boolean);
    if (LOCALES.includes(segments[0] as Locale)) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    router.push('/' + segments.join('/'));
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 hover:bg-ink-800 rounded transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="font-medium">{LOCALE_NAMES[currentLocale]}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setOpen(false)}
          />
          <ul className="absolute right-0 top-full mt-1 bg-ink-50 text-ink-900 shadow-xl rounded-md py-1 min-w-[160px] z-50 border border-ink-200">
            {LOCALES.map((loc) => (
              <li key={loc}>
                <button
                  onClick={() => switchLocale(loc)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-ink-100 transition-colors ${
                    loc === currentLocale ? 'font-bold text-saffron-700' : ''
                  }`}
                >
                  {LOCALE_NAMES[loc]}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
