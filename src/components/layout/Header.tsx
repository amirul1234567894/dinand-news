'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X, Search } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import type { Locale } from '@/types';

const NAV_ITEMS = [
  { key: 'breaking', slug: 'breaking' },
  { key: 'india', slug: 'india' },
  { key: 'tech', slug: 'tech' },
  { key: 'business', slug: 'business' },
  { key: 'startup', slug: 'startup' },
  { key: 'sports', slug: 'sports' },
  { key: 'entertainment', slug: 'entertainment' },
] as const;

export default function Header({ locale }: { locale: Locale }) {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-ink-50/95 backdrop-blur border-b border-ink-200">
      {/* Top strip */}
      <div className="bg-ink-900 text-ink-100 text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center">
          <span className="font-medium tracking-wide">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>

      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href={`/${locale}`} className="group flex items-center gap-3">
          <div className="w-10 h-10 bg-saffron-700 flex items-center justify-center text-ink-50 font-display font-bold text-xl rounded-sm group-hover:bg-saffron-800 transition-colors">
            द
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold leading-none text-ink-900">
              Dinand <span className="text-saffron-700">News</span>
            </h1>
            <p className="text-[11px] text-ink-500 tracking-wider uppercase mt-0.5">
              India's AI News Brief
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href={`/${locale}/search`}
            aria-label={t('search')}
            className="p-2 hover:bg-ink-100 rounded-full transition-colors"
          >
            <Search className="w-5 h-5" />
          </Link>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? t('close') : t('menu')}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Nav */}
      <nav className={`border-t border-ink-200 bg-ink-50 ${open ? 'block' : 'hidden md:block'}`}>
        <ul className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center gap-1 md:gap-6 py-2 overflow-x-auto no-scrollbar">
          <li>
            <Link
              href={`/${locale}`}
              className="block py-2 text-sm font-medium uppercase tracking-wider text-ink-700 hover:text-saffron-700 transition-colors whitespace-nowrap"
            >
              {t('home')}
            </Link>
          </li>
          {NAV_ITEMS.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/${locale}/category/${item.slug}`}
                className="block py-2 text-sm font-medium uppercase tracking-wider text-ink-700 hover:text-saffron-700 transition-colors whitespace-nowrap"
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
          <li className="md:hidden">
            <Link
              href={`/${locale}/search`}
              className="block py-2 text-sm font-medium uppercase tracking-wider text-ink-700"
            >
              {t('search')}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
