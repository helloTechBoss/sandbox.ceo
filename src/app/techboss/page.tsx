'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './techboss.css';

const YELLOW = '#F5C518';

/* ─── ANNOUNCEMENT BAR ─── */
function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="tb-announce">
      預約科技波士，學習更多AI資訊 ✦ Book a consultation with Tech Boss today
      <button className="tb-announce-close" onClick={() => setVisible(false)} aria-label="Close">×</button>
    </div>
  );
}

/* ─── HEADER ─── */
const NAV_LINKS = [
  { label: 'Home', href: '/techboss' },
  { label: 'Corporate Services', href: '/techboss/corporate-services' },
  { label: 'AI Project', href: '/techboss/ai-project' },
  { label: 'Our Client', href: '/techboss/clients' },
  { label: 'Our Story', href: '/techboss/our-story' },
  { label: 'Pricing', href: '/techboss/pricing' },
];

function Header() {
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
          {NAV_LINKS.map(l => (
            <Link key={l.label} href={l.href}>{l.label}</Link>
          ))}
        </nav>

        <div className="tb-nav-right">
          <div className="tb-nav-social" style={{ display: 'flex', gap: 14 }}>
            <a href="https://www.facebook.com/techboss.hk" target="_blank" rel="noreferrer">FB</a>
            <a href="https://www.instagram.com/techboss.hk" target="_blank" rel="noreferrer">IG</a>
            <a href="https://www.linkedin.com/company/tech-boss-limited" target="_blank" rel="noreferrer">LI</a>
          </div>
          <a href="https://app.techboss.app" target="_blank" rel="noreferrer" className="tb-btn-yellow" style={{ padding: '10px 22px', fontSize: 13 }}>
            Login
          </a>
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

/* ─── TICKER ─── */
function Ticker() {
  const items = ['AI創業支援', 'App Builder', 'ERP System', 'Branding', 'Corporate Services', 'IoT Solutions', 'AI個人成長', 'AI內容變現', 'Tech Boss Course', 'Smart Vending', 'STEAM Education'];
  const doubled = [...items, ...items];
  return (
    <div className="tb-ticker">
      <div className="tb-ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} className="tb-ticker-item">
            {item} <span className="tb-ticker-sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section className="tb-hero-grid" style={{ background: '#000', minHeight: '88vh', display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 80px 80px 60px' }}>
        <span className="tb-label">Tech Boss Limited · 科技波士</span>
        <h1 className="tb-h1" style={{ marginBottom: 24 }}>
          Learn the Future.<br />
          <span style={{ color: YELLOW }}>Be the Future.</span>
        </h1>
        <div className="tb-gold-bar" />
        <p style={{ fontFamily: "'Noto Sans TC', sans-serif", fontSize: 16, color: '#aaa', lineHeight: 1.8, marginBottom: 40, maxWidth: 460 }}>
          一個結合AI企業支援、AI個人成長與AI創意孵化的AI平台，專為創業者與創作者而設，助你從靈感走向實踐，成就更有影響力的未來。
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer" className="tb-btn-yellow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp Us
          </a>
          <Link href="/techboss/corporate-services" className="tb-btn-outline">Our Services</Link>
        </div>

        <div style={{ display: 'flex', gap: 40, marginTop: 64 }}>
          {[['50+', 'App Clients'], ['3', 'Award Winners'], ['2', 'Offices'], ['5+', 'Years Exp']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 28, fontWeight: 900, color: YELLOW }}>{n}</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}>
        <Image
          src="/techboss/images/hero-tshirt.png"
          alt="Tech Boss"
          fill
          style={{ objectFit: 'contain', objectPosition: 'center', padding: 40 }}
          priority
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #000 0%, transparent 20%)' }} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tb-hero-grid { grid-template-columns: 1fr !important; }
          .tb-hero-img { min-height: 300px; }
        }
      `}</style>
    </section>
  );
}

/* ─── SERVICES ─── */
const SERVICES = [
  {
    zh: '會計及審計', en: 'Account & Audit',
    desc: '企業會計、稅務申報、年度審計及財務管理諮詢服務',
    icon: '/techboss/icons/accounting.png',
    href: '/techboss/corporate-services',
  },
  {
    zh: '公司秘書', en: 'Com Sec',
    desc: '公司成立、周年申報、法定文件管理及公司秘書服務',
    icon: '/techboss/icons/comsec.png',
    href: '/techboss/corporate-services',
  },
  {
    zh: '沙盒商務中心', en: 'Office Booking',
    desc: '九龍灣辦公空間、會議室及虛擬辦公室預訂服務',
    icon: '/techboss/icons/booking.png',
    href: '/techboss/corporate-services',
  },
  {
    zh: '波士學堂', en: 'Tech Boss Course',
    desc: 'AI工具實戰課程、創業培訓及科技應用工作坊',
    icon: '/techboss/icons/course.png',
    href: '/techboss/pricing',
  },
];

function ServicesSection() {
  return (
    <section className="tb-section" style={{ background: '#000' }}>
      <div className="tb-container">
        <span className="tb-label">What We Do</span>
        <h2 className="tb-h2" style={{ marginBottom: 12 }}>Corporate Services</h2>
        <div className="tb-gold-bar" />

        <div className="tb-grid-4">
          {SERVICES.map(s => (
            <Link key={s.en} href={s.href} className="tb-card" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <Image src={s.icon} alt={s.en} width={64} height={64} className="tb-service-icon" />
              <div className="tb-label" style={{ marginBottom: 6 }}>{s.en}</div>
              <h3 className="tb-h3" style={{ marginBottom: 12 }}>{s.zh}</h3>
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7, flex: 1 }}>{s.desc}</p>
              <div style={{ marginTop: 24, color: YELLOW, fontSize: 13, fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>Learn More →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── WELCOME / MAP ─── */
function WelcomeSection() {
  return (
    <section className="tb-grid-2" style={{ background: '#0a0a0a', minHeight: '55vh' }}>
      <div style={{ padding: '80px 60px 80px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 600 }}>
        <span className="tb-label">About Us · 關於我們</span>
        <h2 className="tb-h2" style={{ marginBottom: 12 }}>Welcome to Tech Boss</h2>
        <div className="tb-gold-bar" />
        <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.85, marginBottom: 16 }}>
          一個結合AI企業支援、AI個人成長與AI創意孵化的AI平台，專為創業者與創作者而設，助你從靈感走向實踐，成就更有影響力的未來。
        </p>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 40 }}>
          Room 1002B, 10/F, Metro Centre II, 21 Lam Hing St, Kowloon Bay, Hong Kong
        </p>
        <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer" className="tb-btn-yellow" style={{ width: 'fit-content' }}>
          Contact Us
        </a>
      </div>
      <div style={{ overflow: 'hidden', minHeight: 400 }}>
        <iframe
          src="https://maps.google.com/maps?q=Metro+Centre+II,+21+Lam+Hing+St,+Kowloon+Bay,+Hong+Kong&output=embed"
          width="100%" height="100%"
          style={{ border: 0, minHeight: 480, filter: 'invert(90%) hue-rotate(180deg)' }}
          loading="lazy"
          title="Tech Boss Office Location"
        />
      </div>
    </section>
  );
}

/* ─── ERP / AI SECTION ─── */
function ERPSection() {
  return (
    <section className="tb-grid-2" style={{ background: '#000', minHeight: '55vh' }}>
      <div style={{ background: YELLOW, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, overflow: 'hidden', minHeight: 480 }}>
        <Image
          src="/techboss/images/mascot-headset.jpg"
          alt="Tech Boss Mascot"
          width={600}
          height={600}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ padding: '80px 80px 80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span className="tb-label">Award-Winning Technology</span>
        <h2 className="tb-h2" style={{ marginBottom: 12 }}>ERP Powered by AI</h2>
        <div className="tb-gold-bar" />
        <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.85, marginBottom: 40 }}>
          Tech Boss, an award-winning team recognized by Cyberport HK Tech 300 (CityU) and PolyU Microfund, specializes in AI-powered ERP systems for clinics, Chinese medicine, inventory and logistics, and property management. Our IoT solutions include smart vending machines, IoT farms, STEAM classrooms, and POS machines.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/techboss/ai-project" className="tb-btn-yellow">AI Solutions</Link>
          <Link href="/techboss/our-story" className="tb-btn-outline">Our Story</Link>
        </div>
      </div>
    </section>
  );
}

/* ─── APP CLIENTS ─── */
const APP_CLIENTS = [
  { src: '/techboss/images/client-pet-iot.png', alt: 'Pet IoT App' },
  { src: '/techboss/images/client-job.jpg', alt: 'Job Platform' },
  { src: '/techboss/images/client-travel.png', alt: 'Travel Platform' },
  { src: '/techboss/images/client-cat.jpg', alt: 'Coffee Cat App' },
  { src: '/techboss/images/client-lobo.jpg', alt: 'Lobo Lobo App' },
  { src: '/techboss/images/client-bag.png', alt: 'Bag Brand App' },
  { src: '/techboss/images/client-rfood.png', alt: 'Food Delivery App' },
  { src: '/techboss/images/client-petclothing.png', alt: 'Pet Clothing App' },
];

function ClientsSection() {
  return (
    <section className="tb-section" style={{ background: '#0a0a0a' }}>
      <div className="tb-container" style={{ marginBottom: 48 }}>
        <span className="tb-label">Tech Boss App</span>
        <h2 className="tb-h2" style={{ marginBottom: 12 }}>Client Stories</h2>
        <div className="tb-gold-bar" />
        <p style={{ fontSize: 15, color: '#888', maxWidth: 560 }}>
          Over 50 Hong Kong startups and businesses have launched their own apps with Tech Boss — without writing a single line of code.
        </p>
      </div>
      <div className="tb-clients">
        {APP_CLIENTS.map(c => (
          <div key={c.alt} style={{ overflow: 'hidden', position: 'relative' }}>
            <Image src={c.src} alt={c.alt} width={400} height={300} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', transition: 'transform 0.3s' }} />
          </div>
        ))}
      </div>
      <div className="tb-container" style={{ marginTop: 48, textAlign: 'center' }}>
        <Link href="/techboss/clients" className="tb-btn-yellow">View All Clients</Link>
      </div>
    </section>
  );
}

/* ─── DIY APP BUILDER ─── */
function AppBuilderSection() {
  const screens = [
    { src: '/techboss/images/diy-burger.png', alt: 'Menu Builder' },
    { src: '/techboss/images/diy-calendar.png', alt: 'Booking Calendar' },
    { src: '/techboss/images/diy-payment.png', alt: 'Payment Module' },
    { src: '/techboss/images/diy-address.png', alt: 'Address Module' },
    { src: '/techboss/images/diy-cart.png', alt: 'Shopping Cart' },
  ];

  return (
    <section style={{ background: '#000' }}>
      <div className="tb-section" style={{ paddingBottom: 60 }}>
        <div className="tb-container" style={{ textAlign: 'center' }}>
          <span className="tb-label">No-Code Platform · 無代碼平台</span>
          <h2 className="tb-h2" style={{ marginBottom: 8 }}>DIY Your App</h2>
          <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: YELLOW, marginBottom: 20 }}>
            Just Like Building a Burger
          </h3>
          <div className="tb-gold-bar" style={{ margin: '0 auto 32px' }} />
          <p style={{ fontSize: 15, color: '#888', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.8 }}>
            Tech Boss App is an intelligent app builder platform that allows startup owners to build apps without coding — at the lowest cost with various ready-made templates.
          </p>
          <a href="https://app.techboss.app" target="_blank" rel="noreferrer" className="tb-btn-yellow">
            Start Building Free
          </a>
        </div>
      </div>

      <div className="tb-container" style={{ paddingBottom: 80 }}>
        <div className="tb-diy-screens">
          {screens.map(s => (
            <div key={s.alt} style={{ background: '#111', borderRadius: 16, overflow: 'hidden', padding: 8 }}>
              <Image src={s.src} alt={s.alt} width={200} height={380} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
            </div>
          ))}
        </div>
      </div>

      <div className="tb-grid-2" style={{ borderTop: '1px solid #111' }}>
        <div style={{ padding: '80px 80px 80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="tb-label">AI App Builder</span>
          <h2 className="tb-h2" style={{ marginBottom: 12 }}>Build Without Coding</h2>
          <div className="tb-gold-bar" />
          <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.85, marginBottom: 40 }}>
            Our vision is to become the &ldquo;Squarespace&rdquo; / &ldquo;Wix&rdquo; of the mobile application sector. Pick your modules, configure your brand, and launch your app — all without writing code.
          </p>
          <a href="https://app.techboss.app" target="_blank" rel="noreferrer" className="tb-btn-yellow" style={{ width: 'fit-content' }}>
            Build Now →
          </a>
        </div>
        <div style={{ background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, minHeight: 400 }}>
          <Image
            src="/techboss/images/mascot-thumbsup.jpg"
            alt="Tech Boss App Builder"
            width={500}
            height={500}
            style={{ width: '100%', maxWidth: 400, height: 'auto', objectFit: 'cover', borderRadius: 8 }}
          />
        </div>
      </div>
    </section>
  );
}

/* ─── BRANDING CLIENTS ─── */
const BRANDING_IMGS = [
  '/techboss/images/brand-1.png',
  '/techboss/images/brand-2.png',
  '/techboss/images/brand-3.png',
  '/techboss/images/brand-4.png',
  '/techboss/images/brand-5.png',
  '/techboss/images/brand-6.png',
  '/techboss/images/brand-7.png',
  '/techboss/images/brand-1.png',
];

function BrandingSection() {
  return (
    <section className="tb-section" style={{ background: '#0a0a0a' }}>
      <div className="tb-container">
        <span className="tb-label">Branding & Design</span>
        <h2 className="tb-h2" style={{ marginBottom: 12 }}>Our Branding Clients</h2>
        <div className="tb-gold-bar" />
        <p style={{ fontSize: 14, color: '#666', marginBottom: 48, maxWidth: 500 }}>
          Whatever it is, the way you tell your story online can make all the difference.
        </p>
        <div className="tb-branding">
          {BRANDING_IMGS.slice(0, 7).map((src, i) => (
            <div key={i} style={{ overflow: 'hidden', borderRadius: 4, border: '1px solid #1a1a1a' }}>
              <Image src={src} alt={`Branding Client ${i + 1}`} width={300} height={225} style={{ width: '100%', height: 'auto', objectFit: 'cover', transition: 'transform 0.3s' }} />
            </div>
          ))}
          <div style={{ background: '#111', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, border: '1px solid #222' }}>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 24, fontWeight: 900, color: YELLOW }}>50+</span>
            <span style={{ color: '#888', fontSize: 13, textAlign: 'center' }}>Happy Clients</span>
            <Link href="/techboss/clients" className="tb-btn-yellow" style={{ fontSize: 12, padding: '10px 20px' }}>View All</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── AWARDS ─── */
function AwardsSection() {
  const timeline = [
    { year: '2022', short: '22', label: 'Dream It', sub: 'Founded Tech Boss' },
    { year: '2023', short: '23', label: 'Build It', sub: 'Cyberport HK Tech 300\nCityU Award' },
    { year: '2024', short: '24', label: 'Grow It', sub: 'PolyU Microfund\nEducate It' },
    { year: '2025', short: '25', label: 'Scale It', sub: 'AI Platform Launch' },
  ];
  return (
    <section className="tb-section" style={{ background: '#000' }}>
      <div className="tb-container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="tb-label">Recognition</span>
          <h2 className="tb-h2" style={{ marginBottom: 12 }}>Awards & Milestones</h2>
          <div className="tb-gold-bar" style={{ margin: '0 auto' }} />
        </div>
        <div className="tb-timeline">
          {timeline.map(t => (
            <div key={t.year} className="tb-timeline-item">
              <div className="tb-timeline-dot">{t.short}</div>
              <div className="tb-timeline-year">{t.year}</div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: YELLOW, marginBottom: 8 }}>{t.label}</div>
              <div className="tb-timeline-label" style={{ whiteSpace: 'pre-line' }}>{t.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─── */
function ContactSection() {
  return (
    <section className="tb-section" style={{ background: '#0a0a0a', borderTop: '1px solid #111' }}>
      <div className="tb-container">
        <div className="tb-grid-contact">
          <div>
            <span className="tb-label">Get In Touch</span>
            <h2 className="tb-h2" style={{ marginBottom: 12 }}>Let&apos;s Work Together.</h2>
            <div className="tb-gold-bar" />
            <p style={{ fontSize: 15, color: '#888', lineHeight: 1.85, marginBottom: 32 }}>
              Our specialist will contact you within 24 hours to understand your needs and propose the best solution.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 13, color: '#666' }}>
                <strong style={{ color: '#aaa', display: 'block', marginBottom: 4 }}>Hong Kong Office</strong>
                Room 1002B, 10/F, Metro Centre II, 21 Lam Hing St, Kowloon Bay
              </div>
              <div style={{ fontSize: 13, color: '#666' }}>
                <strong style={{ color: '#aaa', display: 'block', marginBottom: 4 }}>Email</strong>
                <a href="mailto:hello@techboss.app" style={{ color: YELLOW }}>hello@techboss.app</a>
              </div>
              <div style={{ fontSize: 13, color: '#666' }}>
                <strong style={{ color: '#aaa', display: 'block', marginBottom: 4 }}>WhatsApp</strong>
                <a href="https://wa.me/85292318254" style={{ color: YELLOW }}>+852 9231 8254</a>
              </div>
            </div>
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="tb-form-label">First Name</label>
                <input className="tb-form-input" placeholder="First Name" />
              </div>
              <div>
                <label className="tb-form-label">Last Name</label>
                <input className="tb-form-input" placeholder="Last Name" />
              </div>
            </div>
            <div>
              <label className="tb-form-label">Email <span style={{ color: YELLOW }}>*</span></label>
              <input type="email" className="tb-form-input" placeholder="your@email.com" />
            </div>
            <div>
              <label className="tb-form-label">Phone</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select className="tb-form-input" style={{ width: 90, flexShrink: 0 }}>
                  <option>+852</option><option>+86</option><option>+1</option>
                </select>
                <input className="tb-form-input" style={{ flex: 1 }} placeholder="Phone number" />
              </div>
            </div>
            <div>
              <label className="tb-form-label">Your Need</label>
              <input className="tb-form-input" placeholder="Company / Product name" style={{ marginBottom: 8 }} />
              <textarea className="tb-form-input" style={{ minHeight: 120, resize: 'vertical' }} placeholder="Tell us about your project..." />
            </div>
            <button type="submit" className="tb-btn-yellow" style={{ width: 'fit-content' }}>
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer style={{ background: '#000', borderTop: '1px solid #111', padding: '64px 0 40px' }}>
      <div className="tb-container">
        <div className="tb-grid-footer" style={{ marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 6, letterSpacing: '0.06em' }}>SANDBOX CORPORATE SERVICES</div>
            <div style={{ color: '#555', fontSize: 12, marginBottom: 24 }}>©Tech Boss Limited. All Rights Reserved.</div>
            <div style={{ fontSize: 12, color: '#555', lineHeight: 1.9 }}>
              <strong style={{ color: '#888' }}>Hong Kong:</strong><br />
              Tech Boss Limited, Room 1002B, 10/F, Metro Centre II,<br />
              21 Lam Hing St, Kowloon Bay
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
            <a href="mailto:hello@techboss.app" style={{ display: 'block', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 20, transition: 'color 0.2s' }}>hello@techboss.app</a>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'flex-end', marginBottom: 28 }}>
              {[
                { label: 'Facebook', href: 'https://www.facebook.com/techboss.hk', short: 'FB' },
                { label: 'Instagram', href: 'https://www.instagram.com/techboss.hk', short: 'IG' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/company/tech-boss-limited', short: 'LI' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                   style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, color: '#555', letterSpacing: '0.08em', transition: 'color 0.2s' }}
                   onMouseEnter={e => (e.currentTarget.style.color = YELLOW)}
                   onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                >{s.short}</a>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              {[
                { label: 'Privacy Policy', href: '/techboss/privacy-policy' },
                { label: 'Terms of Service', href: '/techboss/eula' },
                { label: 'Delivery Policy', href: '/techboss/delivery-policy' },
              ].map(l => (
                <Link key={l.label} href={l.href} style={{ fontSize: 12, color: '#444', transition: 'color 0.2s' }}>{l.label}</Link>
              ))}
            </div>
          </div>
        </div>

        <div className="tb-divider" />
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 11, color: '#333' }}>© 2022–2025 Tech Boss Limited. Powered by Sandbox Group.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {NAV_LINKS.map(l => (
              <Link key={l.label} href={l.href} style={{ fontSize: 11, color: '#333', transition: 'color 0.2s' }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ─── */
export default function TechBossHomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <Ticker />
      <main>
        <Hero />
        <div className="tb-divider" />
        <WelcomeSection />
        <div className="tb-divider" />
        <ServicesSection />
        <div className="tb-divider" />
        <ERPSection />
        <div className="tb-divider" />
        <ClientsSection />
        <div className="tb-divider" />
        <AppBuilderSection />
        <div className="tb-divider" />
        <BrandingSection />
        <div className="tb-divider" />
        <AwardsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
