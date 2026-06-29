export const dynamic = 'force-dynamic';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import InquiryForm from '@/components/InquiryForm';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = await prisma.seoMeta.findFirst({ where: { page: { slug: 'home' } } });
  const lk = locale === 'zh-Hant' ? 'tc' : locale === 'en' ? 'en' : 'sc';
  const title = (seo?.title as Record<string, string>)?.[lk] ?? 'Sandbox Group | 香港企業合規與牌照申請專家';
  const description = (seo?.description as Record<string, string>)?.[lk] ?? '';
  return {
    title,
    description,
    alternates: {
      canonical: 'https://www.sandbox.ceo/',
      languages: {
        'zh-Hant': 'https://www.sandbox.ceo/',
        'en': 'https://www.sandbox.ceo/en',
        'zh-Hans': 'https://www.sandbox.ceo/zh-Hans',
      },
    },
  };
}

async function getSetting(key: string): Promise<string> {
  const s = await prisma.setting.findUnique({ where: { key } });
  return s?.value ?? '';
}

async function getSection(pageSlug: string, key: string, locale: Locale): Promise<string> {
  const lk = locale === 'zh-Hant' ? 'tc' : locale === 'en' ? 'en' : 'sc';
  try {
    const page = await prisma.page.findUnique({ where: { slug: pageSlug }, include: { sections: { where: { key } } } });
    const t = page?.sections[0]?.translations as Record<string, string> | undefined;
    return t?.[lk] ?? '';
  } catch { return ''; }
}

async function getArticles() {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
    take: 3,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const lk = locale === 'zh-Hant' ? 'tc' : locale === 'en' ? 'en' : 'sc';
  const isEn = locale === 'en';
  const [waNumber, articles] = await Promise.all([
    getSetting('whatsapp_number').then(v => v || '+85292318254'),
    getArticles(),
  ]);

  const waBase = `https://wa.me/${waNumber.replace(/\D/g, '')}`;
  const waDefault = `${waBase}?text=${encodeURIComponent('Hi，我想查詢合規及牌照服務')}`;
  const waMso = `${waBase}?text=${encodeURIComponent('Hi 我想查詢MSO新牌照申請')}`;

  return (
    <>
      <SiteHeader locale={locale} waNumber={waNumber} />
      <main>
        {/* ══ HERO ══ */}
        <section style={{ position: 'relative', minHeight: 640, display: 'flex', alignItems: 'center', overflow: 'hidden', backgroundColor: '#0F2557' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg,rgba(9,26,62,.88) 0%,rgba(9,26,62,.75) 55%,rgba(9,26,62,.3) 100%)', zIndex: 1 }} />
          <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '80px 60px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 60, alignItems: 'center' }} className="hero-inner">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 32, height: 2, background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.2em', color: '#E8D28A', textTransform: 'uppercase' }}>
                  {isEn ? 'Hong Kong' : '香港'} · {isEn ? 'Compliance & Licensing Experts' : '合規與牌照申請專家'}
                </span>
              </div>
              <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(2.4rem,5.5vw,4rem)', color: '#fff', letterSpacing: '.04em', lineHeight: 1.05, marginBottom: 14 }}>
                SANDBOX<span style={{ color: '#EF4444' }}>.</span>CEO
              </h1>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: 'clamp(1rem,2vw,1.3rem)', color: '#E8D28A', marginBottom: 10 }}>
                {isEn ? 'Your Compliance & Business Growth Partner' : '您的合規與業務增長夥伴'}
              </p>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.95rem', color: 'rgba(255,255,255,.65)', marginBottom: 32, lineHeight: 1.9, maxWidth: 500 }}>
                {isEn
                  ? 'Led by former compliance officers and MLROs from top financial institutions, delivering institutional-grade compliance, licensing and corporate services efficiently and competitively.'
                  : '由前金融機構合規主管及 MLRO 領導，以機構級合規標準，高效、具競爭力地提供牌照申請、持續合規及企業服務。'}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href={waMso} target="_blank" rel="noopener noreferrer" style={btnRed}>
                  <WaIcon /> {isEn ? 'Free WhatsApp Consult' : '免費 WhatsApp 諮詢'}
                </a>
                <a href="/about" style={btnGhost}>{isEn ? 'About Our Team' : '認識我們的團隊'}</a>
              </div>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.15)', marginTop: 40 }}>
                {[
                  { num: '4', label: isEn ? 'Core Divisions' : '核心業務' },
                  { num: '10+', label: isEn ? 'Years Experience' : '年行業經驗' },
                  { num: 'HK+GBA', label: isEn ? 'Coverage' : '服務範圍' },
                ].map(s => (
                  <div key={s.num} style={{ background: 'rgba(9,26,62,.6)', padding: '18px 16px', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.8rem', color: '#fff', lineHeight: 1 }}>
                      {s.num.includes('+') ? <>{s.num.replace('+', '')}<em style={{ color: '#EF4444', fontStyle: 'normal' }}>+</em></> : s.num}
                    </div>
                    <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.75rem', color: '#94A3B8', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick nav card */}
            <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.15)', padding: '28px 24px', backdropFilter: 'blur(8px)' }} className="hero-card">
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,.15)' }}>
                {isEn ? 'Quick Service Navigator' : '快速服務導航'}
              </div>
              {[
                { href: waMso, label: isEn ? 'MSO Licence Application / Renewal' : 'MSO 牌照申請 / 續期' },
                { href: `${waBase}?text=${encodeURIComponent('Hi，我想查詢SFC牌照申請')}`, label: isEn ? 'SFC Licence Application' : 'SFC 牌照申請' },
                { href: `${waBase}?text=${encodeURIComponent('Hi，我想查詢美國MSB牌照')}`, label: isEn ? 'US MSB / MTL Licence' : '美國 MSB / MTL 牌照' },
                { href: `${waBase}?text=${encodeURIComponent('Hi，我想查詢公司秘書服務')}`, label: isEn ? 'Company Secretary / Corporate' : '公司秘書 / 企業服務' },
                { href: `${waBase}?text=${encodeURIComponent('Hi，我想查詢AML合規系統')}`, label: isEn ? 'AML Compliance System' : 'AML 合規系統' },
              ].map(item => (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', margin: '0 -12px',
                  borderBottom: '1px solid rgba(255,255,255,.07)', textDecoration: 'none', transition: 'background .15s',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                  <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: 'rgba(255,255,255,.8)', lineHeight: 1.5 }}>{item.label}</span>
                </a>
              ))}
              <a href={waDefault} target="_blank" rel="noopener noreferrer" style={{
                display: 'block', marginTop: 20, width: '100%', textAlign: 'center',
                background: '#EF4444', color: '#fff', padding: 12,
                fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.9rem',
                textDecoration: 'none', transition: 'background .2s',
              }}>
                {isEn ? 'Enquire Now →' : '立即查詢 →'}
              </a>
            </div>
          </div>
        </section>

        {/* ══ TICKER ══ */}
        <div style={{ background: '#091A3E', padding: '10px 0', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <div style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', animation: 'ticker-scroll 30s linear infinite' }}>
            {Array(2).fill([
              'MSO 牌照申請', 'SFC 牌照', '美國 MSB / MTL', 'DPMS 登記', 'AML 合規系統',
              '放債人牌照', '公司秘書', '保險中介人牌照', '內控審查', '企業合規顧問',
            ]).flat().map((item, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 32px',
                fontFamily: "'Montserrat',sans-serif", fontSize: '.72rem', fontWeight: 600,
                letterSpacing: '.08em', color: 'rgba(255,255,255,.55)', textTransform: 'uppercase',
              }}>
                <span style={{ color: '#C9A84C', fontSize: '.9rem' }}>◆</span> {item}
              </span>
            ))}
          </div>
        </div>

        {/* ══ TRUST BAR ══ */}
        <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '20px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {[
              isEn ? 'Led by Former Bank Compliance Officers' : '前銀行合規主管領導',
              isEn ? 'Kowloon Bay, Hong Kong Office' : '香港九龍灣辦公室',
              isEn ? '10+ Years Industry Experience' : '10+ 年行業經驗',
            ].map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: '#64748B' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ══ FOUR DIVISIONS ══ */}
        <section style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={sectionLabel}>{isEn ? 'WHAT WE DO' : '我們的業務'}</span>
              <h2 style={sectionTitle}>{isEn ? 'Four Core Divisions' : '四大核心業務'}</h2>
              <div style={goldBar} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, border: '1px solid #E2E8F0' }}>
              {[
                {
                  icon: <LicenceIcon />,
                  num: '01', enTitle: 'MSO & Licensing', zhTitle: 'MSO 牌照',
                  desc: isEn ? 'One-stop MSO licence applications, renewals and AML compliance systems for remittance companies and money changers.' : 'MSO 牌照申請、續期及 AML 合規系統，服務匯款及找換公司。',
                  subs: isEn ? ['New Application', 'Renewal & Transfer', 'AML System'] : ['新牌照申請', '續期及轉讓', 'AML 合規系統'],
                  href: '/mso',
                },
                {
                  icon: <ComplianceIcon />,
                  num: '02', enTitle: 'Compliance', zhTitle: '持續合規',
                  desc: isEn ? 'Outsourced compliance officer, independent AML audit, CPT training and ESG advisory for licensed corporations and MSOs.' : '外判合規主任、獨立 AML 審計、CPT 培訓及 ESG 顧問服務。',
                  subs: isEn ? ['Outsourced Compliance Officer', 'AML Audit', 'CPT Training'] : ['外判合規主任', 'AML 獨立審計', 'CPT 培訓'],
                  href: '/compliance',
                },
                {
                  icon: <CorporateIcon />,
                  num: '03', enTitle: 'Corporate', zhTitle: '企業服務',
                  desc: isEn ? 'Company incorporation, company secretary, accounting, TCSP licence and fund setup for startups and SMEs.' : '公司註冊、公司秘書、會計、TCSP 牌照及基金設立服務。',
                  subs: isEn ? ['Incorporation', 'Company Secretary', 'Accounting & Tax'] : ['公司註冊', '公司秘書', '會計及稅務'],
                  href: '/corporate',
                },
                {
                  icon: <TechIcon />,
                  num: '04', enTitle: 'RegTech', zhTitle: '合規科技',
                  desc: isEn ? 'AML transaction monitoring, KYC/CDD client management and automated STR reports for MSOs.' : 'AML 交易監察、KYC/CDD 客戶管理及 STR 自動報告系統。',
                  subs: isEn ? ['Transaction Monitoring', 'KYC / CDD', 'STR Auto-reports'] : ['交易監察', 'KYC / CDD', 'STR 自動報告'],
                  href: '/tech',
                },
              ].map((div, i) => (
                <a key={i} href={div.href} style={{
                  padding: '36px 28px', borderRight: i < 3 ? '1px solid #E2E8F0' : 'none',
                  borderBottom: '1px solid #E2E8F0', position: 'relative',
                  transition: 'background .2s', cursor: 'pointer', textDecoration: 'none',
                  display: 'block', background: '#fff',
                }}>
                  <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, color: '#EF4444' }}>
                    {div.icon}
                  </div>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '.65rem', letterSpacing: '.15em', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 6 }}>
                    {div.num}
                  </div>
                  <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F2557', letterSpacing: '.02em', marginBottom: 4 }}>
                    {div.enTitle}
                  </h3>
                  <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', color: '#64748B', marginBottom: 12 }}>
                    {div.zhTitle}
                  </div>
                  <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.84rem', color: '#64748B', lineHeight: 1.8, marginBottom: 16 }}>
                    {div.desc}
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
                    {div.subs.map(s => (
                      <li key={s} style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 4, height: 4, background: '#EF4444', borderRadius: '50%', flexShrink: 0, display: 'inline-block' }} />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.78rem', fontWeight: 700, color: '#EF4444', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {isEn ? 'Learn More' : '了解更多'} →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ══ WHY CHOOSE US ══ */}
        <section style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
              <div>
                <span style={sectionLabel}>{isEn ? 'OUR ADVANTAGE' : '我們的優勢'}</span>
                <h2 style={{ ...sectionTitle, marginBottom: 6 }} dangerouslySetInnerHTML={{ __html: isEn ? 'Why Choose<br/>Sandbox Group?' : '為什麼選擇<br/>Sandbox Group？' }} />
                <div style={goldBar} />
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#64748B', lineHeight: 1.95, marginBottom: 16 }}>
                  {isEn
                    ? "In Hong Kong's highly regulated financial environment, compliance is not just a legal obligation — it is the foundation of market trust and sustainable growth. Sandbox Group was founded by former compliance heads at top investment banks and financial institutions."
                    : '在香港高度監管的金融環境中，合規不只是法律義務——更是市場信任與可持續增長的基礎。Sandbox Group 由前投資銀行及金融機構合規主管創立。'}
                </p>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#64748B', lineHeight: 1.95 }}>
                  {isEn
                    ? "We don't sell theory. We deliver results. From document preparation and regulatory liaison to post-approval compliance, we help businesses achieve their goals without compromising on standards."
                    : '我們不賣理論，我們交付結果。從文件準備、監管溝通到批准後合規，我們幫助企業在不妥協標準的前提下實現目標。'}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: '#E2E8F0' }}>
                {[
                  { num: '01', title: isEn ? 'Institutional Background' : '機構背景', desc: isEn ? 'Our team brings real-world experience as compliance officers and MLROs at major financial institutions.' : '團隊成員擁有頂級金融機構合規主管及 MLRO 實戰經驗。' },
                  { num: '02', title: isEn ? 'One-stop Service' : '一站式服務', desc: isEn ? 'Licensing, ongoing compliance, corporate services and technology — all under one roof.' : '牌照、持續合規、企業服務及科技——盡在一處。' },
                  { num: '03', title: isEn ? 'Practical & Efficient' : '務實高效', desc: isEn ? 'Actionable solutions tailored to real business operations, not abstract frameworks.' : '針對實際業務運作提供可執行方案，而非抽象框架。' },
                  { num: '04', title: isEn ? 'Cost-effective' : '具成本效益', desc: isEn ? 'Leveraging compliance technology to deliver above-market standards at competitive fees.' : '借助合規科技以具競爭力的費用提供超越市場水準的服務。' },
                ].map(adv => (
                  <div key={adv.num} style={{ background: '#fff', padding: '28px 24px' }}>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '2rem', color: '#C9A84C', lineHeight: 1, marginBottom: 10 }}>{adv.num}</div>
                    <h4 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.93rem', color: '#0F2557', marginBottom: 8 }}>{adv.title}</h4>
                    <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#64748B', lineHeight: 1.8 }}>{adv.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ SERVICE HIGHLIGHTS ══ */}
        <section style={{ background: '#0F2557', padding: '80px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span style={{ ...sectionLabel, color: '#C9A84C' }}>{isEn ? 'OUR SERVICES' : '我們的服務'}</span>
              <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#fff', marginBottom: 6 }}>
                {isEn ? 'Comprehensive Compliance & Corporate Services' : '全面合規與企業服務'}
              </h2>
              <div style={{ width: 44, height: 3, background: '#C9A84C', margin: '12px auto 36px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, background: 'rgba(255,255,255,.08)', marginTop: 12 }}>
              {[
                { href: '/mso', icon: <LicenceIcon />, en: 'MSO Licensing', zh: 'MSO 牌照', desc: isEn ? 'MSO licence applications, renewals, transfers and AML compliance systems.' : 'MSO 牌照申請、續期、轉讓及 AML 合規系統。' },
                { href: '/licensing', icon: <GlobeIcon />, en: 'Cross-border Licensing', zh: '跨境牌照', desc: isEn ? 'SFC, US MSB/MTL, Canada MSB, DPMS, Insurance Broker and Money Lenders licences.' : 'SFC、美國 MSB/MTL、加拿大 MSB、DPMS、保險中介人及放債人牌照。' },
                { href: '/compliance', icon: <ComplianceIcon />, en: 'Regulatory Compliance', zh: '監管合規', desc: isEn ? 'Ongoing compliance, independent AML audit, CPT training and ESG advisory.' : '持續合規、獨立 AML 審計、CPT 培訓及 ESG 顧問。' },
                { href: '/corporate', icon: <CorporateIcon />, en: 'One-stop Corporate', zh: '一站式企業服務', desc: isEn ? 'Company incorporation, company secretary, accounting, TCSP licence and fund setup.' : '公司註冊、公司秘書、會計、TCSP 牌照及基金設立。' },
                { href: '/tech', icon: <TechIcon />, en: 'Compliance Technology', zh: '合規科技', desc: isEn ? 'AML transaction monitoring, KYC/CDD client management and automated STR reports.' : 'AML 交易監察、KYC/CDD 客戶管理及 STR 自動報告。' },
                { href: '/corporate/hr', icon: <HrIcon />, en: 'HR & Visa', zh: '人才及簽證', desc: isEn ? 'Compliance talent recruitment, executive search and HK work visa applications.' : '合規人才招聘、高管搜尋及香港工作簽證申請。' },
              ].map(svc => (
                <a key={svc.href} href={svc.href} style={{
                  background: '#091A3E', padding: '32px 28px', transition: 'background .2s',
                  cursor: 'pointer', textDecoration: 'none', display: 'block',
                }}>
                  <div style={{ width: 36, height: 36, color: '#C9A84C', marginBottom: 16 }}>{svc.icon}</div>
                  <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.95rem', color: '#fff', marginBottom: 6, letterSpacing: '.02em' }}>{svc.en}</h3>
                  <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.8rem', color: '#C9A84C', marginBottom: 12 }}>{svc.zh}</div>
                  <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.8 }}>{svc.desc}</p>
                  <div style={{ marginTop: 16, fontFamily: "'Montserrat',sans-serif", fontSize: '.75rem', fontWeight: 700, color: '#EF4444', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {isEn ? 'Learn More' : '了解更多'} →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 5-STEP PROCESS ══ */}
        <section style={{ background: '#F8FAFC', padding: '80px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span style={sectionLabel}>{isEn ? 'HOW IT WORKS' : '服務流程'}</span>
              <h2 style={sectionTitle}>{isEn ? '5-Step Application Process' : '五步申請流程'}</h2>
              <div style={{ ...goldBar, margin: '12px auto 36px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 0, position: 'relative', marginTop: 48 }}>
              {[
                { title: isEn ? 'Free Initial Consultation' : '免費初步諮詢', desc: isEn ? 'Contact us by WhatsApp or phone. Our advisors respond same-day.' : '透過 WhatsApp 或電話聯絡我們，顧問當天回覆。' },
                { title: isEn ? 'Due Diligence Assessment' : '盡職審查評估', desc: isEn ? 'We assess eligibility, corporate structure and AML framework.' : '評估申請資格、公司架構及 AML 框架。' },
                { title: isEn ? 'Document Preparation' : '文件準備', desc: isEn ? 'We handle the complete application package — AML manual, business plan, supporting documents.' : '完整申請文件包——AML 手冊、商業計劃書及支援文件。' },
                { title: isEn ? 'Regulatory Follow-up' : '監管跟進', desc: isEn ? 'We liaise with HKCED, SFC and other regulators on your behalf.' : '代表您與 HKCED、SFC 及其他監管機構溝通。' },
                { title: isEn ? 'Post-approval Support' : '批准後支援', desc: isEn ? 'Ongoing compliance, AML audits, annual filings and staff training.' : '持續合規、AML 審計、年度申報及員工培訓。' },
              ].map((step, i) => (
                <div key={i} style={{ position: 'relative', padding: '32px 24px', border: '1px solid #E2E8F0', background: '#fff', marginRight: -1, marginBottom: -1 }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '2.5rem', color: '#E2E8F0', lineHeight: 1, marginBottom: 12 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{ width: 44, height: 44, background: '#0F2557', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h4 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.95rem', color: '#0F2557', marginBottom: 8 }}>{step.title}</h4>
                  <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#64748B', lineHeight: 1.8 }}>{step.desc}</p>
                  {i < 4 && (
                    <div style={{
                      display: 'none', position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)',
                      zIndex: 10, width: 32, height: 32, background: '#EF4444',
                      alignItems: 'center', justifyContent: 'center',
                    }} className="step-arrow">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ INSIGHTS ══ */}
        {articles.length > 0 && (
          <section style={{ padding: '80px 0' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <span style={sectionLabel}>{isEn ? 'LATEST INSIGHTS' : '最新資訊'}</span>
                  <h2 style={sectionTitle}>{isEn ? 'Regulatory Updates & Industry Insights' : '監管動向與行業洞察'}</h2>
                  <div style={goldBar} />
                </div>
                <a href="/insights" style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.8rem', fontWeight: 700, color: '#0F2557', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {isEn ? 'All Insights' : '全部文章'} →
                </a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                {articles.map(art => {
                  const cat = (art.category as Record<string, string>)?.[lk] ?? '';
                  const title = (art.title as Record<string, string>)?.[lk] ?? '';
                  const excerpt = (art.excerpt as Record<string, string>)?.[lk] ?? '';
                  const cta = (art.ctaLabel as Record<string, string>)?.[lk] ?? (isEn ? 'Read More →' : '閱讀更多 →');
                  const waMsg = art.ctaWhatsappMessage ? `${waBase}?text=${encodeURIComponent(art.ctaWhatsappMessage)}` : waDefault;
                  return (
                    <div key={art.id} style={{ border: '1px solid #E2E8F0', background: '#fff', transition: 'box-shadow .2s' }}>
                      <div style={{ padding: '12px 20px 0' }}>
                        <span style={{
                          fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700,
                          letterSpacing: '.12em', textTransform: 'uppercase', color: '#fff',
                          background: art.categoryColor === 'gold' ? '#C9A84C' : art.categoryColor === 'navy' ? '#0F2557' : '#EF4444',
                          padding: '4px 12px', display: 'inline-block',
                        }}>{cat}</span>
                      </div>
                      <div style={{ padding: 20 }}>
                        {art.publishedAt && (
                          <div style={{ fontSize: '.75rem', color: '#94A3B8', marginBottom: 8, fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
                            {new Date(art.publishedAt).toLocaleDateString(locale === 'en' ? 'en-HK' : 'zh-HK', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        )}
                        <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.95rem', color: '#0F2557', marginBottom: 8, lineHeight: 1.5 }}>{title}</h3>
                        <p style={{ fontSize: '.83rem', color: '#64748B', lineHeight: 1.75 }}>{excerpt}</p>
                        <a href={waMsg} target="_blank" rel="noopener noreferrer" style={{ marginTop: 14, fontFamily: "'Montserrat',sans-serif", fontSize: '.75rem', fontWeight: 700, color: '#EF4444', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                          {cta}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ══ CTA BANNER ══ */}
        <section style={{ background: '#EF4444', padding: '60px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: 'clamp(1.2rem,2.5vw,1.7rem)', color: '#fff' }}>
                {isEn ? 'Ready to Drive Your Compliance Growth?' : '準備好推動合規增長了嗎？'}
              </h2>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', color: 'rgba(255,255,255,.8)', marginTop: 6 }}>
                {isEn ? 'Contact us today for a free initial consultation.' : '立即聯絡我們，獲取免費初步諮詢。'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href={waDefault} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#fff', color: '#EF4444', padding: '13px 24px',
                fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', fontWeight: 700,
                textDecoration: 'none', transition: 'opacity .2s',
              }}>
                <WaIcon /> {isEn ? 'WhatsApp Now' : '立即 WhatsApp'}
              </a>
              <a href="/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                border: '2px solid rgba(255,255,255,.6)', color: '#fff', padding: '11px 22px',
                fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', fontWeight: 700,
                textDecoration: 'none', transition: 'all .2s',
              }}>
                {isEn ? 'Contact Information' : '聯絡資料'}
              </a>
            </div>
          </div>
        </section>

        {/* ══ INQUIRY FORM ══ */}
        <section style={{ padding: '80px 0', background: '#F8FAFC' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={sectionLabel}>{isEn ? 'GET IN TOUCH' : '聯絡我們'}</span>
              <h2 style={sectionTitle}>{isEn ? 'Send Us an Enquiry' : '發送查詢'}</h2>
              <div style={{ ...goldBar, margin: '12px auto 36px' }} />
            </div>
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              <InquiryForm locale={locale} sourcePage="home" waNumber={waNumber} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} waNumber={waNumber} />

      <style>{`
        @keyframes ticker-scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @media(max-width:960px){.hero-inner{grid-template-columns:1fr!important;padding:72px 24px!important}}
        @media(max-width:960px){.hero-card{display:none!important}}
        @media(max-width:900px){.divisions-grid div{border-right:none!important}}
      `}</style>
    </>
  );
}

/* ── Shared styles ── */
const sectionLabel: React.CSSProperties = {
  fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700,
  letterSpacing: '.18em', color: '#C9A84C', textTransform: 'uppercase',
  marginBottom: 8, display: 'block',
};
const sectionTitle: React.CSSProperties = {
  fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700,
  fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#0F2557', marginBottom: 6,
};
const goldBar: React.CSSProperties = { width: 44, height: 3, background: '#C9A84C', margin: '12px 0 36px' };
const btnRed: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: '#EF4444', color: '#fff', padding: '13px 24px',
  fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', fontWeight: 700,
  textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .2s',
};
const btnGhost: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  border: '2px solid rgba(255,255,255,.6)', color: '#fff', padding: '11px 22px',
  fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', fontWeight: 700,
  textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all .2s',
};

/* ── Icons ── */
function WaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}
function LicenceIcon() { return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>; }
function ComplianceIcon() { return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>; }
function CorporateIcon() { return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/></svg>; }
function TechIcon() { return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 7.409A2.25 2.25 0 012.25 5.493V5.25"/></svg>; }
function GlobeIcon() { return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3.284 14.253A8.959 8.959 0 013 12c0-1.016.132-2.002.379-2.918"/></svg>; }
function HrIcon() { return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>; }
