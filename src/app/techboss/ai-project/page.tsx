import Link from 'next/link';
import Image from 'next/image';
import { TBHeader, TBFooter, TBContactStrip, TBPageHero, YELLOW } from '../components';
import '../techboss.css';

const ERP_SOLUTIONS = [
  {
    title: 'Clinic & Chinese Medicine ERP',
    zh: '診所及中醫診所ERP',
    desc: 'Appointment booking, patient records, prescription management, inventory tracking — all in one system tailored for Hong Kong clinics.',
    icon: '🏥',
  },
  {
    title: 'Property Management System',
    zh: '物業管理系統',
    desc: 'Tenant management, maintenance requests, fee collection, and reporting for property companies and housing estates.',
    icon: '🏢',
  },
  {
    title: 'Inventory & Logistics ERP',
    zh: '庫存及物流ERP',
    desc: 'Real-time stock tracking, purchase orders, warehouse management, and delivery optimization for e-commerce and retail.',
    icon: '📦',
  },
  {
    title: 'Smart Vending Machine IoT',
    zh: '智能自動售賣機IoT',
    desc: 'IoT-connected vending machines with real-time sales data, remote inventory management, and cashless payment integration.',
    icon: '🤖',
  },
  {
    title: 'IoT Smart Farm',
    zh: 'IoT智能農場',
    desc: 'Sensor-driven crop monitoring, automated irrigation, environmental controls, and harvest data analytics.',
    icon: '🌱',
  },
  {
    title: 'STEAM Classroom System',
    zh: 'STEAM教室系統',
    desc: 'Interactive IoT learning environment management, student progress tracking, and STEAM curriculum delivery platform.',
    icon: '🔬',
  },
];

const APP_SCREENS = [
  { src: '/techboss/images/diy-burger.png', alt: 'Menu Module' },
  { src: '/techboss/images/diy-calendar.png', alt: 'Booking Module' },
  { src: '/techboss/images/diy-payment.png', alt: 'Payment Module' },
  { src: '/techboss/images/diy-address.png', alt: 'Address Module' },
  { src: '/techboss/images/diy-cart.png', alt: 'Cart Module' },
];

const APP_TEMPLATES = [
  { name: 'Restaurant & F&B', icon: '🍔', tag: 'Popular' },
  { name: 'Pet Care Platform', icon: '🐾', tag: '' },
  { name: 'Beauty & Salon', icon: '💅', tag: '' },
  { name: 'E-commerce Store', icon: '🛍️', tag: 'Popular' },
  { name: 'Travel & Tours', icon: '✈️', tag: '' },
  { name: 'Fitness & Gym', icon: '💪', tag: '' },
  { name: 'Education Platform', icon: '📚', tag: '' },
  { name: 'Real Estate', icon: '🏠', tag: 'New' },
];

export default function AIProjectPage() {
  return (
    <>
      <TBHeader />
      <main>
        <TBPageHero
          label="AI Project · AI項目"
          title="Build Smarter."
          titleYellow="Powered by AI."
          sub="從ERP系統到無代碼App Builder，Tech Boss 以AI技術驅動您的業務數碼轉型，讓創業者和企業主輕鬆掌握科技優勢。"
        />

        {/* App Builder Hero */}
        <section style={{ background: '#000', borderBottom: '1px solid #111' }}>
          <div className="tb-grid-2" style={{ minHeight: '60vh' }}>
            <div style={{ padding: '80px 60px 80px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="tb-label">No-Code Platform · 無代碼平台</span>
              <h2 className="tb-h2" style={{ marginBottom: 8 }}>DIY App Builder</h2>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 'clamp(1rem, 2vw, 1.4rem)', color: YELLOW, marginBottom: 20 }}>
                Just Like Building a Burger
              </h3>
              <div className="tb-gold-bar" />
              <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.85, marginBottom: 32 }}>
                Tech Boss App is an intelligent app builder platform that allows startup owners to build apps without any coding knowledge — at the lowest cost with various ready-made templates. Our vision is to become the &ldquo;Squarespace&rdquo; of the mobile application sector.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
                {['Pick your industry template', 'Customize colours & branding', 'Add modules: booking, payment, loyalty', 'Publish to iOS & Android', 'Manage everything from dashboard'].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 12, fontSize: 14, color: '#aaa' }}>
                    <span style={{ color: YELLOW, flexShrink: 0 }}>✦</span>{item}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a href="https://app.techboss.app" target="_blank" rel="noreferrer" className="tb-btn-yellow">Start Building Free</a>
                <Link href="/techboss/pricing" className="tb-btn-outline">View Pricing</Link>
              </div>
            </div>
            <div style={{ background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
              <div className="tb-diy-screens" style={{ maxWidth: 480 }}>
                {APP_SCREENS.map(s => (
                  <div key={s.alt} style={{ background: '#111', borderRadius: 14, overflow: 'hidden', padding: 6 }}>
                    <Image src={s.src} alt={s.alt} width={160} height={300} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Templates */}
        <section className="tb-section" style={{ background: '#0a0a0a' }}>
          <div className="tb-container">
            <span className="tb-label">App Templates · 應用模板</span>
            <h2 className="tb-h2" style={{ marginBottom: 12 }}>Ready-Made Templates</h2>
            <div className="tb-gold-bar" />
            <div className="tb-grid-4">
              {APP_TEMPLATES.map(t => (
                <div key={t.name} className="tb-card" style={{ textAlign: 'center', padding: '32px 24px' }}>
                  {t.tag && (
                    <div style={{ display: 'inline-block', background: YELLOW, color: '#000', fontSize: 10, fontWeight: 700, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.1em', padding: '3px 10px', marginBottom: 16 }}>
                      {t.tag}
                    </div>
                  )}
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{t.icon}</div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>{t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ERP Solutions */}
        <section className="tb-section" style={{ background: '#000', borderTop: '1px solid #111' }}>
          <div className="tb-container">
            <span className="tb-label">Enterprise Solutions</span>
            <h2 className="tb-h2" style={{ marginBottom: 12 }}>ERP & IoT Systems</h2>
            <div className="tb-gold-bar" />
            <p style={{ fontSize: 15, color: '#888', maxWidth: 600, marginBottom: 64, lineHeight: 1.8 }}>
              Award-winning ERP systems built for Hong Kong businesses — recognized by Cyberport HK Tech 300 (CityU) and PolyU Microfund.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {ERP_SOLUTIONS.map(s => (
                <div key={s.title} className="tb-card">
                  <div style={{ fontSize: 40, marginBottom: 20 }}>{s.icon}</div>
                  <span className="tb-label" style={{ color: '#555', marginBottom: 6 }}>ERP Solution</span>
                  <h3 className="tb-h3" style={{ marginBottom: 8 }}>{s.title}</h3>
                  <div style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>{s.zh}</div>
                  <p style={{ fontSize: 13, color: '#888', lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards */}
        <section className="tb-section" style={{ background: '#0a0a0a', borderTop: '1px solid #111' }}>
          <div className="tb-container">
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span className="tb-label">Recognition</span>
              <h2 className="tb-h2" style={{ marginBottom: 12 }}>Award-Winning Team</h2>
              <div className="tb-gold-bar" style={{ margin: '0 auto 24px' }} />
              <p style={{ fontSize: 15, color: '#888', maxWidth: 560, margin: '0 auto' }}>
                Tech Boss has been recognized by leading Hong Kong innovation programs.
              </p>
            </div>
            <div className="tb-grid-3" style={{ gap: 2 }}>
              {[
                { title: 'Cyberport HK Tech 300', org: 'City University of Hong Kong', year: '2023', desc: 'Selected for the prestigious tech startup program at CityU Cyberport, validating our AI-powered ERP innovation.' },
                { title: 'PolyU Microfund', org: 'The Hong Kong Polytechnic University', year: '2023', desc: 'Awarded funding from PolyU Microfund for outstanding startup potential in the Hong Kong tech ecosystem.' },
                { title: 'Startup Ecosystem', org: 'Hong Kong Innovation', year: '2022–Present', desc: 'Active member of the Hong Kong startup ecosystem, mentoring new entrepreneurs through Tech Boss Course.' },
              ].map(a => (
                <div key={a.title} style={{ background: '#111', border: '1px solid #1a1a1a', padding: '40px 32px' }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, fontWeight: 700, color: YELLOW, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{a.year}</div>
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', marginBottom: 8 }}>{a.title}</h3>
                  <div style={{ fontSize: 12, color: '#555', marginBottom: 20 }}>{a.org}</div>
                  <p style={{ fontSize: 13, color: '#888', lineHeight: 1.75 }}>{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mascot visual */}
        <section className="tb-grid-2" style={{ background: '#000', borderTop: '1px solid #111', minHeight: '50vh' }}>
          <div style={{ overflow: 'hidden', minHeight: 400 }}>
            <Image
              src="/techboss/images/mascot-tshirts.jpg"
              alt="Tech Boss Merchandise"
              width={800}
              height={600}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ padding: '80px 80px 80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="tb-label">Tech Boss Merchandise</span>
            <h2 className="tb-h2" style={{ marginBottom: 12 }}>The Boss Collection</h2>
            <div className="tb-gold-bar" />
            <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.85, marginBottom: 32 }}>
              Represent the Tech Boss community with exclusive branded merchandise. Each purchase supports our STEAM education programs and startup community initiatives.
            </p>
            <Link href="/techboss/products" className="tb-btn-yellow" style={{ width: 'fit-content' }}>
              Shop Now
            </Link>
          </div>
        </section>

        <TBContactStrip />
      </main>
      <TBFooter />
    </>
  );
}
