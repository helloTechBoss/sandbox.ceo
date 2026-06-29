export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SubTabNav from '@/components/SubTabNav';
import FaqAccordion from '@/components/FaqAccordion';
import { OrgJsonLd, ServiceJsonLd } from '@/components/JsonLd';
import { hreflang, ogImage } from '@/lib/seo';
import InquiryForm from '@/components/InquiryForm';
import { prisma } from '@/lib/prisma';
import { getSeoMeta } from '@/lib/getSeoMeta';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';
  const lk = isEn ? 'en' : isSc ? 'sc' : 'tc';
  const { title, description, keywords } = await getSeoMeta('mso', lk, {
    title: isEn ? 'MSO Licensing' : isSc ? 'MSO牌照服务' : 'MSO牌照服務',
    description: isEn
      ? 'Full-service MSO (Money Service Operator) licensing in Hong Kong — new applications, renewals, transfers and AML compliance systems. Approved by Hong Kong Customs.'
      : isSc
      ? '香港全面MSO（金钱服务经营者）牌照服务，涵盖新牌申请、续期、转让及AML合规系统，由香港海关认可持牌从业员提供。'
      : '香港全面MSO（金錢服務經營者）牌照服務，涵蓋新牌申請、續期、轉讓及AML合規系統，由香港海關認可持牌從業員提供。',
    keywords: ['MSO牌照', '金錢服務經營者', 'MSO申請', 'AML合規系統', '匯款牌照', '海關MSO', 'MSO牌照費用', 'MSO licensing Hong Kong', 'money service operator Hong Kong', 'MSO application', 'AMLO compliance', 'customs MSO licence', 'CSTB MSO'],
  });
  return {
    title,
    description,
    keywords,
    alternates: hreflang('/mso'),
    openGraph: { type: 'website', title, description, url: 'https://www.sandbox.ceo/mso', images: ogImage(title) },
    twitter: { card: 'summary_large_image', title, description },
  };
}

const TABS = [
  { key: 'overview', tc: '服務概覽', en: 'Overview', sc: '服务概览' },
  { key: 'new-application', tc: '新牌申請', en: 'New Application', sc: '新牌申请' },
  { key: 'renewal', tc: '牌照續期', en: 'Renewal', sc: '牌照续期' },
  { key: 'transfer', tc: '牌照轉讓', en: 'Transfer', sc: '牌照转让' },
  { key: 'system', tc: 'AML系統', en: 'AML System', sc: 'AML系统' },
];

const PROCESS_STEPS = {
  'new-application': ['初步評估', '文件準備', '遞交申請', '海關跟進', '牌照獲批'],
  'renewal': ['提前3個月通知', '合規文件更新', '遞交續期申請', '海關審查', '牌照續期完成'],
  'transfer': ['盡職調查', '買賣協議', '海關申請', '批准確認', '牌照正式轉讓'],
  'system': ['需求評估', '系統安裝', '職員培訓', '上線測試', '持續支援'],
};

const CLIENT_TYPES = {
  overview: ['匯款及電匯服務', '貨幣兌換服務', '虛擬資產交易所', '跨境支付公司', '外匯經紀商'],
  'new-application': ['初創匯款公司', '現有業務擴展', '外資進港企業', '科技金融公司'],
  renewal: ['現有MSO持牌人', '牌照到期前3個月', '業務範疇有更改者'],
  transfer: ['收購現有MSO', '業務整合重組', '私募股權退出'],
  system: ['MSO持牌人', '準MSO申請人', '金融機構', '匯款業務公司'],
};

export default async function MsoPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale } = await params;
  const { tab } = await searchParams;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';
  const lk = isEn ? 'en' : isSc ? 'sc' : 'tc';
  const activeTab = TABS.find(t => t.key === tab)?.key ?? 'overview';

  const [waNum, dbFaqs] = await Promise.all([
    prisma.setting.findUnique({ where: { key: 'whatsapp_number' } }).catch(() => null),
    prisma.faq.findMany({ where: { pageSlug: 'mso' }, orderBy: { order: 'asc' } }).catch(() => []),
  ]);
  const waNumber = waNum?.value || '+85292318254';
  const faqItems = dbFaqs.map((f: any) => ({
    question: (f.question as any)[lk] || (f.question as any).tc,
    answer: (f.answer as any)[lk] || (f.answer as any).tc,
  }));
  const waBase = `https://wa.me/${waNumber.replace(/\D/g, '')}`;

  const waMessages: Record<string, string> = {
    overview: 'Hi，我想查詢MSO牌照申請服務',
    'new-application': 'Hi，我想查詢MSO新牌照申請',
    renewal: 'Hi，我想查詢MSO牌照續期服務',
    transfer: 'Hi，我想查詢MSO牌照轉讓服務',
    system: 'Hi，我想查詢AML合規系統',
  };

  const waLink = `${waBase}?text=${encodeURIComponent(waMessages[activeTab])}`;

  const tabs = TABS.map(t => ({ key: t.key, label: lk === 'en' ? t.en : lk === 'sc' ? t.sc : t.tc }));

  return (
    <>
      <OrgJsonLd />
      <ServiceJsonLd
        name={isEn ? 'MSO Licensing' : 'MSO牌照服務'}
        description={isEn ? 'Hong Kong MSO licensing — new applications, renewals, transfers and AML compliance systems.' : 'MSO 牌照申請、續期、轉讓及AML合規系統。'}
        url="/mso"
      />
      <SiteHeader locale={locale} waNumber={waNumber} />
      <main>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(105deg,#091A3E 0%,#0F2557 100%)', padding: '72px 24px 56px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: '#C9A84C' }} />
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.2em', color: '#E8D28A', textTransform: 'uppercase' }}>
                SANDBOX MSO
              </span>
            </div>
            <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
              {isEn ? 'MSO Licensing Services' : isSc ? 'MSO牌照服务' : 'MSO 牌照服務'}
            </h1>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '1.05rem', color: 'rgba(255,255,255,.82)', lineHeight: 1.75, maxWidth: 680, marginBottom: 24 }}>
              {isEn
                ? 'Hong Kong Customs requires all Money Service Operators to hold a valid MSO licence. We provide end-to-end MSO licensing support — new applications, renewals, transfers, and AML compliance systems.'
                : isSc
                ? '香港海关要求所有金钱服务经营者持有有效MSO牌照。我们提供全面MSO牌照支持——新牌申请、续期、转让及AML合规系统。'
                : '香港海關要求所有金錢服務經營者持有有效 MSO 牌照。我們提供全面 MSO 牌照支援——新牌申請、續期、轉讓及 AML 合規系統。'}
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,.15)', border: '1px solid rgba(201,168,76,.4)', padding: '8px 18px' }}>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.75rem', fontWeight: 700, color: '#E8D28A' }}>
                {isEn ? '✓ Customs-licensed practitioners' : isSc ? '✓ 海关认可持牌从业员' : '✓ 海關認可持牌從業員'}
              </span>
            </div>
          </div>
        </section>

        <SubTabNav tabs={tabs} activeTab={activeTab} />

        <style>{`
          .mso-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; }
          .mso-svc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-bottom: 32px; }
          .mso-req-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          @media (max-width: 768px) {
            .mso-layout { grid-template-columns: 1fr; gap: 24px; }
            .mso-svc-grid { grid-template-columns: 1fr; }
            .mso-req-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 80px' }} className="mso-layout">
          {/* Left content */}
          <div>
            {activeTab === 'overview' && <OverviewContent isEn={isEn} isSc={isSc} />}
            {activeTab === 'new-application' && <NewAppContent isEn={isEn} isSc={isSc} />}
            {activeTab === 'renewal' && <RenewalContent isEn={isEn} isSc={isSc} />}
            {activeTab === 'transfer' && <TransferContent isEn={isEn} isSc={isSc} />}
            {activeTab === 'system' && <SystemContent isEn={isEn} isSc={isSc} />}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Client types */}
            <div style={{ border: '1px solid #E2E8F0' }}>
              <div style={{ background: '#0F2557', padding: '14px 20px' }}>
                <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.8rem', color: '#fff', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                  {isEn ? 'Who We Serve' : isSc ? '适用客户' : '適用客戶'}
                </h3>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(CLIENT_TYPES[activeTab as keyof typeof CLIENT_TYPES] ?? CLIENT_TYPES.overview).map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: '#EF4444', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>›</span>
                    <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: '#334155', lineHeight: 1.6 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process bar */}
            {activeTab !== 'overview' && (
              <div style={{ background: '#091A3E', padding: '20px' }}>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 16 }}>
                  {isEn ? 'Process' : isSc ? '申请流程' : '申請流程'}
                </div>
                {(PROCESS_STEPS[activeTab as keyof typeof PROCESS_STEPS] ?? PROCESS_STEPS['new-application']).map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < 4 ? 16 : 0 }}>
                    <div style={{ width: 28, height: 28, background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '.75rem', color: '#fff' }}>{i + 1}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#fff', lineHeight: 1.5 }}>{step}</span>
                      {i < 4 && (
                        <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,.2)', marginLeft: -24, marginTop: 4, display: 'none' }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* WhatsApp CTA */}
            <div style={{ background: '#EF4444', padding: '20px' }}>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, color: '#fff', fontSize: '.9rem', marginBottom: 8 }}>
                {isEn ? 'Free Consultation' : isSc ? '免费初步咨询' : '免費初步諮詢'}
              </div>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.8rem', color: 'rgba(255,255,255,.9)', lineHeight: 1.6, marginBottom: 14 }}>
                {isEn ? 'Contact us on WhatsApp for a no-obligation assessment.' : isSc ? '立即 WhatsApp 我们，获取免费初步评估。' : '立即 WhatsApp 我們，獲取免費初步評估。'}
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#EF4444', padding: '10px 18px', fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.8rem', textDecoration: 'none' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                WhatsApp
              </a>
            </div>

            {/* FAQ */}
            {(activeTab === 'new-application' || activeTab === 'renewal') && (
              <div style={{ border: '1px solid #E2E8F0' }}>
                <div style={{ background: '#F8FAFC', padding: '14px 20px', borderBottom: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.8rem', color: '#0F2557', letterSpacing: '.06em', textTransform: 'uppercase' }}>FAQ</h3>
                </div>
                <FaqAccordion faqs={faqItems.length > 0 ? faqItems : (activeTab === 'new-application' ? FAQ_NEW : FAQ_RENEWAL)} />
              </div>
            )}
          </div>
        </div>

        {/* Inquiry Form */}
        <section style={{ background: '#F8FAFC', padding: '72px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: '#0F2557', marginBottom: 8, textAlign: 'center' }}>
              {isEn ? 'Get a Free Assessment' : isSc ? '获取免费初步评估' : '獲取免費初步評估'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", color: '#64748B', textAlign: 'center', marginBottom: 40 }}>
              {isEn ? 'Tell us about your business and we will advise on the best approach.' : isSc ? '告诉我们您的业务详情，我们将为您提供最佳方案建议。' : '告訴我們您的業務詳情，我們將為您提供最佳方案建議。'}
            </p>
            <InquiryForm locale={locale} sourcePage="mso" waNumber={waNumber} />
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} waNumber={waNumber} />
    </>
  );
}

function SectionIntro({ text }: { text: string }) {
  return (
    <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#334155', lineHeight: 1.85, borderLeft: '3px solid #EF4444', paddingLeft: 16, marginBottom: 32 }}>
      {text}
    </p>
  );
}

function CategoryTitle({ text }: { text: string }) {
  return (
    <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #E2E8F0' }}>
      {text}
    </h2>
  );
}

function SvcItem({ icon, tc, en, desc }: { icon: string; tc: string; en: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '20px 22px', marginBottom: 2 }}>
      <div style={{ width: 40, height: 40, background: '#0F2557', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem' }}>
        {icon}
      </div>
      <div>
        <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, color: '#0F2557', fontSize: '.93rem', marginBottom: 2 }}>{tc}</h3>
        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.72rem', fontWeight: 600, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em' }}>{en}</div>
        <p style={{ fontSize: '.83rem', color: '#64748B', lineHeight: 1.75 }}>{desc}</p>
      </div>
    </div>
  );
}

function ReqBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ border: '1px solid #E2E8F0', marginBottom: 8 }}>
      <div style={{ background: '#0F2557', padding: '10px 16px' }}>
        <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.82rem', color: '#fff' }}>{title}</span>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(i => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ color: '#C9A84C', flexShrink: 0, marginTop: 2 }}>✓</span>
            <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#334155', lineHeight: 1.6 }}>{i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverviewContent({ isEn, isSc }: { isEn: boolean; isSc: boolean }) {
  return (
    <div>
      <SectionIntro text={
        isEn
          ? 'Money Service Operator (MSO) licences are issued by Hong Kong Customs. Operators providing money changing or remittance services must be licensed. Sandbox Group offers a one-stop MSO licensing solution covering new applications, renewals, transfers, and AML compliance systems.'
          : isSc
          ? '金钱服务经营者(MSO)牌照由香港海关签发。提供货币兑换或汇款服务的经营者须持牌经营。Sandbox Group提供一站式MSO牌照解决方案，涵盖新牌申请、续期、转让及AML合规系统。'
          : '金錢服務經營者（MSO）牌照由香港海關簽發。提供貨幣兌換或匯款服務的經營者須持牌經營。Sandbox Group 提供一站式 MSO 牌照解決方案，涵蓋新牌申請、續期、轉讓及 AML 合規系統。'
      } />
      <CategoryTitle text={isEn ? 'Our MSO Services' : isSc ? '我们的MSO服务' : '我們的MSO服務'} />
      <div className="mso-svc-grid">
        {[
          { icon: '📋', tc: '新牌照申請', en: 'New Application', desc: '全程代辦海關申請，包括文件整理、AML/CFT政策撰寫及提交。' },
          { icon: '🔄', tc: '牌照續期', en: 'Licence Renewal', desc: '確保準時完成續期，避免業務中斷及合規風險。' },
          { icon: '🔀', tc: '牌照轉讓', en: 'Licence Transfer', desc: '協助買賣雙方完成盡職調查及海關轉讓申請程序。' },
          { icon: '🛡️', tc: 'AML合規系統', en: 'AML System', desc: '提供符合FATF及香港海關要求的AML軟件及KYC系統。' },
        ].map(s => (
          <div key={s.en} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '20px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>{s.icon}</div>
            <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, color: '#0F2557', fontSize: '.9rem', marginBottom: 6 }}>{s.tc}</h3>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>{s.en}</div>
            <p style={{ fontSize: '.82rem', color: '#64748B', lineHeight: 1.7 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewAppContent({ isEn, isSc }: { isEn: boolean; isSc: boolean }) {
  return (
    <div>
      <SectionIntro text={
        isEn
          ? 'A new MSO licence application involves submitting Form 1 to Hong Kong Customs, along with detailed AML/CFT policies, business plans, and fit-and-proper assessments of key personnel. Our team has managed hundreds of successful submissions.'
          : isSc
          ? '新MSO牌照申请涉及向香港海关提交表格1，以及详细的AML/CFT政策、业务计划及关键人员的适当人选评估。我们的团队已成功处理数百份申请。'
          : '新 MSO 牌照申請涉及向香港海關提交表格 1，連同詳細的 AML/CFT 政策、業務計劃及關鍵人員的適當人選評估。我們的團隊已成功處理數百份申請。'
      } />
      <CategoryTitle text={isEn ? 'Services Included' : isSc ? '服务范畴' : '服務範疇'} />
      <SvcItem icon="📄" tc="申請文件準備" en="Document Preparation" desc="全套申請文件整理，包括公司架構圖、業務流程、股東資料及董事履歷。" />
      <SvcItem icon="🔒" tc="AML/CFT政策撰寫" en="AML/CFT Policy" desc="撰寫符合海關要求的反洗錢及反恐融資政策，涵蓋KYC、交易監控及可疑交易申報。" />
      <SvcItem icon="👤" tc="關鍵人員評估" en="Fit & Proper Assessment" desc="協助董事及負責人員準備海關問卷，確保符合適當人選標準。" />
      <SvcItem icon="📊" tc="業務計劃書撰寫" en="Business Plan" desc="撰寫清晰的業務計劃書，說明目標客戶、服務地區、費率結構及風險管控框架。" />
      <SvcItem icon="📋" tc="海關跟進溝通" en="Customs Liaison" desc="全程代表申請人與海關溝通，跟進審批進度，即時回應補充文件要求。" />

      <div style={{ marginTop: 32 }}>
        <CategoryTitle text={isEn ? 'Key Requirements' : isSc ? '主要申请要求' : '主要申請要求'} />
        <div className="mso-req-grid">
          <ReqBox title="公司要求" items={['香港註冊有限公司', '在港有實際業務地址', '至少一名在港董事', '最低實繳股本 HK$500,000']} />
          <ReqBox title="人員要求" items={['合規主任 (MLRO)', '負責人通過適當人選評核', '相關業務經驗', '無刑事定罪記錄']} />
          <ReqBox title="系統要求" items={['AML/KYC系統', '交易監控系統', '制裁名單篩查', '可疑交易申報機制']} />
          <ReqBox title="政策文件" items={['AML/CFT政策手冊', '客戶盡職審查程序', '交易記錄保存政策', '員工培訓計劃']} />
        </div>
      </div>
    </div>
  );
}

function RenewalContent({ isEn, isSc }: { isEn: boolean; isSc: boolean }) {
  return (
    <div>
      <SectionIntro text={
        isEn
          ? 'MSO licences must be renewed annually. Hong Kong Customs requires renewal applications to be submitted at least 3 months before the expiry date. Failure to renew on time may result in licence suspension or revocation. We manage the entire renewal process on your behalf.'
          : isSc
          ? 'MSO牌照须每年续期。香港海关要求至少在到期日前3个月提交续期申请。未能按时续期可能导致牌照被暂停或撤销。我们全程代办续期手续。'
          : 'MSO 牌照須每年續期。香港海關要求至少在到期日前 3 個月提交續期申請。未能按時續期可能導致牌照被暫停或撤銷。我們全程代辦續期手續。'
      } />
      <CategoryTitle text={isEn ? 'Renewal Services' : isSc ? '续期服务' : '續期服務'} />
      <SvcItem icon="🗓️" tc="提前3個月提醒" en="Advance Reminder" desc="我們主動追蹤您的牌照到期日，提前提醒並啟動續期流程，確保不會錯過截止日期。" />
      <SvcItem icon="📋" tc="合規文件更新" en="Compliance Update" desc="審查並更新 AML/CFT 政策、風險評估及客戶盡職審查程序，確保符合最新監管要求。" />
      <SvcItem icon="📝" tc="續期申請表格填寫" en="Renewal Application" desc="準備及遞交海關要求的所有續期文件及表格，並跟進審批進度。" />
      <SvcItem icon="🔄" tc="業務變更更新" en="Business Change Update" desc="如牌照期間有業務變更（如地址、服務類型、董事變動），一併更新相關申請。" />
    </div>
  );
}

function TransferContent({ isEn, isSc }: { isEn: boolean; isSc: boolean }) {
  return (
    <div>
      <SectionIntro text={
        isEn
          ? 'Acquiring an existing MSO licence can be faster than a new application. However, the transfer process requires due diligence on the target company and approval from Hong Kong Customs. We advise both buyers and sellers throughout the process.'
          : isSc
          ? '收购现有MSO牌照可能比申请新牌更快。然而，转让过程需要对目标公司进行尽职调查，并获得香港海关批准。我们为买卖双方提供全程顾问服务。'
          : '收購現有 MSO 牌照可能比申請新牌更快。然而，轉讓過程需要對目標公司進行盡職調查，並獲得香港海關批准。我們為買賣雙方提供全程顧問服務。'
      } />
      <CategoryTitle text={isEn ? 'Transfer Services' : isSc ? '转让服务' : '轉讓服務'} />
      <SvcItem icon="🔍" tc="目標公司盡職調查" en="Due Diligence" desc="審查目標MSO的合規記錄、監管狀況、業務歷史及潛在風險，保護買方利益。" />
      <SvcItem icon="📜" tc="買賣協議草擬" en="SPA Drafting" desc="協調法律團隊草擬股份買賣協議，確保牌照轉讓條款清晰，保障雙方權益。" />
      <SvcItem icon="📋" tc="海關轉讓申請" en="Customs Application" desc="向香港海關遞交轉讓申請，協助新東主完成適當人選評核及合規文件更新。" />
      <SvcItem icon="🔄" tc="轉讓後合規重整" en="Post-transfer Compliance" desc="牌照轉讓後，協助新東主更新 AML 政策、更換 MLRO 及重新進行員工 AML 培訓。" />
    </div>
  );
}

function SystemContent({ isEn, isSc }: { isEn: boolean; isSc: boolean }) {
  return (
    <div>
      <SectionIntro text={
        isEn
          ? 'A robust AML system is no longer optional — it is a legal requirement for MSO licensees. Hong Kong Customs expects licensees to have documented, technology-supported AML frameworks covering KYC, transaction monitoring, and sanctions screening.'
          : isSc
          ? '强健的AML系统不再是可选项——这是MSO持牌人的法律要求。香港海关期望持牌人拥有有文件记录的、技术支持的AML框架，涵盖KYC、交易监控和制裁筛查。'
          : '健全的 AML 系統不再是可選項——這是 MSO 持牌人的法律要求。香港海關期望持牌人擁有有文件記錄的、技術支持的 AML 框架，涵蓋 KYC、交易監控和制裁篩查。'
      } />
      <CategoryTitle text={isEn ? 'AML System Services' : isSc ? 'AML系统服务' : 'AML系統服務'} />
      <SvcItem icon="🛡️" tc="AML合規系統部署" en="AML System Deployment" desc="提供適合MSO規模的AML系統，涵蓋客戶身份核實（eKYC）、交易監控及可疑活動申報功能。" />
      <SvcItem icon="🔍" tc="制裁名單篩查" en="Sanctions Screening" desc="整合全球制裁名單（OFAC, UN, HKMA）的自動篩查功能，實時過濾高風險客戶及交易。" />
      <SvcItem icon="📊" tc="交易監控規則設定" en="Transaction Monitoring" desc="根據您的業務風險狀況，設定交易監控觸發規則，平衡合規要求與業務效率。" />
      <SvcItem icon="📚" tc="員工AML培訓" en="Staff Training" desc="提供符合香港海關要求的AML培訓，包括課堂、線上及測試，並保存培訓記錄備查。" />
    </div>
  );
}

const FAQ_NEW = [
  { question: '申請 MSO 新牌需時多久？', answer: '一般約 3–6 個月。視乎申請文件是否齊備及海關審批速度而定。準備充分的申請通常較快獲批。' },
  { question: '申請期間可以開始營業嗎？', answer: '不可以。在海關批准前從事貨幣兌換或匯款業務屬違法行為，可被檢控及罰款。' },
  { question: '最低股本要求是多少？', answer: '根據《打擊洗錢及恐怖分子資金籌集條例》，申請 MSO 牌照須有最低實繳股本 HK$500,000。' },
  { question: '如果申請被拒，可以重新申請嗎？', answer: '可以。被拒後可在補足文件或更改業務安排後重新申請，但需重新繳交申請費。' },
];

const FAQ_RENEWAL = [
  { question: 'MSO 牌照何時須要續期？', answer: 'MSO 牌照有效期為一年，須於到期前最少 3 個月提交續期申請，建議提前 4 個月開始準備。' },
  { question: '續期時需要提交哪些文件？', answer: '主要包括：最新的 AML/CFT 政策文件、年度風險評估報告、業務情況聲明及繳費。' },
  { question: '牌照過期後仍可申請續期嗎？', answer: '不可以。牌照到期後即告失效，繼續營業屬違法。屆時須重新申請新牌，對業務影響較大。' },
];
