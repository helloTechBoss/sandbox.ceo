import Image from 'next/image';
import Link from 'next/link';
import { TBHeader, TBFooter, TBContactStrip, TBPageHero, YELLOW } from '../components';
import '../techboss.css';

const TIMELINE = [
  {
    year: '2022',
    title: 'Dream It',
    content: 'Tech Boss Limited was founded in Hong Kong with a vision to democratize technology for small businesses. We started with corporate services and app development.',
  },
  {
    year: '2023',
    title: 'Build It',
    content: 'Recognized by Cyberport HK Tech 300 at CityU and awarded PolyU Microfund. Launched our no-code App Builder platform and served our first 20 clients.',
  },
  {
    year: '2024',
    title: 'Grow It & Educate It',
    content: 'Expanded into AI-powered ERP systems, IoT solutions, and launched Tech Boss Course — educating the next generation of Hong Kong entrepreneurs.',
  },
  {
    year: '2025',
    title: 'Scale It',
    content: 'Launched the full AI platform combining AI企業支援, AI個人成長, and AI內容變現. 50+ app clients. Two offices: Hong Kong and Huizhou, China.',
  },
];

const VALUES = [
  { title: 'Innovation First', zh: '創新為先', desc: 'We believe technology should be accessible to every entrepreneur, regardless of technical background.' },
  { title: 'Build Together', zh: '共同建立', desc: 'Our clients are our partners. We grow alongside you, providing support at every stage of your journey.' },
  { title: 'Made in HK', zh: '香港製造', desc: 'Proudly Hong Kong-based, serving local SMEs with deep understanding of the HK business landscape.' },
  { title: 'AI-Powered Future', zh: 'AI驅動未來', desc: 'We harness the power of AI to give small businesses the edge that was previously only available to enterprises.' },
];

const MASCOTS = [
  { src: '/techboss/images/mascot-headset.jpg', label: 'Tech Boss — Always Ready' },
  { src: '/techboss/images/mascot-thumbsup.jpg', label: 'Built on Confidence' },
  { src: '/techboss/images/mascot-tshirts.jpg', label: 'The Boss Collection' },
];

export default function OurStoryPage() {
  return (
    <>
      <TBHeader />
      <main>
        <TBPageHero
          label="Our Story · 我們的故事"
          title="From Kowloon Bay"
          titleYellow="to the World."
          sub="Tech Boss 的故事，是一個關於相信技術可以改變每一個創業者未來的故事。"
        />

        {/* Mission */}
        <section className="tb-section" style={{ background: '#000' }}>
          <div className="tb-container">
            <div className="tb-grid-2" style={{ gap: 80, alignItems: 'center' }}>
              <div>
                <span className="tb-label">Our Mission · 使命</span>
                <h2 className="tb-h2" style={{ marginBottom: 12 }}>
                  學習新科技，<br />掌握新未來
                </h2>
                <div className="tb-gold-bar" />
                <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.9, marginBottom: 24 }}>
                  Tech Boss is an AI platform that combines <strong style={{ color: '#fff' }}>AI企業支援</strong>, <strong style={{ color: '#fff' }}>AI個人成長</strong>, and <strong style={{ color: '#fff' }}>AI內容變現</strong> — designed for entrepreneurs and creators who want to turn ideas into impact.
                </p>
                <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.9, marginBottom: 40 }}>
                  We believe that every business owner in Hong Kong deserves access to enterprise-grade technology — not just those with million-dollar budgets. Our no-code platform, AI ERP systems, and education programs level the playing field.
                </p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <Link href="/techboss/corporate-services" className="tb-btn-yellow">Our Services</Link>
                  <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer" className="tb-btn-outline">Talk to Us</a>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {MASCOTS.map(m => (
                  <div key={m.label} style={{ position: 'relative', overflow: 'hidden' }}>
                    <Image src={m.src} alt={m.label} width={600} height={300} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '20px 20px 12px', fontSize: 12, color: '#888' }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="tb-section" style={{ background: '#0a0a0a', borderTop: '1px solid #111' }}>
          <div className="tb-container">
            <div style={{ textAlign: 'center', marginBottom: 72 }}>
              <span className="tb-label">Company Journey</span>
              <h2 className="tb-h2" style={{ marginBottom: 12 }}>Our Milestones</h2>
              <div className="tb-gold-bar" style={{ margin: '0 auto' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {TIMELINE.map((t, i) => (
                <div key={t.year} style={{ display: 'grid', gridTemplateColumns: '120px 2px 1fr', gap: '0 32px', paddingBottom: i < TIMELINE.length - 1 ? 48 : 0 }}>
                  <div style={{ textAlign: 'right', paddingTop: 4 }}>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 24, color: YELLOW }}>{t.year}</div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 14, height: 14, background: YELLOW, borderRadius: '50%', position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }} />
                    {i < TIMELINE.length - 1 && (
                      <div style={{ position: 'absolute', top: 20, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 2, background: '#1a1a1a' }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: 48 }}>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 12 }}>{t.title}</div>
                    <p style={{ fontSize: 14, color: '#888', lineHeight: 1.8 }}>{t.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="tb-section" style={{ background: '#000', borderTop: '1px solid #111' }}>
          <div className="tb-container">
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span className="tb-label">What We Stand For</span>
              <h2 className="tb-h2" style={{ marginBottom: 12 }}>Our Values</h2>
              <div className="tb-gold-bar" style={{ margin: '0 auto' }} />
            </div>
            <div className="tb-grid-4">
              {VALUES.map(v => (
                <div key={v.title} style={{ background: '#0a0a0a', border: '1px solid #111', padding: '40px 28px' }}>
                  <div className="tb-gold-bar" />
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 6 }}>{v.title}</h3>
                  <div style={{ fontSize: 12, color: YELLOW, marginBottom: 16 }}>{v.zh}</div>
                  <p style={{ fontSize: 13, color: '#888', lineHeight: 1.8 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Offices */}
        <section className="tb-section" style={{ background: '#0a0a0a', borderTop: '1px solid #111' }}>
          <div className="tb-container">
            <span className="tb-label">Our Locations</span>
            <h2 className="tb-h2" style={{ marginBottom: 12 }}>Two Offices, One Vision</h2>
            <div className="tb-gold-bar" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginTop: 8 }}>
              {[
                {
                  city: 'Hong Kong',
                  flag: '🇭🇰',
                  addr: 'Room 1002B, 10/F, Metro Centre II,\n21 Lam Hing St, Kowloon Bay',
                  tel: '+852 9231 8254',
                  email: 'hello@techboss.app',
                },
                {
                  city: 'China — Huizhou',
                  flag: '🇨🇳',
                  addr: '惠州仲恺高新区和畅五路西10号\n汇港城惠州仲恺港澳青年创业基地\n八楼公共孵化区B01-A09工位',
                  tel: '',
                  email: '',
                },
              ].map(o => (
                <div key={o.city} style={{ background: '#111', border: '1px solid #1a1a1a', padding: '48px 40px' }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{o.flag}</div>
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 20 }}>{o.city}</h3>
                  <div style={{ fontSize: 14, color: '#888', lineHeight: 2, whiteSpace: 'pre-line' }}>{o.addr}</div>
                  {o.tel && <div style={{ marginTop: 20, fontSize: 14, color: '#555' }}><strong style={{ color: '#aaa' }}>Tel:</strong> <a href={`tel:${o.tel}`} style={{ color: YELLOW }}>{o.tel}</a></div>}
                  {o.email && <div style={{ marginTop: 8, fontSize: 14, color: '#555' }}><strong style={{ color: '#aaa' }}>Email:</strong> <a href={`mailto:${o.email}`} style={{ color: YELLOW }}>{o.email}</a></div>}
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
