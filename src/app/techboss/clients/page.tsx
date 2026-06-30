import Image from 'next/image';
import { TBHeader, TBFooter, TBContactStrip, TBPageHero, YELLOW } from '../components';
import '../techboss.css';

const APP_CLIENTS = [
  { src: '/techboss/images/client-pet-iot.png', name: 'Pet IoT App', cat: 'IoT / Pet Care' },
  { src: '/techboss/images/client-job.jpg', name: 'Job Platform', cat: 'Recruitment' },
  { src: '/techboss/images/client-travel.png', name: 'Travel Platform', cat: 'Travel & Tours' },
  { src: '/techboss/images/client-cat.jpg', name: 'Coffee Cat', cat: 'F&B' },
  { src: '/techboss/images/client-lobo.jpg', name: 'Lobo Lobo', cat: 'Fashion' },
  { src: '/techboss/images/client-bag.png', name: 'Bag Brand', cat: 'Fashion / Retail' },
  { src: '/techboss/images/client-rfood.png', name: 'Food Delivery', cat: 'F&B / Delivery' },
  { src: '/techboss/images/client-petclothing.png', name: 'Pet Clothing', cat: 'Pet / Fashion' },
];

const BRANDING_CLIENTS = [
  { src: '/techboss/images/brand-1.png', name: 'Branding Client 1' },
  { src: '/techboss/images/brand-2.png', name: 'Branding Client 2' },
  { src: '/techboss/images/brand-3.png', name: 'Branding Client 3' },
  { src: '/techboss/images/brand-4.png', name: 'Branding Client 4' },
  { src: '/techboss/images/brand-5.png', name: 'Branding Client 5' },
  { src: '/techboss/images/brand-6.png', name: 'Branding Client 6' },
  { src: '/techboss/images/brand-7.png', name: 'Branding Client 7' },
];

const TESTIMONIALS = [
  {
    name: 'Vivian Poon',
    role: 'Hong Kong Fashion Designer',
    content: 'Tech Boss built my brand app in just 2 weeks. The no-code platform is amazing — I can update products and promotions myself without any tech knowledge.',
  },
  {
    name: 'Coffee Cat Team',
    role: 'F&B Startup',
    content: 'The loyalty program module transformed our customer retention. Our repeat purchase rate increased by 40% after launching our Coffee Cat app with Tech Boss.',
  },
  {
    name: 'Pet IoT Founder',
    role: 'IoT Pet Care Startup',
    content: 'The IoT integration Tech Boss provided was seamless. Real-time pet monitoring data flowing through our app — something we thought would cost 10x more.',
  },
];

const STATS = [
  { num: '50+', label: 'Apps Launched' },
  { num: '10+', label: 'Industries' },
  { num: '3', label: 'Years Track Record' },
  { num: '95%', label: 'Client Satisfaction' },
];

export default function ClientsPage() {
  return (
    <>
      <TBHeader />
      <main>
        <TBPageHero
          label="Our Clients · 客戶案例"
          title="Trusted by"
          titleYellow="50+ HK Startups"
          sub="從寵物IoT到食品外送，Tech Boss 已協助超過50間香港初創企業及中小企業建立自己的應用程式，實現數碼轉型。"
        />

        {/* Stats */}
        <section style={{ background: '#0a0a0a', borderBottom: '1px solid #111', padding: '48px 0' }}>
          <div className="tb-container">
            <div className="tb-grid-4">
              {STATS.map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)', color: YELLOW }}>{s.num}</div>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App Clients Grid */}
        <section className="tb-section" style={{ background: '#000' }}>
          <div className="tb-container" style={{ marginBottom: 48 }}>
            <span className="tb-label">App Development</span>
            <h2 className="tb-h2" style={{ marginBottom: 12 }}>Our App Clients</h2>
            <div className="tb-gold-bar" />
            <p style={{ fontSize: 15, color: '#888', maxWidth: 540 }}>
              Every client below built their app using the Tech Boss no-code platform — without writing a single line of code.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {APP_CLIENTS.map(c => (
              <div key={c.name} style={{ position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}>
                <Image
                  src={c.src}
                  alt={c.name}
                  width={400}
                  height={300}
                  style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)', padding: '32px 20px 16px' }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: YELLOW, marginTop: 4 }}>{c.cat}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer" className="tb-btn-yellow">
              Build Your App
            </a>
          </div>
        </section>

        {/* NFC Card Section */}
        <section className="tb-section" style={{ background: '#0a0a0a', borderTop: '1px solid #111' }}>
          <div className="tb-container">
            <div className="tb-grid-2" style={{ gap: 80, alignItems: 'center' }}>
              <div>
                <span className="tb-label">Smart Business Card</span>
                <h2 className="tb-h2" style={{ marginBottom: 12 }}>NFC Business Cards</h2>
                <div className="tb-gold-bar" />
                <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.85, marginBottom: 24 }}>
                  Ditch the paper. Our NFC-enabled Tech Boss cards let people tap-to-connect with your digital profile, social links, portfolio, and contact details — instantly.
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
                  {['One tap to share your profile', 'Link to your Tech Boss app', 'Update info anytime — no reprint', 'Works with all smartphones', 'Custom branding & design'].map(item => (
                    <li key={item} style={{ display: 'flex', gap: 12, fontSize: 14, color: '#aaa' }}>
                      <span style={{ color: YELLOW, flexShrink: 0 }}>✦</span>{item}
                    </li>
                  ))}
                </ul>
                <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer" className="tb-btn-yellow" style={{ width: 'fit-content' }}>
                  Order NFC Card
                </a>
              </div>
              <div style={{ background: '#111', border: '1px solid #1a1a1a', padding: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
                <div style={{ textAlign: 'center' }}>
                  <Image src="/techboss/images/logo.png" alt="Tech Boss NFC Card" width={200} height={80} style={{ height: 60, width: 'auto', margin: '0 auto 24px' }} />
                  <div style={{ width: 200, height: 120, background: '#1a1a1a', border: `2px solid ${YELLOW}`, borderRadius: 12, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 12, color: YELLOW, letterSpacing: '0.1em' }}>NFC</div>
                      <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>Tap to Connect</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Branding Clients */}
        <section className="tb-section" style={{ background: '#000', borderTop: '1px solid #111' }}>
          <div className="tb-container">
            <span className="tb-label">Branding & Design</span>
            <h2 className="tb-h2" style={{ marginBottom: 12 }}>Branding Clients</h2>
            <div className="tb-gold-bar" />
            <p style={{ fontSize: 14, color: '#666', marginBottom: 48, maxWidth: 480 }}>
              Whatever it is, the way you tell your story online can make all the difference.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {BRANDING_CLIENTS.map((c, i) => (
                <div key={i} style={{ overflow: 'hidden' }}>
                  <Image src={c.src} alt={c.name} width={300} height={225} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
              <div style={{ background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, border: '1px solid #1a1a1a' }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 28, fontWeight: 900, color: YELLOW }}>+More</span>
                <span style={{ color: '#888', fontSize: 13, textAlign: 'center' }}>New clients weekly</span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="tb-section" style={{ background: '#0a0a0a', borderTop: '1px solid #111' }}>
          <div className="tb-container">
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span className="tb-label">Client Feedback</span>
              <h2 className="tb-h2" style={{ marginBottom: 12 }}>What Our Clients Say</h2>
              <div className="tb-gold-bar" style={{ margin: '0 auto' }} />
            </div>
            <div className="tb-grid-3" style={{ gap: 2 }}>
              {TESTIMONIALS.map(t => (
                <div key={t.name} style={{ background: '#111', border: '1px solid #1a1a1a', padding: '40px 32px' }}>
                  <div style={{ fontSize: 32, color: YELLOW, fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: 20 }}>&ldquo;</div>
                  <p style={{ fontSize: 14, color: '#aaa', lineHeight: 1.85, marginBottom: 32, fontStyle: 'italic' }}>{t.content}</p>
                  <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 20 }}>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: YELLOW, marginTop: 4 }}>{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Story Videos */}
        <section className="tb-section" style={{ background: '#000', borderTop: '1px solid #111' }}>
          <div className="tb-container">
            <span className="tb-label">Video Testimonials</span>
            <h2 className="tb-h2" style={{ marginBottom: 12 }}>Client Stories</h2>
            <div className="tb-gold-bar" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginTop: 8 }}>
              {[
                { title: 'Hong Kong Designer Vivian Poon with Tech Boss', channel: '科技波士 Tech Boss', id: 'vivian' },
                { title: 'Coffee Cat with Tech Boss App', channel: '科技波士 Tech Boss', id: 'coffeecat' },
              ].map(v => (
                <div key={v.id} style={{ background: '#0a0a0a', border: '1px solid #111' }}>
                  <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #111' }}>
                    <Image src="/techboss/images/logo.png" alt="Tech Boss" width={40} height={40} style={{ width: 36, height: 36, objectFit: 'contain' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{v.title}</div>
                      <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{v.channel}</div>
                    </div>
                  </div>
                  <div style={{ background: '#111', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ width: 60, height: 60, background: 'rgba(220,0,0,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#fff', fontSize: 22, marginLeft: 4 }}>▶</span>
                    </div>
                    <div style={{ position: 'absolute', bottom: 12, left: 16, fontSize: 11, color: '#444' }}>Click to watch on YouTube</div>
                  </div>
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
