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
  const { title, description, keywords } = await getSeoMeta('mso-new-application', lk, {
    title: isEn ? 'MSO New Licence Application Hong Kong' : isSc ? 'MSO新牌照申请香港' : 'MSO新牌照申請香港',
    description: isEn
      ? 'Step-by-step MSO (Money Service Operator) new licence application in Hong Kong. Former Customs-approved professionals — typical approval in 3–6 months, full document preparation and AML system setup included.'
      : isSc
      ? '由前香港海关认可从业员协助办理MSO新牌照申请，典型审批期3-6个月，全套文件准备及AML系统设置。'
      : '由前香港海關認可從業員協助辦理MSO新牌照申請，典型審批期3-6個月，全套文件準備及AML系統設置。',
    keywords: ['MSO新牌照申請', 'MSO牌照申請香港', '金錢服務經營者牌照', 'MSO申請費用', 'MSO申請時間', 'MSO new licence Hong Kong', 'money service operator application', 'MSO application process', 'customs MSO licence', 'AMLO MSO application'],
  });
  return {
    title,
    description,
    keywords,
    alternates: hreflang('/mso/new-application'),
    openGraph: { type: 'website', title, description, url: 'https://www.sandbox.ceo/mso/new-application', images: ogImage(title) },
    twitter: { card: 'summary_large_image', title, description },
  };
}

const FAQ_EN = [
  { question: 'Who needs an MSO licence in Hong Kong?', answer: 'Any person or company carrying on a money service business in Hong Kong — including currency exchange, money transfer, and remittance services — requires a licence from Hong Kong Customs under the Anti-Money Laundering Ordinance (AMLO).' },
  { question: 'How long does an MSO new licence application take?', answer: 'Typically 3–6 months from submission to approval, depending on the completeness of your application and Customs workload. Our team ensures all documents are correct before submission to minimise delays.' },
  { question: 'What documents are required for MSO licence application?', answer: 'Key documents include: business plan with AML/CFT programme, proof of premises, fit and proper declarations for all responsible persons, source of funds evidence, and AML system evidence. We prepare all documents on your behalf.' },
  { question: 'What is the MSO licence application fee?', answer: 'The government fee is HK$2,770 for a new MSO licence. Our professional service fee is quoted separately based on your business scope — contact us for a quote.' },
  { question: 'Can a foreign national or overseas company apply for an MSO licence?', answer: 'Yes. Foreign nationals and overseas-incorporated companies can apply for an MSO licence in Hong Kong, subject to meeting fit-and-proper criteria and providing required documentation.' },
];

const FAQ_TC = [
  { question: '誰需要申請香港MSO牌照？', answer: '任何在香港從事金錢服務業務的人士或公司，包括貨幣兌換、匯款及資金轉移服務，均須根據《打擊洗錢及恐怖分子資金籌集條例》（AMLO）向香港海關申請牌照。' },
  { question: 'MSO新牌照申請需要多長時間？', answer: '由遞交申請至獲批通常需要3至6個月，視乎申請文件的完整性及海關工作量。我們的團隊確保所有文件在遞交前均正確無誤，以減少延誤。' },
  { question: 'MSO牌照申請需要哪些文件？', answer: '主要文件包括：包含AML/CFT計劃的業務計劃書、營業地點證明、所有負責人的適當人選聲明、資金來源證明及AML系統證據。我們代您準備所有文件。' },
  { question: 'MSO牌照申請費用是多少？', answer: '政府申請費用為HK$2,770。我們的專業服務費用根據您的業務範圍另行報價，請聯絡我們查詢。' },
  { question: '外籍人士或海外公司可以申請MSO牌照嗎？', answer: '可以。外籍人士及在海外註冊的公司均可申請香港MSO牌照，前提是符合適當人選標準並提供所需文件。' },
];

const FAQ_SC = [
  { question: '谁需要申请香港MSO牌照？', answer: '任何在香港从事金钱服务业务的人士或公司，包括货币兑换、汇款及资金转移服务，均须根据《打击洗钱及恐怖分子资金筹集条例》（AMLO）向香港海关申请牌照。' },
  { question: 'MSO新牌照申请需要多长时间？', answer: '由递交申请至获批通常需要3至6个月，视乎申请文件的完整性及海关工作量。我们的团队确保所有文件在递交前均正确无误，以减少延误。' },
  { question: 'MSO牌照申请需要哪些文件？', answer: '主要文件包括：包含AML/CFT计划的业务计划书、营业地点证明、所有负责人的适当人选声明、资金来源证明及AML系统证据。我们代您准备所有文件。' },
  { question: 'MSO牌照申请费用是多少？', answer: '政府申请费用为HK$2,770。我们的专业服务费用根据您的业务范围另行报价，请联络我们查询。' },
  { question: '外籍人士或海外公司可以申请MSO牌照吗？', answer: '可以。外籍人士及在海外注册的公司均可申请香港MSO牌照，前提是符合适当人选标准并提供所需文件。' },
];

const STEPS_EN = ['Initial consultation & business scope assessment', 'AML/CFT programme drafting & policy manual', 'Fit & Proper declarations and background checks', 'Premises inspection preparation', 'Document compilation & submission to Customs', 'Liaison with Customs throughout review', 'Licence issued — ongoing compliance support'];
const STEPS_TC = ['初步諮詢及業務範圍評估', '草擬AML/CFT計劃及政策手冊', '適當人選聲明及背景調查', '準備營業地點視察', '文件整理及遞交海關', '審批期間與海關持續聯絡', '牌照發出 — 持續合規支援'];
const STEPS_SC = ['初步咨询及业务范围评估', '草拟AML/CFT计划及政策手册', '适当人选声明及背景调查', '准备营业地点视察', '文件整理及递交海关', '审批期间与海关持续联络', '牌照发出 — 持续合规支持'];

export default async function MsoNewApplicationPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';
  const waNum = await prisma.setting.findUnique({ where: { key: 'whatsapp_number' } }).catch(() => null);
  const waNumber = waNum?.value || '+85292318254';
  const waHref = `https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi，我想查詢MSO新牌照申請服務')}`;
  const faqs = isEn ? FAQ_EN : isSc ? FAQ_SC : FAQ_TC;
  const steps = isEn ? STEPS_EN : isSc ? STEPS_SC : STEPS_TC;

  return (
    <>
      <OrgJsonLd />
      <ServiceJsonLd
        name={isEn ? 'MSO New Licence Application Hong Kong' : 'MSO新牌照申請香港'}
        description={isEn ? 'Expert MSO new licence application service in Hong Kong — full document preparation, AML programme and Customs liaison.' : 'MSO新牌照申請服務，包括全套文件準備、AML計劃及海關聯絡。'}
        url="/mso/new-application"
      />
      <BreadcrumbJsonLd items={[
        { name: isEn ? 'Home' : '主頁', item: 'https://www.sandbox.ceo' },
        { name: isEn ? 'MSO Licensing' : 'MSO牌照', item: 'https://www.sandbox.ceo/mso' },
        { name: isEn ? 'New Application' : isEn ? 'New Application' : '新牌申請', item: 'https://www.sandbox.ceo/mso/new-application' },
      ]} />
      <FaqPageJsonLd faqs={faqs} />
      <SiteHeader locale={locale} waNumber={waNumber} />
      <main>
        {/* Hero */}
        <div style={{ background: '#0F2557', padding: '56px 0', position: 'relative', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1507941097613-9f2157b69235?w=1600&q=80" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 48%', zIndex: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg,rgba(9,26,62,.94) 0%,rgba(9,26,62,.86) 55%,rgba(9,26,62,.5) 100%)', zIndex: 1 }} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 10 }}>
              SANDBOX MSO
            </p>
            <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff', letterSpacing: '.02em', marginBottom: 8 }}>
              {isEn ? 'MSO New Licence Application' : isSc ? 'MSO新牌照申请' : 'MSO新牌照申請'}
            </h1>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '1rem', color: '#C9A84C', fontWeight: 700, marginBottom: 10 }}>
              {isEn ? 'Money Service Operator — Hong Kong Customs' : isSc ? '金钱服务经营者牌照 — 香港海关' : '金錢服務經營者牌照 — 香港海關'}
            </p>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: 'rgba(255,255,255,.6)', maxWidth: 560, lineHeight: 1.85 }}>
              {isEn
                ? 'Full-service MSO new licence application — from AML programme drafting to Customs submission and liaison. Led by former Customs-approved compliance professionals.'
                : isSc
                ? '全套MSO新牌照申请服务，由草拟AML计划至递交海关及联络，由前海关认可合规从业员领导。'
                : '全套MSO新牌照申請服務，由草擬AML計劃至遞交海關及聯絡，由前海關認可合規從業員領導。'}
            </p>
          </div>
        </div>

        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'start' }} className="mso-new-grid">

            {/* Main content */}
            <div>
              {/* Key facts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
                {[
                  { label: isEn ? 'Approval Time' : isSc ? '审批期' : '審批期', value: '3–6 months' },
                  { label: isEn ? 'Gov. Fee' : isSc ? '政府费用' : '政府費用', value: 'HK$2,770' },
                  { label: isEn ? 'Regulator' : isSc ? '监管机构' : '監管機構', value: isEn ? 'HK Customs' : '香港海關' },
                ].map(f => (
                  <div key={f.label} style={{ border: '1px solid #E2E8F0', padding: 20, background: '#F8FAFC', borderTop: '3px solid #0F2557' }}>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 8 }}>{f.label}</div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#0F2557' }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Who needs MSO */}
              <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#0F2557', marginBottom: 16 }}>
                {isEn ? 'Who Needs an MSO Licence?' : isSc ? '谁需要MSO牌照？' : '誰需要MSO牌照？'}
              </h2>
              <div style={{ border: '1px solid #E2E8F0', marginBottom: 32 }}>
                {[
                  isEn ? 'Currency exchange businesses' : isSc ? '货币兑换商' : '貨幣兌換商',
                  isEn ? 'Remittance / money transfer operators' : isSc ? '汇款/资金转移服务商' : '匯款／資金轉移服務商',
                  isEn ? 'Cross-border payment platforms' : isSc ? '跨境支付平台' : '跨境支付平台',
                  isEn ? 'Cryptocurrency OTC or exchange operators (may also need VASP)' : isSc ? '加密货币OTC或交易所（可能同时需要VASP牌照）' : '加密貨幣OTC或交易所（可能同時需要VASP牌照）',
                  isEn ? 'Fintech firms handling cross-border fund flows' : isSc ? '处理跨境资金流动的金融科技公司' : '處理跨境資金流動的金融科技公司',
                ].map((item, i, arr) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <span style={{ color: '#EF4444', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155' }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Application process */}
              <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#0F2557', marginBottom: 16 }}>
                {isEn ? 'Our Application Process' : isSc ? '我们的申请流程' : '我們的申請流程'}
              </h2>
              <div style={{ background: '#091A3E', padding: 24, marginBottom: 32 }}>
                {steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < steps.length - 1 ? 16 : 0 }}>
                    <div style={{ width: 24, height: 24, background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, color: '#fff' }}>{i + 1}</div>
                    <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.6, paddingTop: 3 }}>{step}</div>
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
                  {isEn ? 'Free MSO Application Consultation' : isSc ? '免费MSO申请咨询' : '免費MSO申請諮詢'}
                </h3>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.7, marginBottom: 16 }}>
                  {isEn ? 'Get a free initial assessment of your MSO application eligibility and timeline.' : isSc ? '免费初步评估您的MSO申请资格及时间表。' : '免費初步評估您的MSO申請資格及時間表。'}
                </p>
                <a href={waHref} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', color: '#EF4444', padding: '12px 16px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', textDecoration: 'none', width: '100%' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  {isEn ? 'WhatsApp Free Consult' : isSc ? 'WhatsApp 免费咨询' : 'WhatsApp 免費諮詢'}
                </a>
              </div>
              <div style={{ border: '1px solid #E2E8F0', marginBottom: 20 }}>
                <div style={{ background: '#0F2557', padding: '12px 16px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>
                  {isEn ? 'Related Services' : isSc ? '相关服务' : '相關服務'}
                </div>
                <div style={{ padding: 16 }}>
                  {[
                    { href: '/mso', label: isEn ? 'MSO Overview' : 'MSO牌照概覽' },
                    { href: '/mso/renewal', label: isEn ? 'MSO Licence Renewal' : 'MSO牌照續期' },
                    { href: '/compliance', label: isEn ? 'AML Compliance' : 'AML合規' },
                    { href: '/tech', label: isEn ? 'AML System Setup' : 'AML系統設置' },
                    { href: '/corporate', label: isEn ? 'Company Incorporation' : '公司成立' },
                  ].map(link => (
                    <a key={link.href} href={link.href} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: '#0F2557', textDecoration: 'none' }}>
                      <span style={{ color: '#C9A84C' }}>›</span> {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <InquiryForm locale={locale} sourcePage="mso-new-application" waNumber={waNumber} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} waNumber={waNumber} />
      <style>{`
        @media (max-width: 768px) {
          .mso-new-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
