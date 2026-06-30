import Link from 'next/link';
import { TBHeader, TBFooter, TBContactStrip, TBPageHero, YELLOW } from '../components';
import '../techboss.css';

const APP_PLANS = [
  {
    name: 'Basic',
    zh: '基本計劃',
    price: 'HK$3,800',
    period: 'one-time setup',
    highlight: false,
    tag: '',
    desc: 'Perfect for solopreneurs and micro-businesses launching their first app.',
    features: [
      'App with up to 5 modules',
      'Basic branding (logo + colours)',
      'iOS & Android publishing',
      '3 months free maintenance',
      'Email support',
      'Tech Boss App Builder access',
    ],
    notIncluded: ['Custom integrations', 'Priority support', 'Analytics dashboard'],
    cta: 'Get Basic',
  },
  {
    name: 'Deluxe',
    zh: '豪華計劃',
    price: 'HK$9,800',
    period: 'one-time setup',
    highlight: true,
    tag: 'BEST VALUE',
    desc: 'For growing businesses that need a full-featured app with payments and loyalty.',
    features: [
      'App with up to 15 modules',
      'Full custom branding & UI',
      'Payment gateway integration',
      'Loyalty / membership module',
      'Push notification system',
      '6 months free maintenance',
      'WhatsApp priority support',
      'Analytics dashboard',
    ],
    notIncluded: ['ERP integration', 'Dedicated dev team'],
    cta: 'Get Deluxe',
  },
  {
    name: 'Gold',
    zh: '黃金計劃',
    price: 'HK$28,800',
    period: 'one-time setup',
    highlight: false,
    tag: '',
    desc: 'Enterprise-grade solution with full ERP integration and bespoke development.',
    features: [
      'Unlimited modules',
      'Full bespoke UI design',
      'ERP / POS integration',
      'IoT device integration',
      'Multi-language support',
      'Admin dashboard (web)',
      '12 months maintenance',
      'Dedicated account manager',
      'On-site support sessions',
    ],
    notIncluded: [],
    cta: 'Contact Us',
  },
];

const COURSE_PLANS = [
  {
    name: 'One-Day Workshop',
    zh: '一日工作坊',
    price: 'HK$880',
    period: '/person',
    desc: 'AI tools overview: ChatGPT, Midjourney, content creation — hands-on sessions.',
    features: ['ChatGPT masterclass', 'AI content creation', 'Lunch included', 'Certificate of completion'],
  },
  {
    name: 'Tech Boss Course',
    zh: '波士學堂課程',
    price: 'HK$3,800',
    period: '/person',
    desc: '8-session comprehensive program covering AI tools, no-code app building, and startup growth.',
    features: ['8 sessions (16 hours)', 'No-code app building', 'AI marketing tools', 'Startup business model', 'Private community access', 'Certificate'],
  },
  {
    name: '1-on-1 Mentoring',
    zh: '一對一輔導',
    price: 'HK$1,200',
    period: '/hour',
    desc: 'Private mentoring sessions tailored to your specific business needs and goals.',
    features: ['Personalized advice', 'Business strategy', 'Tech stack review', 'Follow-up resources'],
  },
];

const CORPORATE_PLANS = [
  {
    name: 'Starter',
    zh: '入門套餐',
    price: 'HK$980',
    period: '/month',
    features: ['Company Secretary (Basic)', 'Registered Address', 'Annual Return Filing', 'Email Support'],
  },
  {
    name: 'Professional',
    zh: '專業套餐',
    price: 'HK$2,880',
    period: '/month',
    highlight: true,
    features: ['Everything in Starter', 'Full Bookkeeping', 'Monthly Management Accounts', 'Tax Return Filing', 'Audit Coordination', 'Priority Support'],
  },
  {
    name: 'Enterprise',
    zh: '企業套餐',
    price: 'Custom',
    period: '',
    features: ['Everything in Professional', 'Dedicated Account Manager', 'ERP System Integration', 'HR & Payroll', 'Company Restructuring'],
  },
];

export default function PricingPage() {
  return (
    <>
      <TBHeader />
      <main>
        <TBPageHero
          label="Pricing · 收費方案"
          title="Simple, Transparent"
          titleYellow="Pricing."
          sub="No hidden fees. No surprises. Choose the plan that fits your stage and budget — and grow with us."
        />

        {/* App Builder Pricing */}
        <section className="tb-section" style={{ background: '#000' }}>
          <div className="tb-container">
            <span className="tb-label">App Development</span>
            <h2 className="tb-h2" style={{ marginBottom: 12 }}>App Builder Plans</h2>
            <div className="tb-gold-bar" />
            <div className="tb-grid-3" style={{ gap: 2, marginTop: 8 }}>
              {APP_PLANS.map(p => (
                <div key={p.name} style={{
                  background: p.highlight ? '#111' : '#0a0a0a',
                  border: p.highlight ? `2px solid ${YELLOW}` : '1px solid #111',
                  padding: '48px 36px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {p.tag && (
                    <div style={{ position: 'absolute', top: -1, left: 32, background: YELLOW, color: '#000', fontSize: 10, fontWeight: 700, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.12em', padding: '4px 14px' }}>
                      {p.tag}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: '#555', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{p.zh}</div>
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 24, color: '#fff', marginBottom: 4 }}>{p.name}</h3>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', color: p.highlight ? YELLOW : '#fff', marginTop: 16 }}>{p.price}</div>
                  <div style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>{p.period}</div>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.75, marginBottom: 28 }}>{p.desc}</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                    {p.features.map(f => (
                      <li key={f} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#aaa' }}>
                        <span style={{ color: YELLOW, flexShrink: 0 }}>✓</span>{f}
                      </li>
                    ))}
                    {p.notIncluded?.map(f => (
                      <li key={f} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#333' }}>
                        <span style={{ color: '#333', flexShrink: 0 }}>✕</span>{f}
                      </li>
                    ))}
                  </ul>
                  <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer"
                    className={p.highlight ? 'tb-btn-yellow' : 'tb-btn-outline'}
                    style={{ marginTop: 36, justifyContent: 'center' }}>
                    {p.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Course Pricing */}
        <section className="tb-section" style={{ background: '#0a0a0a', borderTop: '1px solid #111' }}>
          <div className="tb-container">
            <span className="tb-label">Education · 教育</span>
            <h2 className="tb-h2" style={{ marginBottom: 12 }}>Course & Training</h2>
            <div className="tb-gold-bar" />
            <div className="tb-grid-3" style={{ gap: 2, marginTop: 8 }}>
              {COURSE_PLANS.map(p => (
                <div key={p.name} className="tb-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="tb-label">{p.zh}</span>
                  <h3 className="tb-h3" style={{ marginBottom: 12 }}>{p.name}</h3>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 28, color: YELLOW, marginBottom: 4 }}>{p.price}</div>
                  <div style={{ fontSize: 12, color: '#555', marginBottom: 20 }}>{p.period}</div>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.75, marginBottom: 24 }}>{p.desc}</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, marginBottom: 32 }}>
                    {p.features.map(f => (
                      <li key={f} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#aaa' }}>
                        <span style={{ color: YELLOW, flexShrink: 0 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer" className="tb-btn-yellow">Enquire</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate Services Pricing */}
        <section className="tb-section" style={{ background: '#000', borderTop: '1px solid #111' }}>
          <div className="tb-container">
            <span className="tb-label">Corporate Services · 企業服務</span>
            <h2 className="tb-h2" style={{ marginBottom: 12 }}>Corporate Plans</h2>
            <div className="tb-gold-bar" />
            <div className="tb-grid-3" style={{ gap: 2, marginTop: 8 }}>
              {CORPORATE_PLANS.map(p => (
                <div key={p.name} style={{
                  background: (p as { highlight?: boolean }).highlight ? '#111' : '#0a0a0a',
                  border: (p as { highlight?: boolean }).highlight ? `2px solid ${YELLOW}` : '1px solid #111',
                  padding: '40px 32px',
                }}>
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 4 }}>{p.name}</h3>
                  <div style={{ fontSize: 11, color: '#555', marginBottom: 16 }}>{p.zh}</div>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 28, color: (p as { highlight?: boolean }).highlight ? YELLOW : '#fff' }}>{p.price}</div>
                  <div style={{ fontSize: 12, color: '#555', marginBottom: 28 }}>{p.period || 'Contact us'}</div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                    {p.features.map(f => (
                      <li key={f} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#aaa' }}>
                        <span style={{ color: YELLOW, flexShrink: 0 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer"
                    className={(p as { highlight?: boolean }).highlight ? 'tb-btn-yellow' : 'tb-btn-outline'}
                    style={{ width: '100%', justifyContent: 'center' }}>
                    Get Started
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="tb-section" style={{ background: '#0a0a0a', borderTop: '1px solid #111' }}>
          <div className="tb-container">
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 64 }}>
                <span className="tb-label">FAQ</span>
                <h2 className="tb-h2" style={{ marginBottom: 12 }}>Common Questions</h2>
                <div className="tb-gold-bar" style={{ margin: '0 auto' }} />
              </div>
              {[
                { q: 'How long does it take to build my app?', a: 'A Basic plan app typically takes 2–3 weeks from kickoff to launch. Deluxe takes 4–6 weeks, and Gold/custom projects are scoped individually.' },
                { q: 'Do I need any technical knowledge?', a: 'No. Our no-code platform is designed for non-technical users. We handle all the technical work — you focus on your business.' },
                { q: 'Can I update the app content myself?', a: 'Yes. All apps come with a dashboard where you can update menus, products, prices, banners, and push notifications without touching code.' },
                { q: 'What happens after the 3/6/12 months maintenance?', a: 'You can renew a maintenance plan starting from HK$480/month, which covers bug fixes, OS updates, and minor module changes.' },
                { q: 'Is there a monthly subscription fee?', a: 'The setup fee is one-time. There are optional maintenance plans and server/hosting fees depending on your app\'s features and usage.' },
              ].map((faq, i) => (
                <div key={i} style={{ borderBottom: '1px solid #111', padding: '28px 0' }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 12 }}>
                    <span style={{ color: YELLOW, marginRight: 12 }}>Q.</span>{faq.q}
                  </div>
                  <p style={{ fontSize: 14, color: '#888', lineHeight: 1.8, paddingLeft: 28 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TBContactStrip />
      </main>
      <TBFooter />
    </>
  );
}
