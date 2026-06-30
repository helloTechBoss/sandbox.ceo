'use client';

import { useState } from 'react';
import Link from 'next/link';
import './techboss.css';

const YELLOW = '#F5C518';
const PURPLE = '#5B3EE8';

function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div style={{ background: '#111', color: '#fff', textAlign: 'center', padding: '10px 40px', fontSize: 14, position: 'relative' }}>
      預約科技波士，學習更多AI資訊
      <button onClick={() => setVisible(false)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
    </div>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { label: 'Home', href: '/techboss' },
    { label: 'Corporate Services', href: '/techboss/corporate' },
    { label: 'AI Project', href: '/techboss/ai' },
    { label: 'Our Client', href: '/techboss/clients' },
    { label: 'Our Story', href: '/techboss/about' },
  ];
  return (
    <>
      <header className="tb-header">
        <Link href="/techboss" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 44, height: 44, background: PURPLE, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🤖</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, color: '#fff', letterSpacing: 1 }}>TECH BOSS</div>
            <div style={{ fontSize: 10, color: '#aaa' }}>科技波士</div>
          </div>
        </Link>

        <nav className="tb-nav">
          {navLinks.map(item => (
            <Link key={item.label} href={item.href} style={{ color: '#fff', textDecoration: 'none' }}>{item.label}</Link>
          ))}
        </nav>

        <div className="tb-nav-right">
          <Link href="/techboss/login" style={{ color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Login</Link>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: 16, textDecoration: 'none', fontWeight: 700 }}>f</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>ig</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: 14, fontWeight: 900, textDecoration: 'none' }}>in</a>
          </div>
          <span className="tb-lang" style={{ color: '#fff', fontSize: 12, border: '1px solid #444', padding: '2px 8px', borderRadius: 4 }}>🌐 English ▾</span>
          <span className="tb-cart" style={{ color: '#fff', fontSize: 16 }}>🛒 0</span>
          <button className="tb-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">☰</button>
        </div>
      </header>
      <div className={`tb-mobile-menu${menuOpen ? ' open' : ''}`}>
        {navLinks.map(item => (
          <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>
        ))}
        <Link href="/techboss/login" onClick={() => setMenuOpen(false)} style={{ color: '#F5C518' }}>Login</Link>
      </div>
    </>
  );
}

function Hero() {
  return (
    <section className="tb-hero" style={{ background: '#000', minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 60px 80px' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.2, color: '#fff', marginBottom: 24 }}>
        「AI創業支援」、「AI個人成長」、「AI內容變現」
      </h1>
      <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2.5rem)', fontWeight: 900, color: '#fff' }}>
        All In Tech Boss
      </h2>
    </section>
  );
}

function WelcomeSection() {
  return (
    <section className="tb-grid-2" style={{ background: '#000', minHeight: '60vh' }}>
      <div className="tb-welcome-left" style={{ padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: '#fff', marginBottom: 32 }}>Welcome to TechBoss</h2>
        <p style={{ fontSize: 16, color: '#ccc', lineHeight: 1.8, marginBottom: 24 }}>
          一個結合AI企業支援、AI個人成長與AI創意孵化的AI平台，專為創業者與創作者而設，助你從靈感走向實踐，成就更有影響力的未來。
        </p>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 40 }}>
          Room 1002B, 10/F, Metro Centre II, 21 Lam Hing St, Kowloon Bay
        </p>
        <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer" style={{ display: 'inline-block', background: YELLOW, color: '#000', fontWeight: 700, fontSize: 16, padding: '16px 40px', borderRadius: 8, textDecoration: 'none', width: 'fit-content' }}>
          Whatspps
        </a>
      </div>
      <div className="tb-welcome-map" style={{ overflow: 'hidden', minHeight: 400 }}>
        <iframe
          src="https://maps.google.com/maps?q=Metro+Centre+II,+21+Lam+Hing+St,+Kowloon+Bay,+Hong+Kong&output=embed"
          width="100%" height="100%"
          style={{ border: 0, minHeight: 400, filter: 'grayscale(100%)' }}
          loading="lazy"
        />
      </div>
    </section>
  );
}

const SERVICES = [
  { zh: '會計及審計', en: 'Account & Audit', icon: '📊', href: '/techboss/corporate/accounting' },
  { zh: '公司秘書', en: 'Com Sec', icon: '💼', href: '/techboss/corporate/comsec' },
  { zh: '沙盒商務中心', en: 'Booking', icon: '🏢', href: '/techboss/booking' },
  { zh: '波士學堂', en: 'Tech Boss Course', icon: '🎓', href: '/techboss/courses' },
];

function ServicesSection() {
  return (
    <section className="tb-pad" style={{ background: '#000', padding: '80px 60px' }}>
      <div className="tb-grid-4">
        {SERVICES.map(s => (
          <div key={s.en} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 56, lineHeight: 1 }}>{s.icon}</div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{s.zh}</div>
            <Link href={s.href} style={{ background: YELLOW, color: '#000', fontWeight: 700, padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>
              {s.en}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClientStorySection() {
  return (
    <section className="tb-pad" style={{ background: '#000', padding: '100px 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#fff', marginBottom: 16 }}>
          Tech Boss App<br />Client Story
        </h2>
        <p style={{ fontStyle: 'italic', color: '#aaa', fontSize: 16 }}>Our Client Feedback</p>
      </div>
      <div className="tb-videos">
        {[
          { title: 'Hong Kong Designer Vivian Poon with Tech Boss' },
          { title: 'Coffee Cat with Tech Boss' },
        ].map((v, i) => (
          <div key={i} style={{ background: '#111', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #222' }}>
              <div style={{ width: 36, height: 36, background: PURPLE, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{v.title}</div>
                <div style={{ fontSize: 11, color: '#888' }}>科技波士 Tech Boss</div>
              </div>
            </div>
            <div style={{ background: '#1a1a1a', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 56, height: 56, background: 'rgba(220,0,0,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <span style={{ color: '#fff', fontSize: 20, marginLeft: 4 }}>▶</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ERPSection() {
  return (
    <section className="tb-grid-2" style={{ background: '#000', minHeight: '50vh' }}>
      <div style={{ padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: '#fff', marginBottom: 32 }}>ERP powered by AI</h2>
        <p style={{ fontSize: 15, color: '#ccc', lineHeight: 1.8, marginBottom: 40 }}>
          Tech Boss, an award-winning team recognized by Cyberport HK Tech 300 (CityU) and PolyU Microfund, specializes in AI-powered ERP systems for clinics, Chinese medicine, inventory and logistics, and property management. Our IoT solutions include smart vending machines, IoT farms, STEAM classrooms, and POS machines. We are dedicated to driving innovation and efficiency through cutting-edge technology.
        </p>
        <Link href="/techboss/contact" style={{ display: 'inline-block', background: YELLOW, color: '#000', fontWeight: 700, fontSize: 16, padding: '16px 40px', borderRadius: 8, textDecoration: 'none', width: 'fit-content' }}>
          Find Us
        </Link>
      </div>
      <div style={{ background: YELLOW, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, minHeight: 400 }}>
        <div style={{ textAlign: 'center', color: '#000' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>👕</div>
          <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: -2 }}>TECH BOSS</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>科技波士</div>
          <div style={{ fontSize: 12, marginTop: 8, lineHeight: 1.6 }}>START MAKING REAL APP WITHOUT CODING<br />無代碼平台 輕鬆發佈APP</div>
        </div>
      </div>
    </section>
  );
}

function ITClientsSection() {
  const clients = [
    'Pet IoT App', 'Travel Platform', 'E-commerce', 'Food Delivery',
    'Clinic ERP', 'Property Mgmt', 'Smart Vending', 'IoT Farm',
    'STEAM Class', 'POS System', 'Logistics', 'Inventory Mgmt',
  ];
  return (
    <section className="tb-pad" style={{ background: '#000', padding: '80px 60px' }}>
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 60 }}>Our IT Solution Client</h2>
      <div className="tb-clients">
        {clients.map(c => (
          <div key={c} style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: '24px 16px', textAlign: 'center', color: '#ccc', fontSize: 14, fontWeight: 600 }}>
            {c}
          </div>
        ))}
      </div>
    </section>
  );
}

function AppBuilderSection() {
  return (
    <section style={{ background: '#000' }}>
      <div className="tb-pad" style={{ padding: '80px 60px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>DIY Your APP</h2>
        <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, color: YELLOW, marginBottom: 16 }}>Just Like Burger</h3>
        <p style={{ fontSize: 16, color: '#ccc', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
          Tech Boss App aims to catalyze all the new growth startups by providing various code templates.
        </p>
        <Link href="/techboss/booking" style={{ display: 'inline-block', background: YELLOW, color: '#000', fontWeight: 700, fontSize: 16, padding: '16px 40px', borderRadius: 8, textDecoration: 'none' }}>
          Book
        </Link>
      </div>

      <div className="tb-grid-2" style={{ minHeight: '50vh' }}>
        <div style={{ padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: 32 }}>Build Your Own App Without Coding</h2>
          <p style={{ fontSize: 15, color: '#ccc', lineHeight: 1.8, marginBottom: 40 }}>
            Tech Boss App is an intelligent app builder platform that aims to allow startup owners to build apps without coding straightforwardly at the lowest cost with various ready-made templates. Our vision is to become the &ldquo;SquareSpace&rdquo; / &ldquo;Wix&rdquo; in the Mobile Application Sector.
          </p>
          <a href="https://app.techboss.app" style={{ display: 'inline-block', background: YELLOW, color: '#000', fontWeight: 700, fontSize: 16, padding: '16px 40px', borderRadius: 8, textDecoration: 'none', width: 'fit-content' }}>
            Build Now
          </a>
        </div>
        <div style={{ background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, minHeight: 360 }}>
          <div style={{ background: '#f5f5f5', borderRadius: 16, padding: '28px 24px', maxWidth: 360, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📱</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#000' }}>Chat with</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '4px 0' }}>
              <span style={{ color: 'red', fontSize: 18 }}>▶</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#000' }}>YouTube</span>
            </div>
            <div style={{ fontSize: 14, color: '#555', marginBottom: 6 }}>Various App Template</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#000' }}>Specialist!</div>
          </div>
        </div>
      </div>
    </section>
  );
}

const BRANDING_CLIENTS = [
  { name: 'Lobo Lobo', bg: PURPLE },
  { name: '蓬禧閣', bg: '#8B6914' },
  { name: 'Coffee Cat', bg: '#6B3A2A' },
  { name: 'Vivian Poon', bg: '#2A4A6B' },
];

function BrandingSection() {
  return (
    <section className="tb-pad" style={{ background: '#000', padding: '80px 60px' }}>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>Whatever it is, the way you tell your story online can make all the difference.</p>
      <Link href="/techboss/contact" style={{ display: 'inline-block', background: YELLOW, color: '#000', fontWeight: 700, padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontSize: 14, marginBottom: 60 }}>
        Find Us
      </Link>
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: 48, marginTop: 60 }}>Our Branding Client</h2>
      <div className="tb-branding">
        {BRANDING_CLIENTS.map(c => (
          <div key={c.name} style={{ background: c.bg, borderRadius: 12, aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 18, textAlign: 'center', padding: '0 12px' }}>{c.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AwardsSection() {
  const timeline = [
    { year: '2022', label: 'Dream it' },
    { year: '2023', label: 'Build it' },
    { year: '2024', label: 'Grow it\nEducate it' },
    { year: '2025', label: '' },
  ];
  return (
    <section className="tb-pad" style={{ background: '#000', padding: '80px 60px' }}>
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: 60, textAlign: 'center' }}>Awards</h2>
      <div className="tb-grid-awards">
        <div style={{ position: 'absolute', top: 20, left: '12.5%', right: '12.5%', height: 2, background: '#333' }} />
        {timeline.map(t => (
          <div key={t.year} style={{ flex: 1, textAlign: 'center', position: 'relative', minWidth: 80 }}>
            <div style={{ width: 40, height: 40, background: YELLOW, borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#000', fontSize: 12, position: 'relative', zIndex: 1 }}>
              {t.year.slice(2)}
            </div>
            <div style={{ fontWeight: 900, fontSize: 18, color: '#fff', marginBottom: 8 }}>{t.year}</div>
            <div style={{ fontSize: 13, color: '#aaa', whiteSpace: 'pre-line' }}>{t.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="tb-grid-contact tb-pad" style={{ background: '#000', padding: '80px 60px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: 24 }}>Get in touch.</h2>
        <p style={{ color: '#888', fontSize: 15, lineHeight: 1.7 }}>
          Our Specialist will send you the updated news and contact with you to understand your need within 24 hours.
        </p>
      </div>
      <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ color: '#aaa', fontSize: 12, display: 'block', marginBottom: 6 }}>First Name</label>
            <input style={{ width: '100%', padding: '12px 14px', background: '#fff', border: 'none', borderRadius: 4, fontSize: 14, color: '#000', boxSizing: 'border-box' }} placeholder="First Name" />
          </div>
          <div>
            <label style={{ color: '#aaa', fontSize: 12, display: 'block', marginBottom: 6 }}>Last Name</label>
            <input style={{ width: '100%', padding: '12px 14px', background: '#fff', border: 'none', borderRadius: 4, fontSize: 14, color: '#000', boxSizing: 'border-box' }} placeholder="Last Name" />
          </div>
        </div>
        <div>
          <label style={{ color: '#aaa', fontSize: 12, display: 'block', marginBottom: 6 }}>Email <span style={{ color: 'red' }}>(required)</span></label>
          <input type="email" style={{ width: '100%', padding: '12px 14px', background: '#fff', border: 'none', borderRadius: 4, fontSize: 14, color: '#000', boxSizing: 'border-box' }} placeholder="Email" />
        </div>
        <div>
          <label style={{ color: '#aaa', fontSize: 12, display: 'block', marginBottom: 6 }}>Phone No</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <select style={{ padding: '12px 8px', background: '#fff', border: 'none', borderRadius: 4, fontSize: 14, color: '#000', width: 80, flexShrink: 0 }}>
              <option>+852</option><option>+86</option><option>+1</option>
            </select>
            <input style={{ flex: 1, padding: '12px 14px', background: '#fff', border: 'none', borderRadius: 4, fontSize: 14, color: '#000' }} placeholder="Phone number" />
          </div>
        </div>
        <div>
          <label style={{ color: '#aaa', fontSize: 12, display: 'block', marginBottom: 6 }}>Your need</label>
          <input style={{ width: '100%', padding: '12px 14px', background: '#fff', border: 'none', borderRadius: 4, fontSize: 14, color: '#000', marginBottom: 8, boxSizing: 'border-box' }} placeholder="Company/Product" />
          <textarea style={{ width: '100%', padding: '12px 14px', background: '#fff', border: 'none', borderRadius: 4, fontSize: 14, color: '#000', minHeight: 120, resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" style={{ background: YELLOW, color: '#000', fontWeight: 700, fontSize: 16, padding: '14px 40px', borderRadius: 8, border: 'none', cursor: 'pointer', width: 'fit-content' }}>
          Send
        </button>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#000', borderTop: '1px solid #222', padding: '60px 40px 40px' }}>
      <div className="tb-grid-footer">
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 6 }}>Sandbox Corporate Services</div>
          <div style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>©Tech Boss Limited. All Rights Reserved.</div>
          <div style={{ color: '#aaa', fontSize: 12, lineHeight: 1.8 }}>
            <strong style={{ color: '#ccc' }}>Hong Kong Office:</strong><br />
            Tech Boss Limited, Room 1002B, 10/F, Metro Centre II, 21 Lam Hing St, Kowloon Bay, Hong Kong
          </div>
          <div style={{ color: '#aaa', fontSize: 12, lineHeight: 1.8, marginTop: 12 }}>
            <strong style={{ color: '#ccc' }}>China Office:</strong><br />
            惠州波士智能科技有限公司，惠州仲恺高新区和畅五路西10号汇港城惠州仲恺港澳青年创业基地八楼公共孵化区B01-A09工位
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#111', padding: '16px 20px', borderRadius: 12 }}>
            <div style={{ fontSize: 28 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, color: '#fff' }}>TECH BOSS 科技波士</div>
              <div style={{ fontSize: 10, color: '#888' }}>START MAKING REAL APP WITHOUT CODING</div>
              <div style={{ fontSize: 10, color: '#888' }}>無代碼平台 輕鬆發佈APP</div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ marginBottom: 20 }}>
            <a href="mailto:hello@techboss.app" style={{ color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>hello@techboss.app</a>
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'flex-end' }}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: 18, textDecoration: 'none', fontWeight: 700 }}>f</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: 16, textDecoration: 'none' }}>ig</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: 16, fontWeight: 900, textDecoration: 'none' }}>in</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function TechBossHomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <WelcomeSection />
        <ServicesSection />
        <ClientStorySection />
        <ERPSection />
        <ITClientsSection />
        <AppBuilderSection />
        <BrandingSection />
        <AwardsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
