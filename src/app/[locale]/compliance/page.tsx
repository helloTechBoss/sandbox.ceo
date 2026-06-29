export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SubTabNav from '@/components/SubTabNav';
import FaqAccordion from '@/components/FaqAccordion';
import { OrgJsonLd, ServiceJsonLd, BreadcrumbJsonLd, FaqPageJsonLd } from '@/components/JsonLd';
import { hreflang, ogImage } from '@/lib/seo';
import InquiryForm from '@/components/InquiryForm';
import { prisma } from '@/lib/prisma';
import { getSeoMeta } from '@/lib/getSeoMeta';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';
const localePath = (locale: Locale, path: string) => locale === 'zh-Hant' ? path : `/${locale}${path}`;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';
  const lk = isEn ? 'en' : isSc ? 'sc' : 'tc';
  const { title, description, keywords } = await getSeoMeta('compliance', lk, {
    title: isEn ? 'Outsourced Compliance Officer & AML Audit Hong Kong' : isSc ? '外判合规主任及AML审计香港' : '外判合規主任及AML審計香港',
    description: isEn
      ? 'Outsourced MLRO and compliance officer, AML independent audit, CPT staff training and ESG advisory for MSOs, SFC-licensed firms and banks in Hong Kong.'
      : isSc
      ? '为香港MSO、SFC持牌机构及银行提供外判MLRO及合规主任、AML独立审计、CPT员工培训及ESG顾问服务。'
      : '為香港MSO、SFC持牌機構及銀行提供外判MLRO及合規主任、AML獨立審計、CPT員工培訓及ESG顧問服務。',
    keywords: ['AML合規', '持續合規', '外判合規', 'MLRO', 'ESG顧問', 'CPT培訓', 'AML獨立審計', '外判合規主任', 'AML compliance Hong Kong', 'outsourced compliance officer Hong Kong', 'MLRO services', 'AML audit', 'CPT training Hong Kong', 'ESG compliance'],
  });
  return {
    title,
    description,
    keywords,
    alternates: hreflang('/compliance'),
    openGraph: { type: 'website', title, description, url: 'https://www.sandbox.ceo/compliance', images: ogImage(title) },
    twitter: { card: 'summary_large_image', title, description },
  };
}

const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const docIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);

function SvcItem({ title, enSub, desc }: { title: string; enSub: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '20px 22px', marginBottom: 2 }}>
      <div style={{ width: 40, height: 40, background: '#0F2557', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {docIcon}
      </div>
      <div>
        <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, color: '#0F2557', fontSize: '.93rem', marginBottom: 2 }}>{title}</h3>
        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.72rem', fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>{enSub}</div>
        <p style={{ fontSize: '.83rem', color: '#64748B', lineHeight: 1.75 }}>{desc}</p>
      </div>
    </div>
  );
}

function ProcessBar({ steps, locale }: { steps: string[]; locale: Locale }) {
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';
  return (
    <div style={{ background: '#091A3E', padding: 24, marginBottom: 16 }}>
      <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.18em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 16 }}>
        {isEn ? 'PROCESS' : isSc ? '流程' : '流程'}
      </div>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < steps.length - 1 ? 16 : 0 }}>
          <div style={{ width: 24, height: 24, background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, color: '#fff' }}>{i + 1}</div>
          <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.6, paddingTop: 3 }}>{step}</div>
        </div>
      ))}
    </div>
  );
}

function ClientTypeBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ border: '1px solid #E2E8F0', marginBottom: 16 }}>
      <div style={{ background: '#0F2557', padding: '12px 16px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>{title}</div>
      <div style={{ padding: '12px 16px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < items.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
            <span style={{ color: '#EF4444', fontWeight: 700 }}>›</span>
            <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: '#334155' }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WaCta({ href, label }: { href: string; label: string }) {
  return (
    <div style={{ background: '#EF4444', padding: 20, marginBottom: 16 }}>
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', color: '#EF4444', padding: '12px 16px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', textDecoration: 'none' }}>
        {WA_ICON}
        {label}
      </a>
    </div>
  );
}

function OverviewCard({ title, enTitle, desc, tab, locale }: { title: string; enTitle: string; desc: string; tab: string; locale: Locale }) {
  return (
    <a href={`?tab=${tab}`} style={{ display: 'block', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: 24, textDecoration: 'none', borderTop: '3px solid #0F2557' }}>
      <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 8 }}>{enTitle}</div>
      <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#64748B', lineHeight: 1.7 }}>{desc}</p>
      <div style={{ marginTop: 12, fontFamily: "'Montserrat',sans-serif", fontSize: '.75rem', fontWeight: 700, color: '#EF4444' }}>
        {locale === 'en' ? 'Learn More →' : '了解更多 →'}
      </div>
    </a>
  );
}

export default async function CompliancePage({
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
  const activeTab = tab ?? 'overview';

  const lk = isEn ? 'en' : isSc ? 'sc' : 'tc';
  const [waNum, dbFaqs] = await Promise.all([
    prisma.setting.findUnique({ where: { key: 'whatsapp_number' } }).catch(() => null),
    prisma.faq.findMany({ where: { pageSlug: 'compliance' }, orderBy: [{ subTab: 'asc' }, { order: 'asc' }] }).catch(() => []),
  ]);
  const waNumber = waNum?.value || '+85292318254';
  const waHref = `https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi，我想查詢合規服務')}`;
  const faqsBySubTab: Record<string, { question: string; answer: string }[]> = {};
  for (const f of dbFaqs as any[]) {
    const st = f.subTab || 'overview';
    if (!faqsBySubTab[st]) faqsBySubTab[st] = [];
    faqsBySubTab[st].push({ question: f.question[lk] || f.question.tc, answer: f.answer[lk] || f.answer.tc });
  }

  const tabs = [
    { key: 'overview', label: isEn ? 'Overview' : isSc ? '概览' : '概覽' },
    { key: 'ongoing', label: isEn ? 'Ongoing Compliance' : isSc ? '持续合规' : '持續合規' },
    { key: 'audit', label: isEn ? 'AML Audit' : isSc ? 'AML审计' : 'AML 審計' },
    { key: 'training', label: isEn ? 'Training & ESG' : isSc ? '培训及ESG' : '培訓及ESG' },
  ];

  return (
    <>
      <OrgJsonLd />
      <ServiceJsonLd
        name={isEn ? 'Outsourced Compliance Officer & AML Audit Hong Kong' : '外判合規主任及AML審計香港'}
        description={isEn ? 'Outsourced compliance officer, AML audits, training and ESG advisory for Hong Kong licensed institutions.' : '外判合規主任、AML審計、培訓及ESG顧問服務。'}
        url="/compliance"
      />
      <BreadcrumbJsonLd items={[
        { name: isEn ? 'Home' : '主頁', item: 'https://www.sandbox.ceo' },
        { name: isEn ? 'AML & Ongoing Compliance' : isSc ? 'AML及持续合规' : 'AML及持續合規', item: 'https://www.sandbox.ceo/compliance' },
      ]} />
      {Object.values(faqsBySubTab).flat().length > 0 && (
        <FaqPageJsonLd faqs={Object.values(faqsBySubTab).flat()} />
      )}
      <SiteHeader locale={locale} waNumber={waNumber} />
      <main>
        <div className="comp-hero" style={{ background: '#0F2557', padding: '56px 0', position: 'relative', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1507941097613-9f2157b69235?w=1600&q=80" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%', zIndex: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg,rgba(9,26,62,.95) 0%,rgba(9,26,62,.88) 55%,rgba(9,26,62,.5) 100%)', zIndex: 1 }} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 10 }}>
              SANDBOX COMPLIANCE
            </p>
            <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff', letterSpacing: '.02em', marginBottom: 8 }}>
              {isEn ? 'Ongoing Compliance Services' : isSc ? '持续合规服务' : '持續合規服務'}
            </h1>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '1rem', color: '#C9A84C', fontWeight: 700, marginBottom: 10 }}>
              {isEn ? 'Institutional-Grade Compliance Support' : isSc ? '机构级别合规支援' : '機構級別合規支援'}
            </p>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: 'rgba(255,255,255,.6)', maxWidth: 560, lineHeight: 1.85 }}>
              {isEn
                ? 'In an increasingly regulated environment, ongoing compliance is as important as obtaining a licence. Any compliance lapse may result in licence revocation or heavy penalties. We provide comprehensive ongoing compliance support so you can focus on business growth.'
                : isSc
                ? '在监管日趋严格的环境下，持续合规与取得牌照同样重要。任何合规缺失均可能导致牌照被撤销或重罚。我们提供全面的持续合规支援，让您专注业务增长。'
                : '在監管日趨嚴格的環境下，持續合規與取得牌照同樣重要。任何合規缺失均可能導致牌照被撤銷或重罰。我們提供全面的持續合規支援，讓您專注業務增長。'}
            </p>
          </div>
        </div>

        <SubTabNav tabs={tabs} activeTab={activeTab} />

        {activeTab === 'overview' && (
          <div className="comp-overview-wrapper" style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
            <div style={{ borderLeft: '3px solid #EF4444', paddingLeft: 16, marginBottom: 40 }}>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#334155', lineHeight: 1.85 }}>
                {isEn
                  ? 'In an increasingly regulated environment, ongoing compliance is as important as obtaining a licence. Any compliance lapse may result in licence revocation or heavy penalties. We provide comprehensive ongoing compliance support so you can focus on business growth.'
                  : isSc
                  ? '在监管日趋严格的环境下，持续合规与取得牌照同样重要。任何合规缺失均可能导致牌照被撤销或重罚。我们提供全面的持续合规支援，让您专注业务增长。'
                  : '在監管日趨嚴格的環境下，持續合規與取得牌照同樣重要。任何合規缺失均可能導致牌照被撤銷或重罰。我們提供全面的持續合規支援，讓您專注業務增長。'}
              </p>
            </div>
            <div className="comp-overview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 40 }}>
              <OverviewCard
                tab="ongoing"
                locale={locale}
                enTitle="ONGOING COMPLIANCE"
                title={isEn ? 'Outsourced Compliance Officer' : isSc ? '外判合规主任' : '外判合規主任'}
                desc={isEn ? 'Institutional-grade compliance support for small to mid-size licensed firms without the cost of a full-time hire.' : isSc ? '为中小型持牌机构提供机构级别合规支援，无需聘用全职合规人员。' : '為中小型持牌機構提供機構級別合規支援，無需聘用全職合規人員。'}
              />
              <OverviewCard
                tab="audit"
                locale={locale}
                enTitle="AML AUDIT"
                title={isEn ? 'Independent AML Audit' : isSc ? '独立AML审计' : '獨立 AML 審計'}
                desc={isEn ? 'Proactively identify and remediate AML compliance gaps before regulatory inspections.' : isSc ? '在监管机构巡查前主动识别及补救AML合规缺失。' : '在監管機構巡查前主動識別及補救 AML 合規缺失。'}
              />
              <OverviewCard
                tab="training"
                locale={locale}
                enTitle="TRAINING & ESG"
                title={isEn ? 'CPT & ESG Advisory' : isSc ? 'CPT及ESG顾问' : 'CPT 及 ESG 顧問'}
                desc={isEn ? 'Mandatory continuing professional training and ESG compliance advisory for licensed firms.' : isSc ? '持牌机构的强制持续专业培训及ESG合规顾问服务。' : '持牌機構的強制持續專業培訓及 ESG 合規顧問服務。'}
              />
            </div>
            <div style={{ border: '1px solid #E2E8F0' }}>
              <div style={{ background: '#0F2557', padding: '12px 20px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#fff' }}>
                {isEn ? 'Client Types We Serve' : isSc ? '服务客户类型' : '服務客戶類型'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                {['SFC 持牌法團', 'MSO 持牌人', '保險中介公司', '放債人持牌人', '虛擬資產服務商'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRight: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ color: '#EF4444', fontWeight: 700 }}>›</span>
                    <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: '#334155' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ongoing' && (
          <div className="comp-tab-content">
            <div>
              <div style={{ borderLeft: '3px solid #EF4444', paddingLeft: 16, marginBottom: 32 }}>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#334155', lineHeight: 1.85 }}>
                  {isEn
                    ? 'Outsourced compliance officer services allow small to mid-size licensed institutions to access institutional-grade professional compliance support without hiring full-time compliance staff. Our team has hands-on experience from top financial institutions and investment banks.'
                    : isSc
                    ? '外判合规主任服务让中小型持牌机构能够获得机构级别的专业合规支援，而无需聘用全职合规人员。我们的团队均拥有顶级金融机构及投资银行的实战经验。'
                    : '外判合規主任服務讓中小型持牌機構能夠獲得機構級別的專業合規支援，而無需聘用全職合規人員。我們的團隊均擁有頂級金融機構及投資銀行的實戰經驗。'}
                </p>
              </div>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#C9A84C', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                {isEn ? 'COMPLIANCE SERVICES' : isSc ? '合规服务' : '合規服務'}
              </div>
              <SvcItem
                title={isEn ? 'Licensed Corporation Ongoing Compliance' : isSc ? '持牌法团持续合规服务' : '持牌法團持續合規服務'}
                enSub="Licensed Corporation Compliance (SFC)"
                desc={isEn ? 'Monthly compliance support for SFC-licensed corporations including AML/CFT monitoring, regulatory filings, and policy maintenance. Monthly fee quotation available.' : isSc ? '为SFC持牌法团提供月度合规支援，包括AML/CFT监控、监管申报及政策维护。月费报价。' : '為 SFC 持牌法團提供月度合規支援，包括 AML/CFT 監控、監管申報及政策維護。月費報價。'}
              />
              <SvcItem
                title={isEn ? 'MSO Compliance Support' : isSc ? 'MSO 合规支援服务' : 'MSO 合規支援服務'}
                enSub="MSO Compliance Support"
                desc={isEn ? 'Comprehensive compliance support for Money Service Operators including transaction monitoring, STR filing, and HKMA reporting. Monthly fee quotation available.' : isSc ? '为货币服务经营者提供全面合规支援，包括交易监控、可疑交易报告及金管局申报。月费报价。' : '為貨幣服務經營者提供全面合規支援，包括交易監控、可疑交易報告及金管局申報。月費報價。'}
              />
              <SvcItem
                title={isEn ? 'Insurance Intermediary Compliance' : isSc ? '保险中介人合规服务' : '保險中介人合規服務'}
                enSub="Insurance Intermediary Compliance (IA)"
                desc={isEn ? 'Ongoing compliance services for insurance agents and brokers regulated by the Insurance Authority, including CPD tracking and policy reviews. Monthly fee quotation available.' : isSc ? '为保险监管局监管下保险代理人及经纪提供持续合规服务，包括CPD追踪及政策审查。月费报价。' : '為保險監管局監管下保險代理人及經紀提供持續合規服務，包括 CPD 追踪及政策審查。月費報價。'}
              />
            </div>
            <div>
              <ClientTypeBox
                title={isEn ? 'Who We Serve' : isSc ? '服务对象' : '服務對象'}
                items={
                  isEn
                    ? ['SFC Licensed Corporations', 'MSO Licence Holders', 'Insurance Intermediaries', 'Money Lenders', 'Virtual Asset Service Providers']
                    : ['SFC 持牌法團', 'MSO 持牌人', '保險中介公司', '放債人持牌人', '虛擬資產服務商']
                }
              />
              <ProcessBar
                locale={locale}
                steps={
                  isEn
                    ? ['Initial Assessment', 'Compliance Plan', 'Monthly Execution', 'Regular Reporting', 'Annual Review']
                    : isSc
                    ? ['初步评估', '制定合规计划', '月度执行', '定期汇报', '年度审查']
                    : ['初步評估', '制定合規計劃', '月度執行', '定期匯報', '年度審查']
                }
              />
              <WaCta href={waHref} label={isEn ? 'WhatsApp Us – Compliance' : isSc ? '立即 WhatsApp 查询合规服务' : '立即 WhatsApp 查詢合規服務'} />
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="comp-tab-content">
            <div>
              <div style={{ borderLeft: '3px solid #EF4444', paddingLeft: 16, marginBottom: 32 }}>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#334155', lineHeight: 1.85 }}>
                  {isEn
                    ? 'Regulatory inspections are becoming more frequent, with AML framework effectiveness as a key focus. Regular independent AML audits help identify and remediate gaps before regulatory visits, protecting your licence.'
                    : isSc
                    ? '监管机构实地巡查愈来愈频繁，AML框架是否有效是重点核查范畴。定期独立AML审计有助在监管机构到访前识别及补救缺失，保护您的牌照。'
                    : '監管機構實地巡查愈來愈頻繁，AML 框架是否有效是重點核查範疇。定期獨立 AML 審計有助在監管機構到訪前識別及補救缺失，保護您的牌照。'}
                </p>
              </div>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#C9A84C', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                {isEn ? 'AUDIT SERVICES' : isSc ? '审计服务' : '審計服務'}
              </div>
              <SvcItem
                title={isEn ? 'Independent AML Audit' : isSc ? '独立 AML 审计' : '獨立 AML 審計'}
                enSub="Independent AML Audit"
                desc={isEn ? 'Comprehensive review of your AML/CFT framework against current regulatory requirements, with a detailed findings and remediation report.' : isSc ? '针对现行监管要求，全面审查您的AML/CFT框架，并提供详细的发现及补救报告。' : '針對現行監管要求，全面審查您的 AML/CFT 框架，並提供詳細的發現及補救報告。'}
              />
              <SvcItem
                title={isEn ? 'Internal Controls Review' : isSc ? '内部控制审查' : '內部控制審查'}
                enSub="Internal Controls Review"
                desc={isEn ? 'Assessment of internal control effectiveness covering transaction monitoring, client onboarding, and risk management procedures.' : isSc ? '评估内部控制有效性，涵盖交易监控、客户入职及风险管理程序。' : '評估內部控制有效性，涵蓋交易監控、客戶入職及風險管理程序。'}
              />
              <SvcItem
                title={isEn ? 'Compliance Document Customisation' : isSc ? '合规文件定制' : '合規文件定制'}
                enSub="Compliance Documentation"
                desc={isEn ? 'Customised AML/CFT policies, procedures, and compliance manuals tailored to your business model and regulatory obligations.' : isSc ? '根据您的业务模式及监管义务，定制AML/CFT政策、程序及合规手册。' : '根據您的業務模式及監管義務，定制 AML/CFT 政策、程序及合規手冊。'}
              />
              <SvcItem
                title={isEn ? 'Regulatory Inspection Support' : isSc ? '监管实地巡查支援' : '監管實地巡查支援'}
                enSub="Regulatory Inspection Support"
                desc={isEn ? 'On-site and remote support during regulatory inspections, including document preparation, Q&A coaching, and post-inspection remediation.' : isSc ? '监管巡查期间的现场及远程支援，包括文件准备、问答辅导及巡查后补救。' : '監管巡查期間的現場及遠程支援，包括文件準備、問答輔導及巡查後補救。'}
              />
            </div>
            <div>
              <ClientTypeBox
                title={isEn ? 'Audit Focus Areas' : isSc ? '审计重点范畴' : '審計重點範疇'}
                items={
                  isEn
                    ? ['AML/CFT Framework', 'Transaction Monitoring', 'Customer Due Diligence', 'Sanctions Screening', 'STR Filing']
                    : ['AML/CFT 框架', '交易監控系統', '客戶盡職調查', '制裁篩查', '可疑交易報告']
                }
              />
              <ProcessBar
                locale={locale}
                steps={
                  isEn
                    ? ['Scope Definition', 'Document Review', 'On-site Testing', 'Findings Report', 'Remediation Plan']
                    : isSc
                    ? ['范围界定', '文件审阅', '现场测试', '发现报告', '补救计划']
                    : ['範圍界定', '文件審閱', '現場測試', '發現報告', '補救計劃']
                }
              />
              <WaCta href={waHref} label={isEn ? 'WhatsApp Us – AML Audit' : isSc ? '立即 WhatsApp 查询 AML 审计' : '立即 WhatsApp 查詢 AML 審計'} />
              <FaqAccordion faqs={faqsBySubTab['audit'] ?? []} />
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="comp-tab-content">
            <div>
              <div style={{ borderLeft: '3px solid #EF4444', paddingLeft: 16, marginBottom: 32 }}>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#334155', lineHeight: 1.85 }}>
                  {isEn
                    ? 'Continuing professional training is a mandatory requirement for maintaining a licence. SFC requires licensed representatives to complete a minimum number of CPT hours annually, while ESG compliance is an increasingly important area for regulators and investors.'
                    : isSc
                    ? '持续合规培训是维持牌照的必要条件。SFC要求持牌代表每年完成一定时数的持续专业培训，而ESG合规亦是监管机构及投资者日益关注的范畴。'
                    : '持續合規培訓是維持牌照的必要條件。SFC 要求持牌代表每年完成一定時數的持續專業培訓，而 ESG 合規亦是監管機構及投資者日益關注的範疇。'}
                </p>
              </div>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#C9A84C', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                {isEn ? 'TRAINING & ADVISORY SERVICES' : isSc ? '培训及顾问服务' : '培訓及顧問服務'}
              </div>
              <a href={localePath(locale, '/compliance/cpt-marketplace')} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: '#F8FAFC', border: '1px solid #E2E8F0', borderLeft: '3px solid #EF4444', padding: '20px 22px', marginBottom: 2 }}>
                  <div style={{ width: 40, height: 40, background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {docIcon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, color: '#0F2557', fontSize: '.93rem', marginBottom: 2 }}>
                      {isEn ? 'Continuing Professional Training (CPT)' : isSc ? '持续专业培训 (CPT)' : '持續專業培訓 (CPT)'}
                    </h3>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.72rem', fontWeight: 600, color: '#94A3B8', marginBottom: 6 }}>Continuing Professional Training (CPT)</div>
                    <p style={{ fontSize: '.83rem', color: '#64748B', lineHeight: 1.75, marginBottom: 8 }}>
                      {isEn ? 'SFC-recognised CPT programmes covering AML/CFT, regulatory updates, product knowledge, and compliance best practices. Available online or in-person with training record maintenance.' : isSc ? 'SFC认可CPT课程，涵盖AML/CFT、监管更新、产品知识及合规最佳实践。提供线上或面对面培训，并维护培训记录。' : 'SFC 認可 CPT 課程，涵蓋 AML/CFT、監管更新、產品知識及合規最佳實踐。提供線上或面對面培訓，並維護培訓記錄。'}
                    </p>
                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.75rem', fontWeight: 700, color: '#EF4444' }}>
                      {isEn ? '→ Browse CPT Courses' : isSc ? '→ 瀏覽 CPT 課程' : '→ 瀏覽 CPT 課程'}
                    </span>
                  </div>
                </div>
              </a>
              <SvcItem
                title={isEn ? 'ESG Advisory Services' : isSc ? 'ESG 顾问服务' : 'ESG 顧問服務'}
                enSub="ESG Advisory"
                desc={isEn ? 'ESG compliance advisory covering SFC\'s requirements for ESG fund management, climate risk disclosure, and sustainable finance best practices for licensed corporations.' : isSc ? 'ESG合规顾问，涵盖SFC对ESG基金管理的要求、气候风险披露及持牌法团可持续金融最佳实践。' : 'ESG 合規顧問，涵蓋 SFC 對 ESG 基金管理的要求、氣候風險披露及持牌法團可持續金融最佳實踐。'}
              />
            </div>
            <div>
              <ClientTypeBox
                title={isEn ? 'Training Details' : isSc ? '培训详情' : '培訓詳情'}
                items={
                  isEn
                    ? ['Annual CPT Hours Requirement', 'Online or In-Person Training', 'Training Records Maintained', 'SFC-Recognised Programmes', 'Group or Individual Sessions']
                    : ['CPT 每年時數要求', '線上或面對面培訓', '培訓紀錄保存', 'SFC 認可課程', '小組或個人培訓']
                }
              />
              <ProcessBar
                locale={locale}
                steps={
                  isEn
                    ? ['Training Needs Assessment', 'Programme Design', 'Delivery', 'Record Keeping', 'Annual Review']
                    : isSc
                    ? ['培训需求评估', '课程设计', '培训实施', '记录保存', '年度审查']
                    : ['培訓需求評估', '課程設計', '培訓實施', '記錄保存', '年度審查']
                }
              />
              <WaCta href={waHref} label={isEn ? 'WhatsApp Us – Training' : isSc ? '立即 WhatsApp 查询培训服务' : '立即 WhatsApp 查詢培訓服務'} />
            </div>
          </div>
        )}

        <section className="comp-enquiry-section" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: '80px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1.3rem', color: '#0F2557', marginBottom: 6 }}>
              {isEn ? 'Submit an Enquiry' : isSc ? '提交查询' : '提交查詢'}
            </h2>
            <div style={{ width: 44, height: 3, background: '#C9A84C', margin: '12px 0 32px' }} />
            <InquiryForm locale={locale} sourcePage="compliance" waNumber={waNumber} />
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} waNumber={waNumber} />
      <style>{`
        .comp-tab-content { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; padding: 60px 24px; max-width: 1200px; margin: 0 auto; }
        @media (max-width: 768px) {
          .comp-tab-content { grid-template-columns: 1fr; gap: 24px; padding: 32px 16px; }
          .comp-tab-content > div:last-child { order: -1; }
          .comp-overview-grid { grid-template-columns: 1fr !important; }
          .comp-enquiry-section { padding: 40px 0 !important; }
          .comp-hero { padding: 40px 0 !important; }
          .comp-overview-wrapper { padding: 32px 16px !important; }
        }
      `}</style>
    </>
  );
}
