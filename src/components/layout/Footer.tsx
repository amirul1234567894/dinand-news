import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/types';

export default function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className="bg-ink-900 text-ink-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-2xl font-bold text-ink-50 mb-2">
              Dinand <span className="text-saffron-400">News</span>
            </h3>
            <p className="text-sm text-ink-400 leading-relaxed">
              Independent, transparent daily news for India — sourced only from official press releases and verified channels.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-ink-50 text-sm uppercase tracking-wider mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/category/india`} className="hover:text-saffron-400">{tNav('india')}</Link></li>
              <li><Link href={`/${locale}/category/tech`} className="hover:text-saffron-400">{tNav('tech')}</Link></li>
              <li><Link href={`/${locale}/category/business`} className="hover:text-saffron-400">{tNav('business')}</Link></li>
              <li><Link href={`/${locale}/category/sports`} className="hover:text-saffron-400">{tNav('sports')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-ink-50 text-sm uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/about`} className="hover:text-saffron-400">{t('about')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-saffron-400">{t('contact')}</Link></li>
              <li><Link href={`/${locale}/editorial-policy`} className="hover:text-saffron-400">{t('editorial_policy')}</Link></li>
              <li><Link href={`/${locale}/fact-check-policy`} className="hover:text-saffron-400">{t('fact_check')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-ink-50 text-sm uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/privacy-policy`} className="hover:text-saffron-400">{t('privacy')}</Link></li>
              <li><Link href={`/${locale}/terms`} className="hover:text-saffron-400">{t('terms')}</Link></li>
              <li><Link href={`/${locale}/disclaimer`} className="hover:text-saffron-400">{t('disclaimer')}</Link></li>
              <li><Link href={`/${locale}/dmca`} className="hover:text-saffron-400">{t('dmca')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-800 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} Dinand News. {t('rights')}
          </p>
          <p className="text-xs text-ink-400">
            🇮🇳 {t('made_in_india')}
          </p>
        </div>
      </div>
    </footer>
  );
}
