import Image from 'next/image';
import Link from 'next/link';
import { TBHeader, TBFooter, TBContactStrip, TBPageHero, YELLOW } from '../components';
import '../techboss.css';

const PRODUCTS = [
  {
    name: 'Tech Boss T-Shirt',
    zh: '波士T恤',
    price: 'HK$180',
    desc: 'Premium quality cotton tee with embroidered Tech Boss mascot. Show your tech spirit.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    img: '/techboss/images/mascot-tshirts.jpg',
    tag: 'Bestseller',
  },
  {
    name: 'NFC Business Card',
    zh: 'NFC名片',
    price: 'HK$280',
    desc: 'Smart NFC card that lets anyone tap-to-connect with your digital profile. Reusable and eco-friendly.',
    sizes: ['Standard', 'Premium Metal'],
    img: null,
    tag: 'New',
  },
  {
    name: 'Tech Boss Hoodie',
    zh: '波士衛衣',
    price: 'HK$380',
    desc: 'Heavyweight fleece hoodie. Comfortable for long coding sessions or startup events.',
    sizes: ['S', 'M', 'L', 'XL'],
    img: '/techboss/images/mascot-05.jpg',
    tag: '',
  },
  {
    name: 'App Builder Starter Pack',
    zh: 'App開發入門套裝',
    price: 'HK$3,800',
    desc: 'Get started with your first app: includes Tech Boss App Builder 3-month subscription + onboarding session.',
    sizes: ['1 app', '3 apps bundle'],
    img: null,
    tag: 'Popular',
  },
  {
    name: 'Dream Pro Bed',
    zh: 'Dream Pro 智能床',
    price: 'From HK$8,800',
    desc: 'AI-powered smart bed with sleep tracking, automatic adjustment, and integration with the Tech Boss health app.',
    sizes: ['Single', 'Queen', 'King'],
    img: null,
    tag: 'AI Product',
  },
  {
    name: 'Tech Boss Course Bundle',
    zh: '波士學堂課程套裝',
    price: 'HK$5,800',
    desc: 'Full 8-session Tech Boss Course + 1-on-1 mentoring session + App Builder access for 6 months.',
    sizes: ['Individual', 'Team (3 people)'],
    img: null,
    tag: 'Bundle',
  },
];

export default function ProductsPage() {
  return (
    <>
      <TBHeader />
      <main>
        <TBPageHero
          label="Products & Shop · 產品商店"
          title="The Tech Boss"
          titleYellow="Collection."
          sub="Merchandise, smart devices, NFC cards, and digital products — everything a Tech Boss needs."
        />

        {/* Products Grid */}
        <section className="tb-section" style={{ background: '#000' }}>
          <div className="tb-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {PRODUCTS.map(p => (
                <div key={p.name} style={{ background: '#0a0a0a', border: '1px solid #111', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ background: '#111', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    {p.img ? (
                      <Image src={p.img} alt={p.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ textAlign: 'center', padding: 24 }}>
                        <Image src="/techboss/images/logo.png" alt="Tech Boss" width={120} height={50} style={{ height: 40, width: 'auto', margin: '0 auto 16px', opacity: 0.3 }} />
                        <div style={{ fontSize: 12, color: '#333' }}>Image coming soon</div>
                      </div>
                    )}
                    {p.tag && (
                      <div style={{ position: 'absolute', top: 12, left: 12, background: YELLOW, color: '#000', fontSize: 10, fontWeight: 700, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.1em', padding: '4px 12px' }}>
                        {p.tag}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '28px 28px 36px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 11, color: '#555', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{p.zh}</div>
                    <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18, color: '#fff', marginBottom: 12 }}>{p.name}</h3>
                    <p style={{ fontSize: 13, color: '#888', lineHeight: 1.75, flex: 1, marginBottom: 20 }}>{p.desc}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                      {p.sizes.map(s => (
                        <span key={s} style={{ background: '#1a1a1a', border: '1px solid #222', color: '#666', fontSize: 11, padding: '4px 10px' }}>{s}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 20, color: YELLOW }}>{p.price}</span>
                      <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer" className="tb-btn-yellow" style={{ fontSize: 12, padding: '10px 20px' }}>
                        Order Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dream Pro Bed Feature */}
        <section className="tb-grid-2" style={{ background: '#0a0a0a', borderTop: '1px solid #111', minHeight: '50vh' }}>
          <div style={{ padding: '80px 60px 80px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="tb-label">AI Smart Product</span>
            <h2 className="tb-h2" style={{ marginBottom: 8 }}>Dream Pro Bed</h2>
            <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: YELLOW, marginBottom: 20 }}>AI-Powered Sleep Technology</h3>
            <div className="tb-gold-bar" />
            <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.85, marginBottom: 32 }}>
              The Dream Pro is our flagship AI product — a smart bed that monitors sleep patterns, automatically adjusts firmness and temperature, and syncs with your health data through the Tech Boss app.
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
              {['AI sleep pattern analysis', 'Auto-adjust firmness (8 zones)', 'Temperature control integration', 'Morning alarm & gentle wake', 'App-controlled via Tech Boss', 'Sleep score & health insights'].map(f => (
                <li key={f} style={{ display: 'flex', gap: 12, fontSize: 14, color: '#aaa' }}>
                  <span style={{ color: YELLOW, flexShrink: 0 }}>✦</span>{f}
                </li>
              ))}
            </ul>
            <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer" className="tb-btn-yellow" style={{ width: 'fit-content' }}>
              Enquire About Dream Pro
            </a>
          </div>
          <div style={{ background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, minHeight: 400 }}>
            <div style={{ textAlign: 'center' }}>
              <Image src="/techboss/images/logo.png" alt="Dream Pro Bed" width={160} height={60} style={{ height: 48, width: 'auto', margin: '0 auto 24px', opacity: 0.5 }} />
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 28, color: '#1a1a1a' }}>DREAM PRO</div>
              <div style={{ fontSize: 13, color: '#333', marginTop: 8 }}>Smart AI Bed</div>
            </div>
          </div>
        </section>

        <TBContactStrip />
      </main>
      <TBFooter />
    </>
  );
}
