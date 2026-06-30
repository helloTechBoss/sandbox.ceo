'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './techboss.css';

const YELLOW = '#F5C518';

export const NAV_LINKS = [
  { label: 'Home', href: '/techboss' },
  { label: 'Corporate Services', href: '/techboss/corporate-services' },
  { label: 'AI Project', href: '/techboss/ai-project' },
  { label: 'Our Client', href: '/techboss/clients' },
  { label: 'Our Story', href: '/techboss/our-story' },
  { label: 'Pricing', href: '/techboss/pricing' },
];

export function TBHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`tb-header${scrolled ? ' scrolled' : ''}`}>
        <Link href="/techboss" className="tb-logo">
          <Image src="/techboss/images/logo.png" alt="Tech Boss" width={120} height={40} style={{ height: 38, width: 'auto' }} />
        </Link>
        <nav className="tb-nav">
          {NAV_LINKS.map(l => <Link key={l.label} href={l.href}>{l.label}</Link>)}
        </nav>
        <div className="tb-nav-right">
          <div className="tb-nav-social" style={{ display: 'flex', gap: 14 }}>
            <a href="https://www.facebook.com/techboss.hk" target="_blank" rel="noreferrer">FB</a>
            <a href="https://www.instagram.com/techboss.hk" target="_blank" rel="noreferrer">IG</a>
            <a href="https://www.linkedin.com/company/tech-boss-limited" target="_blank" rel="noreferrer">LI</a>
          </div>
          <a href="https://app.techboss.app" target="_blank" rel="noreferrer" className="tb-btn-yellow" style={{ padding: '10px 22px', fontSize: 13 }}>Login</a>
          <button className="tb-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>
      <div className={`tb-mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(l => (
          <Link key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</Link>
        ))}
        <a href="https://app.techboss.app" target="_blank" rel="noreferrer" style={{ color: YELLOW }}>Login →</a>
      </div>
    </>
  );
}

export function TBFooter() {
  return (
    <footer style={{ background: '#000', borderTop: '1px solid #111', padding: '64px 0 40px' }}>
      <div className="tb-container">
        <div className="tb-grid-footer" style={{ marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 6, letterSpacing: '0.06em' }}>SANDBOX CORPORATE SERVICES</div>
            <div style={{ color: '#555', fontSize: 12, marginBottom: 24 }}>©Tech Boss Limited. All Rights Reserved.</div>
            <div style={{ fontSize: 12, color: '#555', lineHeight: 1.9 }}>
              <strong style={{ color: '#888' }}>Hong Kong:</strong><br />
              Tech Boss Limited, Room 1002B, 10/F,<br />
              Metro Centre II, 21 Lam Hing St, Kowloon Bay
            </div>
            <div style={{ fontSize: 12, color: '#555', lineHeight: 1.9, marginTop: 12 }}>
              <strong style={{ color: '#888' }}>China:</strong><br />
              惠州波士智能科技有限公司<br />
              惠州仲恺高新区和畅五路西10号
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Image src="/techboss/images/logo.png" alt="Tech Boss" width={140} height={50} style={{ height: 44, width: 'auto', margin: '0 auto 12px' }} />
            <div style={{ fontSize: 11, color: '#444', letterSpacing: '0.08em', lineHeight: 1.8 }}>
              START MAKING REAL APP WITHOUT CODING<br />
              無代碼平台 輕鬆發佈APP
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <a href="mailto:hello@techboss.app" style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 20 }}>hello@techboss.app</a>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'flex-end', marginBottom: 28 }}>
              <a href="https://www.facebook.com/techboss.hk" target="_blank" rel="noreferrer" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, color: '#555', letterSpacing: '0.08em' }}>FB</a>
              <a href="https://www.instagram.com/techboss.hk" target="_blank" rel="noreferrer" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, color: '#555', letterSpacing: '0.08em' }}>IG</a>
              <a href="https://www.linkedin.com/company/tech-boss-limited" target="_blank" rel="noreferrer" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, color: '#555', letterSpacing: '0.08em' }}>LI</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <Link href="/techboss/privacy-policy" style={{ fontSize: 12, color: '#444' }}>Privacy Policy</Link>
              <Link href="/techboss/eula" style={{ fontSize: 12, color: '#444' }}>Terms of Service</Link>
              <Link href="/techboss/delivery-policy" style={{ fontSize: 12, color: '#444' }}>Delivery Policy</Link>
            </div>
          </div>
        </div>
        <div className="tb-divider" />
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 11, color: '#333' }}>© 2022–2025 Tech Boss Limited. Powered by Sandbox Group.</span>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {NAV_LINKS.map(l => (
              <Link key={l.label} href={l.href} style={{ fontSize: 11, color: '#333' }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function TBPageHero({ label, title, titleYellow, sub }: { label: string; title: string; titleYellow?: string; sub?: string }) {
  return (
    <section style={{ background: '#000', padding: '100px 0 80px', borderBottom: '1px solid #111' }}>
      <div className="tb-container">
        <span className="tb-label">{label}</span>
        <h1 className="tb-h1" style={{ marginBottom: 16 }}>
          {title}
          {titleYellow && <><br /><span style={{ color: YELLOW }}>{titleYellow}</span></>}
        </h1>
        <div className="tb-gold-bar" />
        {sub && <p style={{ fontSize: 16, color: '#888', maxWidth: 600, lineHeight: 1.8 }}>{sub}</p>}
      </div>
    </section>
  );
}

export function TBContactStrip() {
  return (
    <section style={{ background: '#111', padding: '64px 0', borderTop: '1px solid #1a1a1a' }}>
      <div className="tb-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
        <div>
          <span className="tb-label">Ready to Start?</span>
          <h2 className="tb-h2" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>Talk to our specialist today.</h2>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer" className="tb-btn-yellow">
            WhatsApp Us
          </a>
          <a href="mailto:hello@techboss.app" className="tb-btn-outline">Email Us</a>
        </div>
      </div>
    </section>
  );
}

export { YELLOW };
