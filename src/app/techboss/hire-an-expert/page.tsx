import Image from 'next/image';
import { TBHeader, TBFooter, TBContactStrip, TBPageHero, YELLOW } from '../components';
import '../techboss.css';

const EXPERTS = [
  {
    role: 'App Developer',
    zh: '應用程式開發員',
    skills: ['React Native', 'Flutter', 'iOS / Android', 'API Integration'],
    rate: 'From HK$800/hr',
  },
  {
    role: 'AI Consultant',
    zh: 'AI顧問',
    skills: ['ChatGPT Integration', 'AI Automation', 'Prompt Engineering', 'LLM fine-tuning'],
    rate: 'From HK$1,200/hr',
  },
  {
    role: 'UI/UX Designer',
    zh: 'UI/UX設計師',
    skills: ['Figma', 'App Prototyping', 'User Research', 'Design System'],
    rate: 'From HK$600/hr',
  },
  {
    role: 'ERP Specialist',
    zh: 'ERP系統專員',
    skills: ['System Architecture', 'Database Design', 'Integration', 'Training'],
    rate: 'From HK$1,000/hr',
  },
  {
    role: 'Digital Marketer',
    zh: '數碼市場推廣',
    skills: ['Social Media AI', 'SEO', 'Content Strategy', 'Ad Campaign'],
    rate: 'From HK$500/hr',
  },
  {
    role: 'IoT Engineer',
    zh: 'IoT工程師',
    skills: ['Hardware Integration', 'Sensor Systems', 'Smart Device API', 'MQTT Protocol'],
    rate: 'From HK$1,000/hr',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Tell Us Your Need', desc: 'WhatsApp or fill in the form below with your project requirements and timeline.' },
  { step: '02', title: 'Expert Matching', desc: 'We match you with the right specialist from our vetted Tech Boss expert network.' },
  { step: '03', title: 'Free Consultation', desc: '30-minute free consultation to scope the project, align expectations, and agree on terms.' },
  { step: '04', title: 'Start Working', desc: 'Your expert begins work. We oversee quality and ensure delivery on time and budget.' },
];

export default function HireAnExpertPage() {
  return (
    <>
      <TBHeader />
      <main>
        <TBPageHero
          label="Hire an Expert · 聘請專家"
          title="The Right Expert"
          titleYellow="for Every Project."
          sub="Access Hong Kong's top tech talent — vetted app developers, AI consultants, designers, and ERP specialists. No recruitment agency fees."
        />

        {/* How It Works */}
        <section className="tb-section" style={{ background: '#000' }}>
          <div className="tb-container">
            <span className="tb-label">Process · 流程</span>
            <h2 className="tb-h2" style={{ marginBottom: 12 }}>How It Works</h2>
            <div className="tb-gold-bar" />
            <div className="tb-grid-4" style={{ marginTop: 8 }}>
              {HOW_IT_WORKS.map(h => (
                <div key={h.step} style={{ padding: '32px 0' }}>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 48, color: '#1a1a1a', lineHeight: 1, marginBottom: 16 }}>{h.step}</div>
                  <div className="tb-gold-bar" style={{ marginBottom: 16 }} />
                  <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 12 }}>{h.title}</h3>
                  <p style={{ fontSize: 13, color: '#888', lineHeight: 1.8 }}>{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expert Roster */}
        <section className="tb-section" style={{ background: '#0a0a0a', borderTop: '1px solid #111' }}>
          <div className="tb-container">
            <span className="tb-label">Expert Network</span>
            <h2 className="tb-h2" style={{ marginBottom: 12 }}>Our Specialists</h2>
            <div className="tb-gold-bar" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginTop: 8 }}>
              {EXPERTS.map(e => (
                <div key={e.role} className="tb-card">
                  <span className="tb-label">{e.zh}</span>
                  <h3 className="tb-h3" style={{ marginBottom: 20 }}>{e.role}</h3>
                  <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                    {e.skills.map(s => (
                      <li key={s} style={{ background: '#1a1a1a', border: '1px solid #222', color: '#aaa', fontSize: 11, padding: '5px 12px', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, letterSpacing: '0.05em' }}>
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, color: YELLOW, marginBottom: 24 }}>{e.rate}</div>
                  <a href="https://wa.me/85292318254" target="_blank" rel="noreferrer" className="tb-btn-yellow" style={{ fontSize: 12, padding: '11px 22px' }}>
                    Hire This Expert
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="tb-section" style={{ background: '#000', borderTop: '1px solid #111' }}>
          <div className="tb-container">
            <div className="tb-grid-contact">
              <div>
                <span className="tb-label">Submit Your Brief</span>
                <h2 className="tb-h2" style={{ marginBottom: 12 }}>Tell Us What You Need.</h2>
                <div className="tb-gold-bar" />
                <p style={{ fontSize: 15, color: '#888', lineHeight: 1.85 }}>
                  Fill in the form and we&apos;ll connect you with the right expert within 24 hours — completely free, no commitment required.
                </p>
                <div style={{ marginTop: 40 }}>
                  <Image src="/techboss/images/mascot-headset2.jpg" alt="Tech Boss Expert" width={400} height={300} style={{ width: '100%', maxWidth: 360, height: 'auto', objectFit: 'cover' }} />
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
                  <label className="tb-form-label">Expert Type Needed</label>
                  <select className="tb-form-input">
                    <option value="">Select expert type...</option>
                    <option>App Developer</option>
                    <option>AI Consultant</option>
                    <option>UI/UX Designer</option>
                    <option>ERP Specialist</option>
                    <option>Digital Marketer</option>
                    <option>IoT Engineer</option>
                  </select>
                </div>
                <div>
                  <label className="tb-form-label">Budget Range</label>
                  <select className="tb-form-input">
                    <option value="">Select budget...</option>
                    <option>Under HK$10,000</option>
                    <option>HK$10,000 – 30,000</option>
                    <option>HK$30,000 – 100,000</option>
                    <option>Over HK$100,000</option>
                  </select>
                </div>
                <div>
                  <label className="tb-form-label">Project Description</label>
                  <textarea className="tb-form-input" style={{ minHeight: 140, resize: 'vertical' }} placeholder="Describe your project, timeline, and specific requirements..." />
                </div>
                <button type="submit" className="tb-btn-yellow" style={{ width: 'fit-content' }}>
                  Submit Brief →
                </button>
              </form>
            </div>
          </div>
        </section>

        <TBContactStrip />
      </main>
      <TBFooter />
    </>
  );
}
