'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const WA_NUMBER = '+85292318254';

const navServices = [
  { href: '/mso', tc: 'Sandbox MSO', sc: 'Sandbox MSO', en: 'Sandbox MSO' },
  { href: '/licensing', tc: 'Sandbox Licensing', sc: 'Sandbox Licensing', en: 'Sandbox Licensing' },
  { href: '/compliance', tc: 'Sandbox Compliance', sc: 'Sandbox Compliance', en: 'Sandbox Compliance' },
];

const navCorporate = [
  { href: '/corporate', tc: 'Sandbox Corporate', sc: 'Sandbox Corporate', en: 'Sandbox Corporate' },
  { href: '/corporate/incorporation', tc: '公司註冊', sc: '公司注册', en: 'Incorporation' },
  { href: '/corporate/secretarial', tc: '公司秘書', sc: '公司秘书', en: 'Company Secretary' },
  { href: '/corporate/accounting', tc: '會計及稅務', sc: '会计及税务', en: 'Accounting & Tax' },
];

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

interface Props {
  locale: Locale;
  waNumber?: string;
}

const localeName: Record<Locale, string> = {
  'zh-Hant': '繁中',
  'en': 'EN',
  'zh-Hans': '简中',
};

const t = (locale: Locale, tc: string, en: string, sc: string) =>
  locale === 'en' ? en : locale === 'zh-Hans' ? sc : tc;

const localePath = (locale: Locale, path: string) =>
  locale === 'zh-Hant' ? path : `/${locale}${path}`;

export default function SiteHeader({ locale, waNumber = WA_NUMBER }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-lang-switcher]')) setLangOpen(false);
    };
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, [langOpen]);

  const switchLocale = (l: Locale) => {
    const path = window.location.pathname.replace(/^\/(zh-Hans|en)/, '') || '/';
    const target = l === 'zh-Hant' ? path : `/${l}${path}`;
    setLangOpen(false);
    window.location.href = target;
  };

  const waHref = `https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi，我想查詢合規及牌照服務')}`;

  return (
    <>
      <div style={{ height: 5, background: 'linear-gradient(90deg,#EF4444 0%,#B91C1C 100%)', width: '100%' }} />
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 1000,
          background: '#fff',
          borderBottom: `1px solid ${scrolled ? '#E2E8F0' : 'transparent'}`,
          boxShadow: scrolled ? '0 2px 20px rgba(15,37,87,.12)' : 'none',
          transition: 'box-shadow .3s, border-color .3s',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          {/* Logo */}
          <Link href="/" style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#0F2557', letterSpacing: '.05em', whiteSpace: 'nowrap', textDecoration: 'none' }}>
            SANDBOX <span style={{ color: '#EF4444' }}>GROUP</span>
            <small style={{ display: 'block', fontSize: '.55rem', fontWeight: 600, letterSpacing: '.12em', color: '#64748B', textTransform: 'uppercase', marginTop: -2 }}>
              Compliance · Licensing · Corporate Services
            </small>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="desktop-nav">
            <Link href={localePath(locale, '/')} style={navLinkStyle}>
              {t(locale, '主頁', 'Home', '主页')}
            </Link>
            <Link href={localePath(locale, '/about')} style={navLinkStyle}>
              {t(locale, '關於我們', 'About Us', '关于我们')}
            </Link>

            {/* Services dropdown */}
            <div style={{ position: 'relative' }} className="dropdown">
              <span style={{ ...navLinkStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                {t(locale, '服務範疇', 'Services', '服务范畴')} <span style={{ fontSize: '.6rem' }}>▾</span>
              </span>
              <div style={dropdownMenuStyle}>
                {navServices.map(s => (
                  <Link key={s.href} href={localePath(locale, s.href)} style={dropdownItemStyle}>
                    <span style={{ width: 6, height: 6, background: '#EF4444', borderRadius: '50%', flexShrink: 0, display: 'inline-block' }} />
                    {t(locale, s.tc, s.en, s.sc)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Corporate dropdown */}
            <div style={{ position: 'relative' }} className="dropdown">
              <span style={{ ...navLinkStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                {t(locale, '企業服務', 'Corporate', '企业服务')} <span style={{ fontSize: '.6rem' }}>▾</span>
              </span>
              <div style={dropdownMenuStyle}>
                {navCorporate.map(s => (
                  <Link key={s.href} href={localePath(locale, s.href)} style={dropdownItemStyle}>
                    <span style={{ width: 6, height: 6, background: '#EF4444', borderRadius: '50%', flexShrink: 0, display: 'inline-block' }} />
                    {t(locale, s.tc, s.en, s.sc)}
                  </Link>
                ))}
              </div>
            </div>

            <Link href={localePath(locale, '/tech')} style={navLinkStyle}>{t(locale, '合規科技', 'RegTech', '合规科技')}</Link>
            <Link href={localePath(locale, '/insights')} style={navLinkStyle}>{t(locale, '專業見解', 'Insights', '专业见解')}</Link>
            <Link href={localePath(locale, '/contact')} style={navLinkStyle}>{t(locale, '聯絡我們', 'Contact', '联络我们')}</Link>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Language switcher */}
            <div style={{ position: 'relative' }} data-lang-switcher>
              <button
                onClick={() => setLangOpen(!langOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 12px', background: 'transparent',
                  border: `1.5px solid ${langOpen ? '#0F2557' : '#E2E8F0'}`,
                  borderRadius: 6, fontFamily: "'Montserrat',sans-serif",
                  fontSize: '.75rem', fontWeight: 700, color: '#0F2557',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {localeName[locale]}
                <span style={{ fontSize: '.6rem', color: '#64748B', transition: 'transform .2s', transform: langOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
              </button>
              {langOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: '#fff', border: '1px solid #E2E8F0',
                  borderTop: '3px solid #0F2557', minWidth: 160,
                  zIndex: 9999, boxShadow: '0 12px 32px rgba(15,37,87,.12)',
                }}>
                  {(['zh-Hant', 'en', 'zh-Hans'] as Locale[]).map(l => (
                    <a key={l} href="#" onClick={e => { e.preventDefault(); switchLocale(l); }} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 16px',
                      borderBottom: l === 'zh-Hans' ? 'none' : '1px solid #F1F5F9',
                      fontFamily: "'Montserrat',sans-serif", fontSize: '.78rem',
                      fontWeight: 600, color: l === locale ? '#0F2557' : '#334155',
                      background: l === locale ? '#F8FAFC' : 'transparent',
                    }}>
                      <span style={{ fontWeight: 800, fontSize: '.72rem', color: '#EF4444', width: 20 }}>
                        {l === 'zh-Hant' ? 'TC' : l === 'en' ? 'EN' : 'SC'}
                      </span>
                      {l === 'zh-Hant' ? '繁體中文' : l === 'en' ? 'English' : '简体中文'}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quotation CTA — links to corporate calculator page */}
            <a
              href={`/${locale}/quotation/corporate#calc-section`}
              className="wa-cta-desktop"
              style={{
                background: '#EF4444', color: '#fff',
                padding: '9px 18px', fontFamily: "'Noto Sans TC',sans-serif",
                fontSize: '.85rem', fontWeight: 700, display: 'inline-flex',
                alignItems: 'center', gap: 8, lineHeight: 1, textDecoration: 'none',
                transition: 'background .2s', whiteSpace: 'nowrap',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <path d="M8 9h2v4M14 9h2M14 13h2"/>
              </svg>
              <span style={{ fontSize: '.85rem', fontWeight: 700, lineHeight: 1 }}>
                {t(locale, '企業報價', 'Quotation', '企业报价')}
              </span>
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: 'flex', flexDirection: 'column', gap: 5, cursor: 'pointer', padding: 8, flexShrink: 0, border: 'none', background: 'none' }}
              className="hamburger"
              aria-label="Menu"
            >
              <span style={{ display: 'block', width: 24, height: 2, background: '#0F2557' }} />
              <span style={{ display: 'block', width: 24, height: 2, background: '#0F2557' }} />
              <span style={{ display: 'block', width: 24, height: 2, background: '#0F2557' }} />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div style={{
            background: '#fff', borderTop: '1px solid #E2E8F0',
            padding: '12px 0', position: 'fixed', top: 64, left: 0, right: 0,
            zIndex: 999, boxShadow: '0 8px 24px rgba(0,0,0,.1)',
            maxHeight: 'calc(100vh - 64px)', overflowY: 'auto',
          }}>
            {[
              { href: '/', label: t(locale, '主頁', 'Home', '主页') },
              { href: '/about', label: t(locale, '關於我們', 'About Us', '关于我们') },
              { href: '/mso', label: t(locale, 'MSO 牌照', 'MSO Licensing', 'MSO 牌照') },
              { href: '/licensing', label: t(locale, 'SFC / 跨境牌照', 'Licensing', 'SFC / 跨境牌照') },
              { href: '/compliance', label: t(locale, '持續合規', 'Compliance', '持续合规') },
              { href: '/corporate', label: t(locale, '企業服務', 'Corporate', '企业服务') },
              { href: '/tech', label: t(locale, '合規科技', 'RegTech', '合规科技') },
              { href: '/insights', label: t(locale, '專業見解', 'Insights', '专业见解') },
              { href: '/contact', label: t(locale, '聯絡我們', 'Contact', '联络我们') },
            ].map(item => (
              <Link
                key={item.href}
                href={localePath(locale, item.href)}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block', padding: '13px 24px',
                  fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.95rem',
                  color: '#334155', borderBottom: '1px solid #F1F5F9', textDecoration: 'none',
                }}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                margin: '16px 24px 8px', display: 'block', textAlign: 'center',
                background: '#EF4444', color: '#fff', padding: 13,
                fontWeight: 700, fontSize: '.9rem', textDecoration: 'none',
              }}
            >
              {t(locale, 'WhatsApp 企業報價', 'WhatsApp Quotation', 'WhatsApp 企业报价')}
            </a>
          </div>
        )}
      </header>

      {/* Floating WhatsApp FAB */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: '#25D366',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,211,102,.45)',
          transition: 'transform .2s, box-shadow .2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 28px rgba(37,211,102,.6)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(37,211,102,.45)';
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

      <style>{`
        @media(min-width:901px){.hamburger{display:none!important}}
        @media(max-width:900px){.desktop-nav{display:none!important}}
        @media(max-width:900px){.wa-cta-desktop{display:none!important}}
        .dropdown:hover > div:last-child{display:block!important}
      `}</style>
    </>
  );
}

const navLinkStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontFamily: "'Noto Sans TC',sans-serif",
  fontSize: '.85rem',
  color: '#334155',
  fontWeight: 500,
  transition: 'color .2s',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
};

const dropdownMenuStyle: React.CSSProperties = {
  display: 'none',
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  background: '#fff',
  border: '1px solid #E2E8F0',
  borderTop: '3px solid #EF4444',
  minWidth: 280,
  zIndex: 200,
  boxShadow: '0 12px 32px rgba(15,37,87,.12)',
};

const dropdownItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '13px 20px',
  fontFamily: "'Montserrat',sans-serif",
  fontSize: '.78rem',
  fontWeight: 700,
  letterSpacing: '.02em',
  color: '#0F2557',
  borderBottom: '1px solid #F1F5F9',
  textDecoration: 'none',
};
