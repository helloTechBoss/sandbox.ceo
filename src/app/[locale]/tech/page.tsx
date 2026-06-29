export const dynamic = 'force-dynamic';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import InquiryForm from '@/components/InquiryForm';
import { prisma } from '@/lib/prisma';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

export default async function TechPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';

  const waSetting = await prisma.setting.findUnique({ where: { key: 'whatsapp_number' } }).catch(() => null);
  const waNumber = waSetting?.value || '+85292318254';
  const waBase = `https://wa.me/${waNumber.replace(/\D/g, '')}`;
  const waCta = `${waBase}?text=${encodeURIComponent('Hi，我想查詢RegTech合規系統')}`;

  const t = (tc: string, en: string, sc?: string) => isEn ? en : isSc ? (sc ?? tc) : tc;

  const solutions = [
    {
      icon: <AmlIcon />,
      tc: 'AML 合規系統',
      en: 'AML Compliance System',
      descTc: '符合 FATF 及香港海關要求的端對端 AML 系統，涵蓋客戶篩查、交易監控及可疑活動申報',
      descEn: 'End-to-end AML system compliant with FATF and Hong Kong Customs requirements, covering customer screening, transaction monitoring and suspicious activity reporting',
      descSc: '符合 FATF 及香港海关要求的端对端 AML 系统，涵盖客户筛查、交易监控及可疑活动申报',
    },
    {
      icon: <KycIcon />,
      tc: 'eKYC 客戶核實平台',
      en: 'eKYC Platform',
      descTc: '數碼化客戶身份核實，支援護照、身份證及公司文件自動核實，縮短客戶入職時間',
      descEn: 'Digital customer identity verification supporting automatic verification of passports, identity cards and corporate documents, reducing customer onboarding time',
      descSc: '数码化客户身份核实，支持护照、身份证及公司文件自动核实，缩短客户入职时间',
    },
    {
      icon: <SanctionsIcon />,
      tc: '制裁名單篩查',
      en: 'Sanctions Screening',
      descTc: '整合 OFAC、UN、HMT 等全球制裁名單的自動篩查引擎，實時攔截高風險客戶',
      descEn: 'Automated screening engine integrating global sanctions lists including OFAC, UN and HMT, blocking high-risk customers in real time',
      descSc: '整合 OFAC、UN、HMT 等全球制裁名单的自动筛查引擎，实时拦截高风险客户',
    },
    {
      icon: <ReportIcon />,
      tc: '監管報告自動化',
      en: 'Regulatory Reporting',
      descTc: '自動生成符合格式的監管報告，減少人工整理數據的時間及錯誤風險',
      descEn: 'Automatically generate properly formatted regulatory reports, reducing time spent manually compiling data and the risk of errors',
      descSc: '自动生成符合格式的监管报告，减少人工整理数据的时间及错误风险',
    },
  ];

  const statBoxes = [
    {
      num: '30%',
      tc: '監管罰款風險',
      en: 'Regulatory Fine Risk',
      descTc: '人工合規流程錯誤率高達 30%',
      descEn: 'Manual compliance processes have error rates up to 30%',
    },
    {
      num: '50%',
      tc: '效率提升',
      en: 'Efficiency Gain',
      descTc: 'RegTech 系統可將合規成本降低達 50%',
      descEn: 'RegTech systems can reduce compliance costs by up to 50%',
    },
    {
      num: '24/7',
      tc: '審計準備',
      en: 'Audit Ready',
      descTc: '數碼化記錄隨時準備接受監管巡查',
      descEn: 'Digital records ready for regulatory inspection at any time',
    },
  ];

  return (
    <>
      <SiteHeader locale={locale} waNumber={waNumber} />
      <main>
        {/* ── HERO ── */}
        <section style={{ background: '#0F2557', padding: '100px 0 80px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%,rgba(239,68,68,.12) 0%,transparent 55%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 28, height: 2, background: '#C9A84C' }} />
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase' }}>
                {t('監管科技', 'Regulatory Technology', '监管科技')} · REGTECH
              </span>
              <div style={{ width: 28, height: 2, background: '#C9A84C' }} />
            </div>
            <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#fff', letterSpacing: '.04em', marginBottom: 16 }}>
              RegTech {t('解決方案', 'Solutions', '解决方案')}
            </h1>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: 'clamp(.95rem,2vw,1.15rem)', color: '#C9A84C', fontWeight: 600 }}>
              {t('科技驅動合規效率', 'Technology-Driven Compliance Efficiency', '科技驱动合规效率')}
            </p>
          </div>
        </section>

        {/* ── INTRO ── */}
        <section style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', borderLeft: '4px solid #EF4444', paddingLeft: 32 }}>
              <span style={sectionLabel}>{t('關於 RegTech', 'About RegTech', '关于 RegTech')}</span>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '1rem', color: '#334155', lineHeight: 2 }}>
                {t(
                  '在監管科技（RegTech）時代，合規不再只是人力密集的工作。我們為持牌機構提供符合香港監管要求的 AML 系統、KYC 平台及交易監控解決方案，大幅提升合規效率並降低人為錯誤風險。',
                  "In the RegTech era, compliance is no longer purely labour-intensive. We provide AML systems, KYC platforms, and transaction monitoring solutions compliant with Hong Kong regulatory requirements, significantly improving compliance efficiency.",
                  '在监管科技（RegTech）时代，合规不再只是人力密集的工作。我们为持牌机构提供符合香港监管要求的 AML 系统、KYC 平台及交易监控解决方案，大幅提升合规效率并降低人为错误风险。',
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ── SOLUTIONS ── */}
        <section style={{ background: '#F8FAFC', padding: '80px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={sectionLabel}>{t('我們的解決方案', 'Our Solutions', '我们的解决方案')}</span>
              <h2 style={sectionTitle}>{t('四大核心 RegTech 產品', 'Four Core RegTech Products', '四大核心 RegTech 产品')}</h2>
              <div style={{ ...goldBar, margin: '12px auto 36px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 2, background: '#E2E8F0' }}>
              {solutions.map((svc, i) => (
                <div key={i} style={{ background: '#fff', padding: '36px 32px' }}>
                  <div style={{ width: 52, height: 52, color: '#EF4444', marginBottom: 20 }}>{svc.icon}</div>
                  <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F2557', marginBottom: 4, letterSpacing: '.02em' }}>{svc.en}</h3>
                  <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#C9A84C', fontWeight: 600, marginBottom: 14 }}>{svc.tc}</div>
                  <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#64748B', lineHeight: 1.85 }}>
                    {isEn ? svc.descEn : isSc ? svc.descSc : svc.descTc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY REGTECH MATTERS ── */}
        <section style={{ background: '#091A3E', padding: '80px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{ ...sectionLabel, color: '#C9A84C' }}>{t('為何重要', 'Why It Matters', '为何重要')}</span>
              <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#fff', marginBottom: 6 }}>
                {t('RegTech 的商業價值', 'The Business Value of RegTech', 'RegTech 的商业价值')}
              </h2>
              <div style={{ width: 44, height: 3, background: '#C9A84C', margin: '12px auto 36px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {statBoxes.map((box, i) => (
                <div key={i} style={{ background: '#0F2557', padding: '36px 28px', border: '1px solid rgba(255,255,255,.08)' }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '2.8rem', color: '#EF4444', lineHeight: 1, marginBottom: 14 }}>{box.num}</div>
                  <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.95rem', color: '#fff', marginBottom: 4 }}>{box.en}</h3>
                  <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.8rem', color: '#C9A84C', marginBottom: 12 }}>{box.tc}</div>
                  <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.84rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.8 }}>
                    {isEn ? box.descEn : box.descTc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ background: '#EF4444', padding: '60px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: 'clamp(1.2rem,2.5vw,1.7rem)', color: '#fff' }}>
                {t('立即了解 RegTech 解決方案', 'Explore Our RegTech Solutions Today', '立即了解 RegTech 解决方案')}
              </h2>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', color: 'rgba(255,255,255,.8)', marginTop: 6 }}>
                {t('免費諮詢，了解最適合您業務的合規科技方案', 'Free consultation to find the right compliance technology for your business', '免费咨询，了解最适合您业务的合规科技方案')}
              </p>
            </div>
            <a href={waCta} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#fff', color: '#EF4444', padding: '14px 28px',
              fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.95rem',
              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              <WaIcon /> {t('WhatsApp 查詢', 'WhatsApp Enquiry', 'WhatsApp 查询')}
            </a>
          </div>
        </section>

        {/* ── INQUIRY FORM ── */}
        <section style={{ padding: '80px 0', background: '#F8FAFC' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={sectionLabel}>{t('發送查詢', 'Get in Touch', '发送查询')}</span>
              <h2 style={sectionTitle}>{t('查詢 RegTech 方案', 'Enquire About RegTech', '查询 RegTech 方案')}</h2>
              <div style={{ ...goldBar, margin: '12px auto 36px' }} />
            </div>
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              <InquiryForm locale={locale} sourcePage="tech" waNumber={waNumber} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} waNumber={waNumber} />
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

function WaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

function AmlIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
    </svg>
  );
}

function KycIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
    </svg>
  );
}

function SanctionsIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
    </svg>
  );
}
