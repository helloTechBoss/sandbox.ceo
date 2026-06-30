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

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';
  const lk = isEn ? 'en' : isSc ? 'sc' : 'tc';
  const { title, description, keywords } = await getSeoMeta('corporate', lk, {
    title: isEn ? 'Company Incorporation & Secretary Services Hong Kong' : isSc ? '香港公司成立及秘书服务' : '香港公司成立及秘書服務',
    description: isEn
      ? 'Hong Kong company incorporation, company secretary, accounting & audit, annual return filing and company deregistration. TCSP-licensed corporate service provider.'
      : isSc
      ? '香港公司成立、公司秘书、会计审计、周年申报及公司撤销服务，持牌TCSP企业服务提供商。'
      : '香港公司成立、公司秘書、會計審計、周年申報及公司撤銷服務，持牌TCSP企業服務提供商。',
    keywords: ['香港公司成立', '公司秘書', '會計審計', '周年申報', '企業服務', 'TCSP牌照', '撤銷公司', '香港開公司', 'Hong Kong company incorporation', 'company secretary Hong Kong', 'accounting audit Hong Kong', 'TCSP licence', 'company deregistration Hong Kong', 'annual return filing'],
  });
  return {
    title,
    description,
    keywords,
    alternates: hreflang('/corporate'),
    openGraph: { type: 'website', title, description, url: 'https://www.sandbox.ceo/corporate', images: ogImage(title) },
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

function PkgCard({ name, price, features, highlight }: { name: string; price: string; features: string[]; highlight?: boolean }) {
  return (
    <div style={{ border: highlight ? '2px solid #0F2557' : '1px solid #E2E8F0', padding: 24, background: highlight ? '#F8FAFC' : '#fff', position: 'relative' }}>
      {highlight && (
        <div style={{ position: 'absolute', top: -12, left: 24, background: '#EF4444', color: '#fff', fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em', padding: '3px 10px' }}>
          POPULAR
        </div>
      )}
      <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.75rem', letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 8 }}>{name}</div>
      <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#0F2557', marginBottom: 4 }}>{price}</div>
      <div style={{ width: 32, height: 2, background: '#EF4444', margin: '12px 0 16px' }} />
      {features.map((f, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
          <span style={{ color: '#EF4444', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
          <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#334155', lineHeight: 1.5 }}>{f}</span>
        </div>
      ))}
    </div>
  );
}

export default async function CorporatePage({
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
  const [waNum, dbFaqs, dbPackages] = await Promise.all([
    prisma.setting.findUnique({ where: { key: 'whatsapp_number' } }).catch(() => null),
    prisma.faq.findMany({ where: { pageSlug: 'corporate' }, orderBy: [{ subTab: 'asc' }, { order: 'asc' }] }).catch(() => []),
    prisma.package.findMany({ include: { features: { where: { enabled: true }, orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } }).catch(() => []),
  ]);
  const pkgsByGroup: Record<string, any[]> = {};
  for (const pkg of dbPackages as any[]) {
    if (!pkgsByGroup[pkg.group]) pkgsByGroup[pkg.group] = [];
    pkgsByGroup[pkg.group].push(pkg);
  }
  function dbPkgCards(group: string) {
    const pkgs = pkgsByGroup[group];
    if (!pkgs || pkgs.length === 0) return null;
    return pkgs.map((pkg: any) => (
      <PkgCard
        key={pkg.id}
        name={(pkg.name as any)?.[lk] || (pkg.name as any)?.tc || ''}
        price={pkg.price}
        features={((pkg.features || []) as any[]).map((f: any) => (f.label as any)?.[lk] || (f.label as any)?.tc || '')}
        highlight={pkg.featured}
      />
    ));
  }
  const waNumber = waNum?.value || '+85292318254';
  const waHref = `https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi，我想查詢企業服務')}`;
  const faqsBySubTab: Record<string, { question: string; answer: string }[]> = {};
  for (const f of dbFaqs as any[]) {
    const st = f.subTab || 'overview';
    if (!faqsBySubTab[st]) faqsBySubTab[st] = [];
    faqsBySubTab[st].push({ question: f.question[lk] || f.question.tc, answer: f.answer[lk] || f.answer.tc });
  }

  const tabs = [
    { key: 'overview', label: isEn ? 'Overview' : isSc ? '概览' : '概覽' },
    { key: 'incorporation', label: isEn ? 'Incorporation' : isSc ? '公司注册' : '公司成立' },
    { key: 'comsec', label: isEn ? 'Company Sec.' : isSc ? '公司秘书' : '公司秘書' },
    { key: 'accounting', label: isEn ? 'Accounting' : isSc ? '会计' : '會計審計' },
    { key: 'deregistration', label: isEn ? 'Deregistration' : isSc ? '撤销登记' : '撤銷登記' },
    { key: 'hr', label: isEn ? 'HR & Talent' : isSc ? '人才招聘' : '人才招聘' },
  ];

  return (
    <>
      <OrgJsonLd />
      <ServiceJsonLd
        name={isEn ? 'Company Incorporation & Secretary Services Hong Kong' : '香港公司成立及秘書服務'}
        description={isEn ? 'Company incorporation, secretary, accounting and corporate services in Hong Kong.' : '香港公司成立、秘書、會計及企業服務。'}
        url="/corporate"
      />
      <BreadcrumbJsonLd items={[
        { name: isEn ? 'Home' : '主頁', item: 'https://www.sandbox.ceo' },
        { name: isEn ? 'Corporate Services' : isSc ? '企业服务' : '企業服務', item: 'https://www.sandbox.ceo/corporate' },
      ]} />
      {Object.values(faqsBySubTab).flat().length > 0 && (
        <FaqPageJsonLd faqs={Object.values(faqsBySubTab).flat()} />
      )}
      <SiteHeader locale={locale} waNumber={waNumber} />
      <main>
        <div className="corp-hero" style={{ background: '#0F2557', padding: '56px 0', position: 'relative', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 70%', zIndex: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg,rgba(9,26,62,.93) 0%,rgba(9,26,62,.85) 55%,rgba(9,26,62,.55) 100%)', zIndex: 1 }} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 10 }}>
              SANDBOX CORPORATE
            </p>
            <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff', letterSpacing: '.02em', marginBottom: 8 }}>
              {isEn ? 'Corporate & Business Services' : isSc ? '企业及商业服务' : '企業及商業服務'}
            </h1>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '1rem', color: '#C9A84C', fontWeight: 700, marginBottom: 10 }}>
              {isEn ? 'One-Stop Corporate Solutions' : isSc ? '一站式企业解决方案' : '一站式企業解決方案'}
            </p>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: 'rgba(255,255,255,.6)', maxWidth: 560, lineHeight: 1.85 }}>
              {isEn
                ? 'A solid corporate structure is the foundation for compliant operations and sustainable growth. We provide one-stop corporate services for startups, SMEs, and overseas companies, covering incorporation, secretarial, accounting, and talent recruitment.'
                : isSc
                ? '稳健的企业架构是合规运营和可持续增长的基础。我们为初创企业、中小企及海外公司提供一站式企业服务，涵盖公司设立、秘书、会计及人才招聘。'
                : '穩健的企業架構是合規運營和可持續增長的基礎。我們為初創企業、中小企及海外公司提供一站式企業服務，涵蓋公司設立、秘書、會計及人才招聘。'}
            </p>
          </div>
        </div>

        <SubTabNav tabs={tabs} activeTab={activeTab} />

        {activeTab === 'overview' && (
          <div className="corp-overview-wrapper" style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
            <div style={{ borderLeft: '3px solid #EF4444', paddingLeft: 16, marginBottom: 40 }}>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#334155', lineHeight: 1.85 }}>
                {isEn
                  ? 'A solid corporate structure is the foundation for compliant operations and sustainable growth. We provide one-stop corporate services for startups, SMEs, and overseas companies, covering incorporation, secretarial, accounting, and talent recruitment.'
                  : isSc
                  ? '稳健的企业架构是合规运营和可持续增长的基础。我们为初创企业、中小企及海外公司提供一站式企业服务，涵盖公司设立、秘书、会计及人才招聘。'
                  : '穩健的企業架構是合規運營和可持續增長的基礎。我們為初創企業、中小企及海外公司提供一站式企業服務，涵蓋公司設立、秘書、會計及人才招聘。'}
              </p>
            </div>
            <div className="corp-overview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
              <OverviewCard tab="incorporation" locale={locale} enTitle="INCORPORATION" title={isEn ? 'Company Incorporation' : isSc ? '公司注册' : '公司成立'} desc={isEn ? 'HK limited company setup with secretarial services and TCSP licence applications.' : isSc ? '香港有限公司成立、秘书服务及TCSP牌照申请。' : '香港有限公司成立、秘書服務及 TCSP 牌照申請。'} />
              <OverviewCard tab="comsec" locale={locale} enTitle="COMPANY SECRETARY" title={isEn ? 'Company Secretarial' : isSc ? '公司秘书' : '公司秘書'} desc={isEn ? 'Statutory company secretarial services under the Companies Ordinance (Cap. 622).' : isSc ? '根据《公司条例》(第622章)提供法定公司秘书服务。' : '根據《公司條例》(第 622 章) 提供法定公司秘書服務。'} />
              <OverviewCard tab="accounting" locale={locale} enTitle="ACCOUNTING & AUDIT" title={isEn ? 'Accounting & Audit' : isSc ? '会计及审计' : '會計及審計'} desc={isEn ? 'Statutory audit, tax return filing, and bookkeeping services for HK companies.' : isSc ? '香港公司法定审计、报税及记账服务。' : '香港公司法定審計、報稅及記賬服務。'} />
              <OverviewCard tab="deregistration" locale={locale} enTitle="DEREGISTRATION" title={isEn ? 'Company Deregistration' : isSc ? '公司撤销登记' : '公司撤銷登記'} desc={isEn ? 'Proper company dissolution to avoid ongoing statutory obligations.' : isSc ? '妥善公司解散，避免持续法定申报义务。' : '妥善公司解散，避免持續法定申報義務。'} />
              <OverviewCard tab="hr" locale={locale} enTitle="HR & TALENT" title={isEn ? 'HR & Talent Recruitment' : isSc ? '人才招聘' : '人才招聘'} desc={isEn ? 'Compliance talent search and Hong Kong work visa applications.' : isSc ? '合规人才搜寻及香港工作签证申请。' : '合規人才搜尋及香港工作簽證申請。'} />
            </div>
          </div>
        )}

        {activeTab === 'incorporation' && (
          <div className="corp-tab-content">
            <div>
              <div style={{ borderLeft: '3px solid #EF4444', paddingLeft: 16, marginBottom: 32 }}>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#334155', lineHeight: 1.85 }}>
                  {isEn
                    ? 'Hong Kong is renowned for its robust legal system, low tax rates, simple tax regime, and free capital flow, attracting over 100,000 new company registrations annually. The key advantage of a limited company is that shareholder liability is limited to their capital contribution.'
                    : isSc
                    ? '香港以健全的法律制度、低税率、简单税制及资本自由流动著称，每年吸引逾10万家新公司成立。有限公司的主要优势是股东责任以其出资额为限。'
                    : '香港以健全的法律制度、低稅率、簡單稅制及資本自由流動著稱，每年吸引逾 10 萬家新公司成立。有限公司的主要優勢是股東責任以其出資額為限。'}
                </p>
              </div>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#C9A84C', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                {isEn ? 'INCORPORATION SERVICES' : isSc ? '成立服务' : '成立服務'}
              </div>
              <SvcItem
                title={isEn ? 'HK Limited Company Formation' : isSc ? '香港有限公司成立' : '香港有限公司成立'}
                enSub="Hong Kong Limited Company Incorporation"
                desc={isEn ? 'Full service Hong Kong private limited company registration with Companies Registry, including articles of association and statutory documents.' : isSc ? '全套香港私人有限公司注册服务，包括公司章程及法定文件。' : '全套香港私人有限公司登記服務，包括公司章程及法定文件。'}
              />
              <SvcItem
                title={isEn ? 'Company Secretarial Services' : isSc ? '公司秘书服务' : '公司秘書服務'}
                enSub="Company Secretarial"
                desc={isEn ? 'Statutory company secretary appointment as required under the Companies Ordinance, handling all annual filings and regulatory notices.' : isSc ? '根据《公司条例》要求委任法定公司秘书，处理所有周年申报及监管通知。' : '根據《公司條例》要求委任法定公司秘書，處理所有周年申報及監管通知。'}
              />
              <SvcItem
                title={isEn ? 'TCSP Licence Application' : isSc ? 'TCSP 牌照申请' : 'TCSP 牌照申請'}
                enSub="Trust or Company Service Provider Licence"
                desc={isEn ? 'Licence application for trust or company service providers under the AMLO, required for firms providing corporate formation and secretarial services to third parties.' : isSc ? '根据《打击洗钱条例》向信托或公司服务提供商申请牌照，适用于向第三方提供公司成立及秘书服务的公司。' : '根據《打擊洗錢條例》向信託或公司服務提供商申請牌照，適用於向第三方提供公司成立及秘書服務的公司。'}
              />
              <SvcItem
                title={isEn ? 'Share Transfer & Acquisition' : isSc ? '公司股权转让及收购' : '公司股權轉讓及收購'}
                enSub="Share Transfer & Corporate Acquisition"
                desc={isEn ? 'Share transfer documentation, stamp duty assessment, and regulatory notifications for company ownership changes.' : isSc ? '股权转让文件、印花税评估及公司股权变更的监管通知。' : '股權轉讓文件、印花稅評估及公司股權變更的監管通知。'}
              />
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#C9A84C', letterSpacing: '.08em', textTransform: 'uppercase', margin: '28px 0 16px' }}>
                {isEn ? 'PRICING PACKAGES' : isSc ? '收费套餐' : '收費套餐'}
              </div>
              <div className="corp-pricing-grid">
                {dbPkgCards('incorporation') ?? (<>
                  <PkgCard
                    name={isEn ? 'Basic' : isSc ? '基础' : '基礎'}
                    price="HK$1,800"
                    features={isEn
                      ? ['Company Registration', 'Legal Share Capital', 'Articles of Association', 'Electronic Company Documents']
                      : isSc
                      ? ['公司成立申请', '法定股本', '公司章程', '电子公司宪章']
                      : ['公司成立申請', '法定股本', '公司章程', '電子公司憲章']}
                  />
                  <PkgCard
                    name={isEn ? 'Standard' : isSc ? '标准' : '標準'}
                    price="HK$3,200"
                    highlight
                    features={isEn
                      ? ['All Basic Features', 'First Year Secretarial', 'Business Registration', 'Annual Return (1st Year)']
                      : isSc
                      ? ['基础套餐全部内容', '首年公司秘书', '商业登记', '周年申报表（首年）']
                      : ['基礎套餐全部內容', '首年公司秘書', '商業登記', '周年申報表（首年）']}
                  />
                  <PkgCard
                    name={isEn ? 'Premium' : isSc ? '高级' : '高級'}
                    price="HK$5,500"
                    features={isEn
                      ? ['All Standard Features', 'Bank Account Opening Assistance', 'Virtual Office', 'Initial Compliance Consultation']
                      : isSc
                      ? ['标准套餐全部内容', '银行开户协助', '虚拟办公室', '合规初步咨询']
                      : ['標準套餐全部內容', '銀行開戶協助', '虛擬辦公室', '合規初步諮詢']}
                  />
                </>)}
              </div>
            </div>
            <div>
              <ClientTypeBox
                title={isEn ? 'Who Should Incorporate' : isSc ? '谁应该注册公司' : '誰應該成立公司'}
                items={isEn
                  ? ['Startups & Entrepreneurs', 'Overseas Companies Entering HK', 'Fintech & Payment Firms', 'Asset Management Firms', 'Trading Companies']
                  : isSc
                  ? ['初创企业及创业者', '海外公司进入香港市场', '金融科技及支付公司', '资产管理公司', '贸易公司']
                  : ['初創企業及創業者', '海外公司進入香港市場', '金融科技及支付公司', '資產管理公司', '貿易公司']}
              />
              <ProcessBar
                locale={locale}
                steps={isEn
                  ? ['Name Reservation', 'Document Preparation', 'Registry Submission', 'CR Issued', 'BR & Bank Account']
                  : isSc
                  ? ['公司名称预留', '文件准备', '递交公司注册处', '公司注册证发出', '商业登记及银行开户']
                  : ['公司名稱預留', '文件準備', '遞交公司註冊處', '公司註冊證發出', '商業登記及銀行開戶']}
              />
              <WaCta href={waHref} label={isEn ? 'WhatsApp Us – Incorporation' : isSc ? '立即 WhatsApp 查询公司成立' : '立即 WhatsApp 查詢公司成立'} />
              {(faqsBySubTab['incorporation'] ?? []).length > 0 && (
                <div style={{ border: '1px solid #E2E8F0', marginTop: 24 }}>
                  <div style={{ background: '#0F2557', padding: '12px 16px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>
                    {isEn ? 'Frequently Asked Questions' : isSc ? '常见问题' : '常見問題'}
                  </div>
                  <FaqAccordion faqs={faqsBySubTab['incorporation']} />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'comsec' && (
          <div className="corp-tab-content">
            <div>
              <div style={{ borderLeft: '3px solid #EF4444', paddingLeft: 16, marginBottom: 32 }}>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#334155', lineHeight: 1.85 }}>
                  {isEn
                    ? "A company secretary is not the boss's personal assistant. Under the Companies Ordinance (Cap. 622), every Hong Kong limited company must appoint a company secretary to fulfil statutory obligations."
                    : isSc
                    ? '公司秘书并非老板的私人助理。根据《公司条例》(第622章)，每间香港有限公司必须委任公司秘书以履行法定义务。'
                    : '公司秘書並非老闆的私人助理。根據《公司條例》(第622章)，每間香港有限公司必須委任公司秘書以履行法定義務。'}
                </p>
              </div>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#C9A84C', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                {isEn ? 'SECRETARIAL SERVICES' : isSc ? '秘书服务' : '秘書服務'}
              </div>
              <SvcItem
                title={isEn ? 'Annual Return Filing' : isSc ? '周年申报表递交' : '周年申報表遞交'}
                enSub="Annual Return (Form NAR1)"
                desc={isEn ? 'Timely filing of the annual return (Form NAR1) with the Companies Registry to maintain good standing.' : isSc ? '及时向公司注册处递交周年申报表(NAR1表)，维持良好状态。' : '及時向公司註冊處遞交周年申報表 (NAR1表)，維持良好狀態。'}
              />
              <SvcItem
                title={isEn ? 'Business Registration Renewal' : isSc ? '商业登记证年期更新' : '商業登記證年期更新'}
                enSub="Business Registration Renewal"
                desc={isEn ? 'Annual or three-year Business Registration Certificate renewal with the Inland Revenue Department.' : isSc ? '向税务局续期周年或三年商业登记证。' : '向稅務局續期周年或三年商業登記證。'}
              />
              <SvcItem
                title={isEn ? 'Significant Controllers Register' : isSc ? '重要控制人登记册' : '重要控制人登記冊'}
                enSub="Significant Controllers Register (SCR)"
                desc={isEn ? 'Maintenance and updating of the Significant Controllers Register as required under the Companies Ordinance.' : isSc ? '根据《公司条例》要求维护及更新重要控制人登记册。' : '根據《公司條例》要求維護及更新重要控制人登記冊。'}
              />
              <SvcItem
                title={isEn ? 'Director & Secretary Changes' : isSc ? '董事/秘书任免文件' : '董事/秘書任免文件'}
                enSub="Director & Secretary Appointment / Resignation"
                desc={isEn ? 'Preparation and filing of statutory forms for director and secretary appointments, resignations, and changes.' : isSc ? '准备及递交董事及秘书任命、辞任及变更的法定表格。' : '準備及遞交董事及秘書任命、辭任及變更的法定表格。'}
              />
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#C9A84C', letterSpacing: '.08em', textTransform: 'uppercase', margin: '28px 0 16px' }}>
                {isEn ? 'MONTHLY PLANS' : isSc ? '月费计划' : '月費計劃'}
              </div>
              <div className="corp-pricing-grid">
                {dbPkgCards('comsec') ?? (<>
                  <PkgCard
                    name="Basic"
                    price="HK$350/月"
                    features={isEn
                      ? ['Annual Return Filing', 'BR Renewal', 'SCR Maintenance']
                      : isSc
                      ? ['周年申报表递交', '商业登记证续期', '重要控制人登记册']
                      : ['周年申報表遞交', '商業登記證續期', '重要控制人登記冊']}
                  />
                  <PkgCard
                    name="Elite"
                    price="HK$680/月"
                    highlight
                    features={isEn
                      ? ['All Basic Features', 'Director/Secretary Changes', 'Board Resolutions', 'Registered Address']
                      : isSc
                      ? ['基础全部内容', '董事/秘书变更', '董事会决议', '注册地址']
                      : ['基礎全部內容', '董事/秘書變更', '董事會決議', '註冊地址']}
                  />
                  <PkgCard
                    name="Premium"
                    price="HK$1,200/月"
                    features={isEn
                      ? ['All Elite Features', 'Unlimited Resolutions', 'Share Transfer Docs', 'Priority Response']
                      : isSc
                      ? ['精英全部内容', '无限董事会决议', '股份转让文件', '优先回复']
                      : ['精英全部內容', '無限董事會決議', '股份轉讓文件', '優先回覆']}
                  />
                </>)}
              </div>
            </div>
            <div>
              <ClientTypeBox
                title={isEn ? 'Statutory Requirements' : isSc ? '法定要求' : '法定要求'}
                items={isEn
                  ? ['Annual Return – within 42 days of anniversary', 'BR Renewal – before expiry', 'SCR – updated within 7 days of change', 'Registered Address in HK required']
                  : isSc
                  ? ['周年申报 – 周年日起42日内', '商业登记 – 到期前续期', '重要控制人 – 变更后7日内更新', '须有香港注册地址']
                  : ['周年申報 – 周年日起42日內', '商業登記 – 到期前續期', '重要控制人 – 變更後7日內更新', '須有香港註冊地址']}
              />
              <WaCta href={waHref} label={isEn ? 'WhatsApp Us – Company Sec.' : isSc ? '立即 WhatsApp 查询公司秘书' : '立即 WhatsApp 查詢公司秘書'} />
              {(faqsBySubTab['comsec'] ?? []).length > 0 && (
                <div style={{ border: '1px solid #E2E8F0', marginTop: 24 }}>
                  <div style={{ background: '#0F2557', padding: '12px 16px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>
                    {isEn ? 'Frequently Asked Questions' : isSc ? '常见问题' : '常見問題'}
                  </div>
                  <FaqAccordion faqs={faqsBySubTab['comsec']} />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'accounting' && (
          <div className="corp-tab-content">
            <div>
              <div style={{ borderLeft: '3px solid #EF4444', paddingLeft: 16, marginBottom: 32 }}>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#334155', lineHeight: 1.85 }}>
                  {isEn
                    ? 'Under Section 51C of the Inland Revenue Ordinance, all businesses operating in Hong Kong must maintain proper financial records for at least 7 years. HK limited companies must also appoint a HKICPA practising accountant for annual audit — this is a statutory requirement.'
                    : isSc
                    ? '根据《税务条例》第51C条，所有在港营业的企业须保存妥善的财务记录至少7年。香港有限公司亦须委任香港会计师公会执业会计师进行年度审计——这是法定要求。'
                    : '根據《稅務條例》第51C條，所有在港營業的企業須保存妥善的財務記錄至少7年。香港有限公司亦須委任香港會計師公會執業會計師進行年度審計——這是法定要求。'}
                </p>
              </div>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#C9A84C', letterSpacing: '.08em', textTransform: 'uppercase', margin: '0 0 16px' }}>
                {isEn ? 'SERVICE PLANS' : isSc ? '服务计划' : '服務計劃'}
              </div>
              <div className="corp-pricing-grid" style={{ marginBottom: 24 }}>
                {dbPkgCards('accounting') ?? (<>
                  <PkgCard
                    name={isEn ? 'Audit + Tax' : isSc ? '审计+报税' : '審計+報稅'}
                    price={isEn ? 'From HK$3,800' : '由HK$3,800起'}
                    features={isEn
                      ? ['Statutory Audit', 'Profits Tax Return (BIR51)', 'Tax Computation', 'Employer Return (BIR56A)']
                      : isSc
                      ? ['法定审计', '利得税报税表 (BIR51)', '税务计算', '雇主报税表 (BIR56A)']
                      : ['法定審計', '利得稅報稅表 (BIR51)', '稅務計算', '僱主報稅表 (BIR56A)']}
                  />
                  <PkgCard
                    name={isEn ? 'Accounting + Audit + Tax' : isSc ? '会计+审计+报税' : '會計+審計+報稅'}
                    price={isEn ? 'From HK$6,800' : '由HK$6,800起'}
                    highlight
                    features={isEn
                      ? ['All Audit+Tax Features', 'Annual Bookkeeping', 'Bank Reconciliation', 'Management Accounts']
                      : isSc
                      ? ['审计+报税全部内容', '年度记账', '银行对账', '管理账目']
                      : ['審計+報稅全部內容', '年度記賬', '銀行對賬', '管理賬目']}
                  />
                  <PkgCard
                    name={isEn ? 'Monthly Bookkeeping' : isSc ? '月结服务' : '月結服務'}
                    price={isEn ? 'From HK$1,200/mo' : '由HK$1,200/月起'}
                    features={isEn
                      ? ['Monthly Bookkeeping', 'Bank Reconciliation', 'Monthly Reports', 'Annual Audit & Tax']
                      : isSc
                      ? ['月度记账', '银行对账', '月度财务报告', '年度审计及报税']
                      : ['月度記賬', '銀行對賬', '月度財務報告', '年度審計及報稅']}
                  />
                </>)}
              </div>
              <SvcItem
                title={isEn ? 'Statutory Audit' : isSc ? '法定审计' : '法定審計'}
                enSub="Statutory Audit (HKICPA)"
                desc={isEn ? 'Annual statutory audit by our HKICPA-registered auditors, producing audited financial statements required for tax filing and regulatory compliance.' : isSc ? '由我们注册会计师进行年度法定审计，出具税务申报及监管合规所需的审计财务报表。' : '由我們註冊會計師進行年度法定審計，出具稅務申報及監管合規所需的審計財務報表。'}
              />
            </div>
            <div>
              <ClientTypeBox
                title={isEn ? 'Key Deadlines' : isSc ? '重要截止日期' : '重要截止日期'}
                items={isEn
                  ? ['Profits Tax Return – within 1 month of issue', 'Employer Return – April each year', 'Financial Records – kept 7 years', 'Audit – before tax filing']
                  : isSc
                  ? ['利得税报税表 – 发出后1个月内', '雇主报税表 – 每年4月', '财务记录 – 保存7年', '审计 – 报税前完成']
                  : ['利得稅報稅表 – 發出後1個月內', '僱主報稅表 – 每年4月', '財務記錄 – 保存7年', '審計 – 報稅前完成']}
              />
              <WaCta href={waHref} label={isEn ? 'WhatsApp Us – Accounting' : isSc ? '立即 WhatsApp 查询会计服务' : '立即 WhatsApp 查詢會計服務'} />
              {(faqsBySubTab['accounting'] ?? []).length > 0 && (
                <div style={{ border: '1px solid #E2E8F0', marginTop: 24 }}>
                  <div style={{ background: '#0F2557', padding: '12px 16px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>
                    {isEn ? 'Frequently Asked Questions' : isSc ? '常见问题' : '常見問題'}
                  </div>
                  <FaqAccordion faqs={faqsBySubTab['accounting']} />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'deregistration' && (
          <div className="corp-tab-content">
            <div>
              <div style={{ borderLeft: '3px solid #EF4444', paddingLeft: 16, marginBottom: 32 }}>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#334155', lineHeight: 1.85 }}>
                  {isEn
                    ? 'Companies that no longer intend to operate should proactively apply to the Companies Registry for deregistration. Dormant companies that are simply ignored still have statutory filing and tax obligations.'
                    : isSc
                    ? '公司若不再打算继续营运，应主动向公司注册处申请撤销登记。闲置公司若只是置之不理，仍有法定申报及缴税义务。'
                    : '公司若不再打算繼續營運，應主動向公司註冊處申請撤銷登記。閒置公司若只是置之不理，仍有法定申報及繳稅義務。'}
                </p>
              </div>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#C9A84C', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                {isEn ? 'DEREGISTRATION SERVICES' : isSc ? '撤销登记服务' : '撤銷登記服務'}
              </div>
              <SvcItem
                title={isEn ? 'Company Deregistration Application' : isSc ? '公司撤销登记申请' : '公司撤銷登記申請'}
                enSub="Company Deregistration (Companies Registry)"
                desc={isEn ? 'Full handling of the company deregistration application with the Companies Registry, including preparation of required statutory documents and government liaison.' : isSc ? '全程处理向公司注册处的撤销登记申请，包括准备所需法定文件及政府联络。' : '全程處理向公司註冊處的撤銷登記申請，包括準備所需法定文件及政府聯絡。'}
              />
              <SvcItem
                title={isEn ? "Shareholders' Special Resolution" : isSc ? '股东特别决议' : '股東特別決議'}
                enSub="Special Resolution"
                desc={isEn ? "Drafting and execution of shareholders' special resolution approving the deregistration, meeting all statutory requirements." : isSc ? '起草及执行股东批准撤销登记的特别决议，符合所有法定要求。' : '起草及執行股東批准撤銷登記的特別決議，符合所有法定要求。'}
              />
              <SvcItem
                title={isEn ? 'Tax Clearance' : isSc ? '公司税务结算' : '公司稅務結算'}
                enSub="Tax Clearance (IRD)"
                desc={isEn ? 'Final profits tax return filing and tax clearance certificate obtained from the Inland Revenue Department prior to deregistration.' : isSc ? '向税务局递交最终利得税报税表并取得税务结算证书，在撤销登记前完成。' : '向稅務局遞交最終利得稅報稅表並取得稅務結算證書，在撤銷登記前完成。'}
              />
              <SvcItem
                title={isEn ? 'IRAS Tax Clearance (Singapore)' : isSc ? 'IRAS 清税表（新加坡）' : 'IRAS 清稅表（新加坡）'}
                enSub="IRAS Tax Clearance Form"
                desc={isEn ? 'IRAS tax clearance for Singapore-incorporated entities winding up, including final GST deregistration.' : isSc ? '新加坡注册实体清盘的IRAS税务结算，包括最终GST注销登记。' : '新加坡註冊實體清盤的 IRAS 稅務結算，包括最終 GST 註銷登記。'}
              />
            </div>
            <div>
              <ClientTypeBox
                title={isEn ? 'Deregistration Requirements' : isSc ? '撤销登记条件' : '撤銷登記條件'}
                items={isEn
                  ? ['Company has ceased operations', 'No outstanding liabilities', 'No pending legal proceedings', 'All taxes settled', "Shareholders' approval"]
                  : isSc
                  ? ['公司已停止营运', '无未清偿负债', '无待决法律诉讼', '所有税款已结清', '股东批准']
                  : ['公司已停止運營', '無未清償負債', '無待決法律訴訟', '所有稅款已結清', '股東批准']}
              />
              <ProcessBar
                locale={locale}
                steps={isEn
                  ? ['Asset Clearance', "Shareholders' Resolution", 'Deregistration Application', 'Government Review', 'Deregistration Complete (3–4 months)']
                  : isSc
                  ? ['清理资产', '股东决议', '申请撤销', '政府审核', '完成撤销（3-4个月）']
                  : ['清理資產', '股東決議', '申請撤銷', '政府審核', '完成撤銷（3-4個月）']}
              />
              <WaCta href={waHref} label={isEn ? 'WhatsApp Us – Deregistration' : isSc ? '立即 WhatsApp 查询撤销登记' : '立即 WhatsApp 查詢撤銷登記'} />
              {(faqsBySubTab['deregistration'] ?? []).length > 0 && (
                <div style={{ border: '1px solid #E2E8F0', marginTop: 24 }}>
                  <div style={{ background: '#0F2557', padding: '12px 16px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>
                    {isEn ? 'Frequently Asked Questions' : isSc ? '常见问题' : '常見問題'}
                  </div>
                  <FaqAccordion faqs={faqsBySubTab['deregistration']} />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'hr' && (
          <div className="corp-tab-content">
            <div>
              <div style={{ borderLeft: '3px solid #EF4444', paddingLeft: 16, marginBottom: 32 }}>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#334155', lineHeight: 1.85 }}>
                  {isEn
                    ? "In Hong Kong's regulated financial environment, talent quality and compliance credentials directly impact licence applications and ongoing regulatory performance."
                    : isSc
                    ? '在香港受规管的金融环境中，人才的质素及合规资历直接影响牌照申请及持续监管表现。'
                    : '在香港受規管的金融環境中，人才的質素及合規資歷直接影響牌照申請及持續監管表現。'}
                </p>
              </div>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#C9A84C', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                {isEn ? 'HR & TALENT SERVICES' : isSc ? '人才服务' : '人才服務'}
              </div>
              <SvcItem
                title={isEn ? 'Compliance Talent Recruitment & Executive Search' : isSc ? '合规人才招聘及高管搜寻' : '合規人才招聘及高管搜尋'}
                enSub="Compliance Recruitment & Executive Search"
                desc={isEn ? 'Specialist recruitment for CCO, MLRO, KYC analysts, compliance officers, and AML auditors across SFC-licensed corporations and MSOs.' : isSc ? '为SFC持牌法团及MSO专业招募CCO、MLRO、KYC分析师、合规主任及AML审计师。' : '為 SFC 持牌法團及 MSO 專業招募 CCO、MLRO、KYC 分析師、合規主任及 AML 審計師。'}
              />
              <SvcItem
                title={isEn ? 'Hong Kong Work Visa Application (GEP)' : isSc ? '香港工作签证申请 (GEP)' : '香港工作簽證申請 (GEP)'}
                enSub="General Employment Policy (GEP) Visa"
                desc={isEn ? 'Work visa application under the General Employment Policy for overseas professionals relocating to Hong Kong, including document preparation and Immigration Department liaison.' : isSc ? '根据一般就业政策为海外专业人士申请香港工作签证，包括文件准备及入境事务处联络。' : '根據一般就業政策為海外專業人士申請香港工作簽證，包括文件準備及入境事務處聯絡。'}
              />
              <SvcItem
                title={isEn ? 'Greater Bay Area Talent Scheme (IMAS)' : isSc ? '大湾区人才计划 (IMAS)' : '大灣區人才計劃 (IMAS)'}
                enSub="Investment Migration Advisory Service (IMAS)"
                desc={isEn ? 'Advisory on talent and immigration schemes for the Greater Bay Area, facilitating movement of financial and compliance professionals across the GBA.' : isSc ? '大湾区人才及移民计划顾问服务，促进金融及合规专业人才在大湾区内流动。' : '大灣區人才及移民計劃顧問服務，促進金融及合規專業人才在大灣區內流動。'}
              />
            </div>
            <div>
              <ClientTypeBox
                title={isEn ? 'Roles We Place' : isSc ? '招募职位' : '招募職位'}
                items={isEn
                  ? ['CCO / MLRO', 'KYC Analysts', 'Compliance Officers', 'AML Auditors', 'Responsible Officers (SFC)']
                  : isSc
                  ? ['CCO / MLRO 招聘', 'KYC 分析师', '合规主任', 'AML 审计师', 'SFC 负责人员']
                  : ['CCO / MLRO 招聘', 'KYC 分析師', '合規主任', 'AML 審計師', 'SFC 負責人員']}
              />
              <ProcessBar
                locale={locale}
                steps={isEn
                  ? ['Requirements Briefing', 'Candidate Sourcing', 'Screening & Shortlisting', 'Interview Coordination', 'Offer & Onboarding']
                  : isSc
                  ? ['需求简报', '候选人搜寻', '筛选及入围', '面试协调', '录用及入职']
                  : ['需求簡報', '候選人搜尋', '篩選及入圍', '面試協調', '錄用及入職']}
              />
              <WaCta href={waHref} label={isEn ? 'WhatsApp Us – HR & Talent' : isSc ? '立即 WhatsApp 查询人才服务' : '立即 WhatsApp 查詢人才服務'} />
            </div>
          </div>
        )}

        <section className="corp-enquiry-section" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: '80px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1.3rem', color: '#0F2557', marginBottom: 6 }}>
              {isEn ? 'Submit an Enquiry' : isSc ? '提交查询' : '提交查詢'}
            </h2>
            <div style={{ width: 44, height: 3, background: '#C9A84C', margin: '12px 0 32px' }} />
            <InquiryForm locale={locale} sourcePage="corporate" waNumber={waNumber} />
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} waNumber={waNumber} />
      <style>{`
        .corp-tab-content { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; padding: 60px 24px; max-width: 1200px; margin: 0 auto; }
        .corp-pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 768px) {
          .corp-tab-content { grid-template-columns: 1fr; gap: 24px; padding: 32px 16px; }
          .corp-tab-content > div:last-child { order: -1; }
          .corp-pricing-grid { grid-template-columns: 1fr; }
          .corp-overview-grid { grid-template-columns: 1fr !important; }
          .corp-enquiry-section { padding: 40px 0 !important; }
          .corp-hero { padding: 40px 0 !important; }
          .corp-overview-wrapper { padding: 32px 16px !important; }
        }
      `}</style>
    </>
  );
}
