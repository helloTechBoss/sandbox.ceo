import Link from 'next/link';
import Image from 'next/image';
import { TBHeader, TBFooter, TBContactStrip, TBPageHero, YELLOW } from '../components';
import '../techboss.css';

const SERVICES = [
  {
    en: 'Account & Audit',
    zh: '會計及審計',
    icon: '/techboss/icons/accounting.png',
    desc: '專業會計、年度審計及稅務申報服務，為中小企業提供符合香港法規的財務管理方案。',
    items: ['Annual audit report', 'Bookkeeping & accounting', 'Tax return filing (profits tax)', 'Financial statement preparation', 'Management accounts', 'MPF administration'],
  },
  {
    en: 'Company Secretary',
    zh: '公司秘書',
    icon: '/techboss/icons/comsec.png',
    desc: '香港公司成立、周年申報、法定文件管理及全方位公司秘書服務，確保合規運作。',
    items: ['Company incorporation (HK)', 'Annual return filing', 'NAR1 statutory forms', 'Registered address service', 'Director & shareholder changes', 'Business registration renewal'],
  },
  {
    en: 'Office Booking',
    zh: '沙盒商務中心',
    icon: '/techboss/icons/booking.png',
    desc: '九龍灣Metro Centre II靈活辦公空間、會議室及虛擬辦公室服務，助您以低成本建立專業形象。',
    items: ['Hot desk & dedicated desk', 'Private meeting rooms', 'Virtual office address', 'Mail handling service', 'Business address (KLN Bay)', 'Hourly / monthly rental'],
  },
  {
    en: 'Tech Boss Course',
    zh: '波士學堂',
    icon: '/techboss/icons/course.png',
    desc: 'AI工具實戰課程、創業培訓及科技應用工作坊，讓你掌握最新AI技能，實現事業突破。',
    items: ['ChatGPT & AI tools workshop', 'No-code app building course', 'Startup growth masterclass', 'Digital marketing with AI', 'Social media content AI', 'One-on-one mentoring'],
  },
];

const PACKAGES = [
  {
    name: 'Starter',
    zh: '入門套餐',
    price: 'HK$980',
    period: '/月',
    highlight: false,
    features: [
      'Company Secretary (Basic)',
      'Registered Address',
      'Annual Return Filing',
      'Email Support',
    ],
  },
  {
    name: 'Professional',
    zh: '專業套餐',
    price: 'HK$2,880',
    period: '/月',
    highlight: true,
    features: [
      'Everything in Starter',
      'Full Bookkeeping',
      'Monthly Management Accounts',
      'Tax Return Filing',
      'Audit Coordination',
      'Priority Support',
    ],
  },
  {
    name: 'Enterprise',
    zh: '企業套餐',
    price: 'Custom',
    period: '',
    highlight: false,
    features: [
      'Everything in Professional',
      'Dedicated Account Manager',
      'ERP System Integration',
      'HR & Payroll',
      'Company Restructuring',
      'On-site Support',
    ],
  },
];

export default function CorporateServicesPage() {
  return (
    <>
      <TBHeader />
      <main>
        <TBPageHero
          label="Corporate Services · 企業服務"
          title="Complete Business"
          titleYellow="Support for HK SMEs"
          sub="從公司成立到日常運營，Tech Boss 為香港中小企業提供一站式企業支援服務，讓你專注業務增長。"
        />

        {/* Services Grid */}
        <section className="tb-section" style={{ background: '#000' }}>
          <div className="tb-container">
            <span className="tb-label">Our Services</span>
            <h2 className="tb-h2" style={{ marginBottom: 12 }}>What We Offer</h2>
            <div className="tb-gold-bar" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, marginTop: 8 }}>
              {SERVICES.map(s => (
                <div key={s.en} className="tb-card" style={{ padding: '48px 40px' }}>
                  <Image src={s.icon} alt={s.en} width={64} height={64} style={{ width: 56, height: 56, objectFit: 'contain', marginBottom: 24 }} />
                  <span className="tb-label">{s.en}</span>
                  <h3 className="tb-h3" style={{ marginBottom: 16 }}>{s.zh}</h3>
                  <p style={{ fontSize: 14, color: '#888', lineHeight: 1.8, marginBottom: 28 }}>{s.desc}</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {s.items.map(item => (
                      <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 13, color: '#aaa' }}>
                        <span style={{ color: YELLOW, flexShrink: 0, marginTop: 1 }}>✦</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer" className="tb-btn-yellow" style={{ marginTop: 32, fontSize: 13, padding: '12px 24px' }}>
                    Enquire Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="tb-section" style={{ background: '#0a0a0a', borderTop: '1px solid #111' }}>
          <div className="tb-container">
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span className="tb-label">Transparent Pricing</span>
              <h2 className="tb-h2" style={{ marginBottom: 12 }}>Service Packages</h2>
              <div className="tb-gold-bar" style={{ margin: '0 auto' }} />
              <p style={{ fontSize: 15, color: '#888', maxWidth: 480, margin: '0 auto' }}>
                No hidden fees. Clear and simple pricing for Hong Kong businesses.
              </p>
            </div>
            <div className="tb-grid-3">
              {PACKAGES.map(p => (
                <div key={p.name} style={{
                  background: p.highlight ? '#111' : '#0a0a0a',
                  border: p.highlight ? `2px solid ${YELLOW}` : '1px solid #1a1a1a',
                  padding: '48px 32px',
                  position: 'relative',
                }}>
                  {p.highlight && (
                    <div style={{ position: 'absolute', top: -1, left: 32, background: YELLOW, color: '#000', fontSize: 11, fontWeight: 700, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.1em', padding: '4px 14px' }}>
                      MOST POPULAR
                    </div>
                  )}
                  <span className="tb-label">{p.zh}</span>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: p.highlight ? YELLOW : '#fff', marginBottom: 4 }}>
                    {p.price}
                  </div>
                  <div style={{ fontSize: 13, color: '#555', marginBottom: 32 }}>{p.period || 'Contact for quote'}</div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
                    {p.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#aaa' }}>
                        <span style={{ color: YELLOW, flexShrink: 0 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer"
                    className={p.highlight ? 'tb-btn-yellow' : 'tb-btn-outline'}
                    style={{ width: '100%', justifyContent: 'center' }}>
                    Get Started
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Office Map */}
        <section className="tb-grid-2" style={{ background: '#000', borderTop: '1px solid #111', minHeight: '50vh' }}>
          <div style={{ padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="tb-label">Our Office · 辦公室</span>
            <h2 className="tb-h2" style={{ marginBottom: 12 }}>Visit Us</h2>
            <div className="tb-gold-bar" />
            <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.85, marginBottom: 32 }}>
              We are located in Kowloon Bay, Hong Kong — convenient access from MTR Kowloon Bay Station (Exit A).
            </p>
            <div style={{ fontSize: 13, color: '#666', lineHeight: 2 }}>
              <strong style={{ color: '#aaa' }}>Address:</strong><br />
              Room 1002B, 10/F, Metro Centre II,<br />
              21 Lam Hing Street, Kowloon Bay<br />
              <br />
              <strong style={{ color: '#aaa' }}>Hours:</strong><br />
              Mon–Fri: 9:00am – 6:00pm<br />
              Sat: 10:00am – 2:00pm (by appointment)
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
              <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer" className="tb-btn-yellow">WhatsApp</a>
              <a href="mailto:hello@techboss.app" className="tb-btn-outline">Email</a>
            </div>
          </div>
          <div style={{ overflow: 'hidden', minHeight: 400 }}>
            <iframe
              src="https://maps.google.com/maps?q=Metro+Centre+II,+21+Lam+Hing+St,+Kowloon+Bay,+Hong+Kong&output=embed"
              width="100%" height="100%"
              style={{ border: 0, minHeight: 480, filter: 'invert(90%) hue-rotate(180deg)' }}
              loading="lazy"
              title="Tech Boss Office"
            />
          </div>
        </section>

        <TBContactStrip />
      </main>
      <TBFooter />
    </>
  );
}
