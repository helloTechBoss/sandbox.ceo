export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import InquiryForm from '@/components/InquiryForm';
import { prisma } from '@/lib/prisma';
import { OrgJsonLd, ServiceJsonLd, BreadcrumbJsonLd, FaqPageJsonLd } from '@/components/JsonLd';
import { hreflang, ogImage } from '@/lib/seo';
import { getSeoMeta } from '@/lib/getSeoMeta';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';
  const lk = isEn ? 'en' : isSc ? 'sc' : 'tc';
  const { title, description, keywords } = await getSeoMeta('mso-renewal', lk, {
    title: isEn ? 'MSO Licence Renewal Hong Kong' : isSc ? 'MSO牌照续期香港' : 'MSO牌照續期香港',
    description: isEn
      ? 'Timely MSO licence renewal in Hong Kong — avoid lapses, update AML programmes and ensure Customs compliance. Former compliance professionals handle the full renewal process.'
      : isSc
      ? '及时处理香港MSO牌照续期，避免牌照失效，更新AML计划并确保海关合规，由前合规从业员处理全套续期流程。'
      : '及時處理香港MSO牌照續期，避免牌照失效，更新AML計劃並確保海關合規，由前合規從業員處理全套續期流程。',
    keywords: ['MSO牌照續期', 'MSO renewal', 'MSO續期香港', 'MSO牌照到期', '海關MSO續期', 'MSO licence renewal Hong Kong', 'money service operator renewal', 'MSO renewal deadline', 'AMLO MSO renewal'],
  });
  return {
    title,
    description,
    keywords,
    alternates: hreflang('/mso/renewal'),
    openGraph: { type: 'website', title, description, url: 'https://www.sandbox.ceo/mso/renewal', images: ogImage(title) },
    twitter: { card: 'summary_large_image', title, description },
  };
}

const FAQ_EN = [
  { question: 'When should I start my MSO licence renewal?', answer: 'Start the renewal process at least 3 months before your licence expiry date. Hong Kong Customs requires renewal applications to be submitted before expiry — operating with an expired licence is an offence under the AMLO.' },
  { question: 'What is required for MSO licence renewal?', answer: 'Renewal requires updated AML/CFT programme, evidence of ongoing compliance, updated fit-and-proper declarations, audited accounts, and premises confirmation. Our team reviews everything and prepares the renewal submission.' },
  { question: 'What is the MSO renewal fee?', answer: 'The government renewal fee is HK$2,770 per renewal period. Our professional fee is quoted based on your business complexity — contact us for a quote.' },
  { question: 'Can I renew if I have had compliance issues?', answer: 'Yes, but you should address and document remediation of any past issues before renewal. Customs may ask about prior compliance matters. Our team can advise on how to approach this.' },
  { question: 'How long is an MSO licence valid?', answer: 'An MSO licence is typically valid for 2 years. It must be renewed before expiry or operations must cease.' },
];

const FAQ_TC = [
  { question: '何時應該開始辦理MSO牌照續期？', answer: '應在牌照到期日前至少3個月開始辦理續期。香港海關要求在到期前遞交續期申請——持有已到期牌照繼續經營屬《打擊洗錢條例》下的罪行。' },
  { question: 'MSO牌照續期需要哪些文件？', answer: '續期須提供更新的AML/CFT計劃、持續合規證明、更新的適當人選聲明、經審計賬目及營業地點確認。我們的團隊審閱所有文件並準備續期申請。' },
  { question: 'MSO續期費用是多少？', answer: '政府續期費用為每個續期期間HK$2,770。我們的專業費用根據您的業務複雜程度另行報價，請聯絡我們查詢。' },
  { question: '如曾有合規問題，可否申請續期？', answer: '可以，但應在續期前解決並記錄任何過往問題的補救措施。海關可能就過往合規事宜提問。我們的團隊可就如何應對提供建議。' },
  { question: 'MSO牌照有效期多長？', answer: 'MSO牌照通常有效期為2年，必須在到期前申請續期，否則須停止業務。' },
];

const FAQ_SC = [
  { question: '何时应该开始办理MSO牌照续期？', answer: '应在牌照到期日前至少3个月开始办理续期。香港海关要求在到期前递交续期申请——持有已到期牌照继续经营属《打击洗钱条例》下的罪行。' },
  { question: 'MSO牌照续期需要哪些文件？', answer: '续期须提供更新的AML/CFT计划、持续合规证明、更新的适当人选声明、经审计账目及营业地点确认。我们的团队审阅所有文件并准备续期申请。' },
  { question: 'MSO续期费用是多少？', answer: '政府续期费用为每个续期期间HK$2,770。我们的专业费用根据您的业务复杂程度另行报价，请联络我们查询。' },
  { question: '如曾有合规问题，可否申请续期？', answer: '可以，但应在续期前解决并记录任何过往问题的补救措施。海关可能就过往合规事宜提问。我们的团队可就如何应对提供建议。' },
  { question: 'MSO牌照有效期多长？', answer: 'MSO牌照通常有效期为2年，必须在到期前申请续期，否则须停止业务。' },
];

const CHECKLIST_EN = ['AML/CFT programme review and update', 'Fit & Proper declarations (all responsible persons)', 'Audited accounts for renewal period', 'Premises confirmation', 'Compliance record review', 'Government fee payment', 'Submission to Hong Kong Customs'];
const CHECKLIST_TC = ['AML/CFT計劃審閱及更新', '適當人選聲明（所有負責人）', '續期期間的經審計賬目', '營業地點確認', '合規記錄審閱', '繳付政府費用', '遞交香港海關'];
const CHECKLIST_SC = ['AML/CFT计划审阅及更新', '适当人选声明（所有负责人）', '续期期间的经审计账目', '营业地点确认', '合规记录审阅', '缴付政府费用', '递交香港海关'];

export default async function MsoRenewalPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';
  const waNum = await prisma.setting.findUnique({ where: { key: 'whatsapp_number' } }).catch(() => null);
  const waNumber = waNum?.value || '+85292318254';
  const waHref = `https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi，我想查詢MSO牌照續期服務')}`;
  const faqs = isEn ? FAQ_EN : isSc ? FAQ_SC : FAQ_TC;
  const checklist = isEn ? CHECKLIST_EN : isSc ? CHECKLIST_SC : CHECKLIST_TC;

  return (
    <>
      <OrgJsonLd />
      <ServiceJsonLd
        name={isEn ? 'MSO Licence Renewal Hong Kong' : 'MSO牌照續期香港'}
        description={isEn ? 'Timely MSO licence renewal — full document preparation, AML programme update and Customs liaison.' : 'MSO牌照續期，全套文件準備、AML計劃更新及海關聯絡。'}
        url="/mso/renewal"
      />
      <BreadcrumbJsonLd items={[
        { name: isEn ? 'Home' : '主頁', item: 'https://www.sandbox.ceo' },
        { name: isEn ? 'MSO Licensing' : 'MSO牌照', item: 'https://www.sandbox.ceo/mso' },
        { name: isEn ? 'Licence Renewal' : '牌照續期', item: 'https://www.sandbox.ceo/mso/renewal' },
      ]} />
      <FaqPageJsonLd faqs={faqs} />
      <SiteHeader locale={locale} waNumber={waNumber} />
      <main>
        {/* Hero */}
        <div style={{ background: '#0F2557', padding: '56px 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 10 }}>
              SANDBOX MSO
            </p>
            <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff', letterSpacing: '.02em', marginBottom: 8 }}>
              {isEn ? 'MSO Licence Renewal' : isSc ? 'MSO牌照续期' : 'MSO牌照續期'}
            </h1>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '1rem', color: '#C9A84C', fontWeight: 700, marginBottom: 10 }}>
              {isEn ? 'Avoid Lapse — Renew Before Expiry' : isSc ? '避免失效 — 到期前完成续期' : '避免失效 — 到期前完成續期'}
            </p>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: 'rgba(255,255,255,.6)', maxWidth: 560, lineHeight: 1.85 }}>
              {isEn
                ? 'Operating with an expired MSO licence is an offence. Let our team manage the full renewal process — updated AML programme, compliance review, and Customs submission — so you can focus on your business.'
                : isSc
                ? '持有已到期MSO牌照继续经营属刑事罪行。让我们的团队处理全套续期流程——更新AML计划、合规审查及递交海关，让您专注业务。'
                : '持有已到期MSO牌照繼續經營屬刑事罪行。讓我們的團隊處理全套續期流程——更新AML計劃、合規審查及遞交海關，讓您專注業務。'}
            </p>
          </div>
        </div>

        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'start' }} className="mso-renewal-grid">

            {/* Main content */}
            <div>
              {/* Warning box */}
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderLeft: '4px solid #EF4444', padding: '16px 20px', marginBottom: 32 }}>
                <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#991B1B', marginBottom: 6 }}>
                  {isEn ? '⚠ Start renewal at least 3 months before expiry' : isSc ? '⚠ 至少在到期前3个月开始办理续期' : '⚠ 至少在到期前3個月開始辦理續期'}
                </div>
                <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: '#7F1D1D', lineHeight: 1.7 }}>
                  {isEn
                    ? 'Hong Kong Customs must receive your renewal application before your licence expires. Late applications may result in a lapse — meaning you must cease operations until a new licence is granted.'
                    : isSc
                    ? '香港海关必须在牌照到期前收到续期申请。逾期申请可能导致牌照失效，届时须停止业务直至新牌照批出。'
                    : '香港海關必須在牌照到期前收到續期申請。逾期申請可能導致牌照失效，屆時須停止業務直至新牌照批出。'}
                </div>
              </div>

              {/* Renewal checklist */}
              <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#0F2557', marginBottom: 16 }}>
                {isEn ? 'Renewal Checklist' : isSc ? '续期清单' : '續期清單'}
              </h2>
              <div style={{ border: '1px solid #E2E8F0', marginBottom: 32 }}>
                {checklist.map((item, i, arr) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <span style={{ color: '#EF4444', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155' }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* FAQ */}
              <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#0F2557', marginBottom: 16 }}>
                {isEn ? 'Frequently Asked Questions' : isSc ? '常见问题' : '常見問題'}
              </h2>
              <div style={{ border: '1px solid #E2E8F0' }}>
                {faqs.map((faq, i) => (
                  <details key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                    <summary style={{ padding: '16px 20px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#0F2557', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {faq.question}
                      <span style={{ color: '#EF4444', fontWeight: 700, flexShrink: 0, marginLeft: 12 }}>+</span>
                    </summary>
                    <div style={{ padding: '0 20px 16px', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', color: '#334155', lineHeight: 1.8 }}>
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div style={{ background: '#EF4444', padding: 28, marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, color: '#fff', fontSize: '.95rem', marginBottom: 12 }}>
                  {isEn ? 'Renew Before It\'s Too Late' : isSc ? '尽快办理续期' : '盡快辦理續期'}
                </h3>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.7, marginBottom: 16 }}>
                  {isEn ? 'WhatsApp us now to check your renewal timeline and get started.' : isSc ? '立即 WhatsApp 我们，确认续期时间表并开始办理。' : '立即 WhatsApp 我們，確認續期時間表並開始辦理。'}
                </p>
                <a href={waHref} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', color: '#EF4444', padding: '12px 16px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', textDecoration: 'none', width: '100%' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  {isEn ? 'WhatsApp Us Now' : isSc ? '立即 WhatsApp' : '立即 WhatsApp'}
                </a>
              </div>
              <div style={{ border: '1px solid #E2E8F0', marginBottom: 20 }}>
                <div style={{ background: '#0F2557', padding: '12px 16px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>
                  {isEn ? 'Related Services' : isSc ? '相关服务' : '相關服務'}
                </div>
                <div style={{ padding: 16 }}>
                  {[
                    { href: '/mso', label: isEn ? 'MSO Overview' : 'MSO牌照概覽' },
                    { href: '/mso/new-application', label: isEn ? 'MSO New Application' : 'MSO新牌申請' },
                    { href: '/compliance', label: isEn ? 'AML Compliance' : 'AML合規' },
                    { href: '/tech', label: isEn ? 'AML System Setup' : 'AML系統設置' },
                  ].map(link => (
                    <a key={link.href} href={link.href} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: '#0F2557', textDecoration: 'none' }}>
                      <span style={{ color: '#C9A84C' }}>›</span> {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <InquiryForm locale={locale} sourcePage="mso-renewal" waNumber={waNumber} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} waNumber={waNumber} />
      <style>{`
        @media (max-width: 768px) {
          .mso-renewal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
