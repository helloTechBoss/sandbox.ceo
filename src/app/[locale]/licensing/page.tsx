export const dynamic = 'force-dynamic';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SubTabNav from '@/components/SubTabNav';
import FaqAccordion from '@/components/FaqAccordion';
import InquiryForm from '@/components/InquiryForm';
import { prisma } from '@/lib/prisma';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

function SvcItem({ icon, title, enSub, desc }: { icon: React.ReactNode; title: string; enSub: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '20px 22px', marginBottom: 2 }}>
      <div style={{ width: 40, height: 40, background: '#0F2557', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
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
  const isSc = locale === 'zh-Hans';
  const isEn = locale === 'en';
  return (
    <div style={{ background: '#091A3E', padding: 24 }}>
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

export default async function LicensingPage({
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

  const waNum = await prisma.setting.findUnique({ where: { key: 'whatsapp_number' } }).catch(() => null);
  const waNumber = waNum?.value || '+85292318254';

  const waMessages: Record<string, string> = {
    overview: 'Hi，我想查詢牌照申請服務',
    sfc: 'Hi，我想查詢SFC牌照申請',
    'hk-other': 'Hi，我想查詢香港牌照申請',
    overseas: 'Hi，我想查詢美國MSB/MTL牌照',
  };
  const waMsg = waMessages[activeTab] || waMessages.overview;
  const waHref = `https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent(waMsg)}`;

  const tabs = [
    { key: 'overview', label: isEn ? 'Overview' : isSc ? '概览' : '概覽' },
    { key: 'sfc', label: isEn ? 'SFC Licence' : isSc ? 'SFC 牌照' : 'SFC 牌照' },
    { key: 'hk-other', label: isEn ? 'HK Other' : isSc ? '香港其他' : '香港其他牌照' },
    { key: 'overseas', label: isEn ? 'Overseas' : isSc ? '海外' : '海外牌照' },
  ];

  const docIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  );

  return (
    <>
      <SiteHeader locale={locale} waNumber={waNumber} />
      <main>
        <div style={{ background: '#0F2557', padding: '56px 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 10 }}>
              {isEn ? 'LICENSING' : isSc ? '牌照申请' : '牌照申請'}
            </p>
            <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff', letterSpacing: '.02em', marginBottom: 8 }}>
              {isEn ? 'Licensing Application Services' : isSc ? '牌照申请服务' : '牌照申請服務'}
            </h1>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '1rem', color: '#C9A84C', fontWeight: 700, marginBottom: 10 }}>
              {isEn ? 'Multi-Jurisdiction Expertise' : isSc ? '多司法管辖区经验' : '多司法管轄區經驗'}
            </p>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: 'rgba(255,255,255,.6)', maxWidth: 560, lineHeight: 1.85 }}>
              {isEn
                ? 'Cross-border business expansion requires licences across multiple jurisdictions. Our team has extensive multi-jurisdiction experience to help you operate legally in target markets with maximum efficiency.'
                : isSc
                ? '跨境业务扩展需要在多个司法管辖区取得牌照。我们的团队拥有丰富的多司法管辖区经验，帮助您以最高效率在目标市场合法运营。'
                : '跨境業務擴展需要在多個司法管轄區取得牌照。我們的團隊擁有豐富的多司法管轄區經驗，幫助您以最高效率在目標市場合法營運。'}
            </p>
          </div>
        </div>

        <SubTabNav tabs={tabs} activeTab={activeTab} />

        {activeTab === 'overview' && (
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
            <div style={{ borderLeft: '3px solid #EF4444', paddingLeft: 16, marginBottom: 40 }}>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#334155', lineHeight: 1.85 }}>
                {isEn
                  ? 'Cross-border business expansion requires licences across multiple jurisdictions. Our team has extensive multi-jurisdiction experience to help you operate legally in target markets with maximum efficiency.'
                  : isSc
                  ? '跨境业务扩展需要在多个司法管辖区取得牌照。我们的团队拥有丰富的多司法管辖区经验，帮助您以最高效率在目标市场合法运营。'
                  : '跨境業務擴展需要在多個司法管轄區取得牌照。我們的團隊擁有豐富的多司法管轄區經驗，幫助您以最高效率在目標市場合法營運。'}
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 40 }}>
              <OverviewCard
                tab="sfc"
                locale={locale}
                enTitle="SFC LICENCE"
                title={isEn ? 'SFC Licence' : isSc ? 'SFC 牌照申请' : 'SFC 牌照申請'}
                desc={isEn ? 'Type 1–9 regulated activities for Hong Kong investment firms.' : isSc ? '香港证券及期货业务Type 1–9监管活动牌照。' : '香港證券及期貨業務 Type 1–9 受規管活動牌照。'}
              />
              <OverviewCard
                tab="hk-other"
                locale={locale}
                enTitle="HK OTHER LICENCES"
                title={isEn ? 'Other HK Licences' : isSc ? '香港其他牌照' : '香港其他牌照'}
                desc={isEn ? 'DPMS, insurance intermediary, and money lenders licences.' : isSc ? 'DPMS、保险中介人及放债人牌照申请。' : 'DPMS、保險中介人及放債人牌照申請。'}
              />
              <OverviewCard
                tab="overseas"
                locale={locale}
                enTitle="OVERSEAS LICENSING"
                title={isEn ? 'Overseas Licensing' : isSc ? '海外牌照' : '海外牌照'}
                desc={isEn ? 'US MSB/MTL and Canada MSB registration for cross-border payment firms.' : isSc ? '美国MSB/MTL及加拿大MSB登记，适用于跨境支付公司。' : '美國 MSB/MTL 及加拿大 MSB 登記，適用於跨境支付公司。'}
              />
            </div>
            <div style={{ border: '1px solid #E2E8F0' }}>
              <div style={{ background: '#0F2557', padding: '12px 20px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#fff' }}>
                {isEn ? 'Client Types We Serve' : isSc ? '服务客户类型' : '服務客戶類型'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                {['SFC 持牌法團', 'MSO 持牌人', '保險中介人', '放債人', '跨境支付公司'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRight: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ color: '#EF4444', fontWeight: 700 }}>›</span>
                    <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: '#334155' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sfc' && (
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, padding: '60px 24px' }}>
            <div>
              <div style={{ borderLeft: '3px solid #EF4444', paddingLeft: 16, marginBottom: 32 }}>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#334155', lineHeight: 1.85 }}>
                  {isEn
                    ? 'SFC licences are required to conduct regulated financial investment activities in Hong Kong. The application process is rigorous, involving corporate structure review, responsible officer assessment, and business plan examination. It generally takes 6–12 months.'
                    : isSc
                    ? 'SFC 牌照是在香港从事受规管金融投资活动的必要条件。申请过程严格，涉及公司架构审查、负责人员评核及业务计划审查，一般需时 6–12 个月。'
                    : 'SFC 牌照是在香港從事受規管金融投資活動的必要條件。申請過程嚴格，涉及公司架構審查、負責人員評核及業務計劃審查，一般需時 6–12 個月。'}
                </p>
              </div>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#C9A84C', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                {isEn ? 'SFC REGULATED ACTIVITIES' : isSc ? 'SFC 受规管活动' : 'SFC 受規管活動'}
              </div>
              <SvcItem
                icon={docIcon}
                title={isEn ? 'Type 1 – Dealing in Securities' : isSc ? 'Type 1 证券交易' : 'Type 1 證券交易'}
                enSub="Type 1 – Dealing in Securities"
                desc={isEn ? 'For firms conducting securities dealing activities, including brokers and dealers.' : isSc ? '适用于从事证券交易活动的公司，包括经纪及交易商。' : '適用於從事證券交易活動的公司，包括經紀及交易商。'}
              />
              <SvcItem
                icon={docIcon}
                title={isEn ? 'Type 2 – Futures Contracts' : isSc ? 'Type 2 期货合约交易' : 'Type 2 期貨合約交易'}
                enSub="Type 2 – Dealing in Futures Contracts"
                desc={isEn ? 'For firms engaged in futures contracts dealing, including commodity and financial futures.' : isSc ? '适用于从事期货合约交易的公司，包括商品及金融期货。' : '適用於從事期貨合約交易的公司，包括商品及金融期貨。'}
              />
              <SvcItem
                icon={docIcon}
                title={isEn ? 'Type 4 – Advising on Securities' : isSc ? 'Type 4 就证券提供意见' : 'Type 4 就證券提供意見'}
                enSub="Type 4 – Advising on Securities"
                desc={isEn ? 'For firms providing investment advisory services on securities products.' : isSc ? '适用于就证券产品提供投资顾问服务的公司。' : '適用於就證券產品提供投資顧問服務的公司。'}
              />
              <SvcItem
                icon={docIcon}
                title={isEn ? 'Type 5 – Advising on Futures' : isSc ? 'Type 5 就期货合约提供意见' : 'Type 5 就期貨合約提供意見'}
                enSub="Type 5 – Advising on Futures Contracts"
                desc={isEn ? 'For firms providing advisory services on futures contracts and derivatives.' : isSc ? '适用于就期货合约及衍生工具提供顾问服务的公司。' : '適用於就期貨合約及衍生工具提供顧問服務的公司。'}
              />
              <SvcItem
                icon={docIcon}
                title={isEn ? 'Type 9 – Asset Management' : isSc ? 'Type 9 提供资产管理' : 'Type 9 提供資產管理'}
                enSub="Type 9 – Asset Management"
                desc={isEn ? 'For fund managers and discretionary portfolio managers managing client assets.' : isSc ? '适用于基金经理及酌情投资组合管理人管理客户资产。' : '適用於基金經理及酌情投資組合管理人管理客戶資產。'}
              />
            </div>
            <div>
              <ClientTypeBox
                title={isEn ? 'Who Needs SFC Licence' : isSc ? '哪些企业需要SFC牌照' : '哪些企業需要 SFC 牌照'}
                items={['證券經紀及交易商', '期貨經紀', '投資顧問公司', '基金管理公司', '資產管理公司']}
              />
              <ProcessBar
                locale={locale}
                steps={
                  isEn
                    ? ['Eligibility Assessment', 'Document Preparation', 'Submit to SFC', 'SFC Review', 'Licence Granted']
                    : isSc
                    ? ['资格评估', '文件准备', '递交 SFC', 'SFC 审查', '牌照获批']
                    : ['資格評估', '文件準備', '遞交 SFC', 'SFC 審查', '牌照獲批']
                }
              />
              <div style={{ marginTop: 16 }}>
                <WaCta href={waHref} label={isEn ? 'WhatsApp Us – SFC Licence' : isSc ? '立即 WhatsApp 查询 SFC 牌照' : '立即 WhatsApp 查詢 SFC 牌照'} />
              </div>
              <div style={{ border: '1px solid #E2E8F0' }}>
                <div style={{ background: '#0F2557', padding: '12px 16px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>
                  {isEn ? 'Frequently Asked Questions' : isSc ? '常见问题' : '常見問題'}
                </div>
                <FaqAccordion
                  faqs={[
                    {
                      question: isEn ? 'How long does SFC licence application take?' : isSc ? '申请SFC牌照需时多久？' : '申請SFC牌照需時多久？',
                      answer: isEn ? 'Generally 6–12 months, depending on the completeness of documents and the complexity of the applicant\'s background.' : isSc ? '一般需时6-12个月，视乎文件完整性及申请人背景复杂程度而定。' : '一般需時 6–12 個月，視乎文件完整性及申請人背景複雜程度而定。',
                    },
                    {
                      question: isEn ? 'What are the Responsible Officer requirements?' : isSc ? '负责人员有何要求？' : '負責人員有何要求？',
                      answer: isEn ? 'Responsible Officers must possess relevant qualifications and pass SFC\'s fit and proper assessment, demonstrating expertise in their area of regulated activity.' : isSc ? '负责人员须具备相关资历及通过SFC适当人选评核，证明其在受规管活动范围内具备专业知识。' : '負責人員須具備相關資歷及通過 SFC 適當人選評核，證明其在受規管活動範圍內具備專業知識。',
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hk-other' && (
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, padding: '60px 24px' }}>
            <div>
              <div style={{ borderLeft: '3px solid #EF4444', paddingLeft: 16, marginBottom: 32 }}>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#334155', lineHeight: 1.85 }}>
                  {isEn
                    ? 'Beyond SFC licences, Hong Kong has several industry-specific licensing regimes. We assist with Insurance Intermediary (IA), money lenders, and DPMS licence applications to ensure full compliance.'
                    : isSc
                    ? '除 SFC 牌照外，香港还有多个行业特定的牌照制度。我们协助申请保险中介人 (IA)、放债人及 DPMS 牌照，确保全面合规。'
                    : '除 SFC 牌照外，香港還有多個行業特定的牌照制度。我們協助申請保險中介人 (IA)、放債人及 DPMS 牌照，確保全面合規。'}
                </p>
              </div>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#C9A84C', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                {isEn ? 'LICENCE TYPES' : isSc ? '牌照类别' : '牌照類別'}
              </div>
              <SvcItem
                icon={docIcon}
                title={isEn ? 'DPMS – Precious Metals & Gemstones Registration' : isSc ? 'DPMS 贵金属及宝石商登记' : 'DPMS 貴金屬及寶石商登記'}
                enSub="DPMS – Dealers in Precious Metals and Stones"
                desc={isEn ? 'Required for dealers in precious metals, precious stones, or precious products under the AMLO.' : isSc ? '根据《打击洗钱条例》，从事贵金属、宝石或贵重产品交易的商户须进行登记。' : '根據《打擊洗錢條例》，從事貴金屬、寶石或貴重產品交易的商戶須進行登記。'}
              />
              <SvcItem
                icon={docIcon}
                title={isEn ? 'Insurance Intermediary Licence' : isSc ? '保险中介人牌照申请' : '保險中介人牌照申請'}
                enSub="Insurance Authority (IA) Licence"
                desc={isEn ? 'Individual and corporate licence applications for insurance agents and brokers regulated by the Insurance Authority.' : isSc ? '保险监管局监管下保险代理人及经纪公司的个人及公司牌照申请。' : '保險監管局監管下保險代理人及經紀公司的個人及公司牌照申請。'}
              />
              <SvcItem
                icon={docIcon}
                title={isEn ? 'Money Lenders Licence' : isSc ? '放债人牌照申请' : '放債人牌照申請'}
                enSub="Money Lenders Ordinance (Cap. 163)"
                desc={isEn ? 'Licence application under the Money Lenders Ordinance for companies engaging in money lending business in Hong Kong.' : isSc ? '根据《放债人条例》(第163章)，为在香港从事放债业务的公司申请牌照。' : '根據《放債人條例》(第 163 章)，為在香港從事放債業務的公司申請牌照。'}
              />
            </div>
            <div>
              <ClientTypeBox
                title={isEn ? 'Client Types' : isSc ? '服务客户' : '服務客戶'}
                items={
                  isEn
                    ? ['Precious Metals & Gems Dealers', 'Insurance Agents & Brokers', 'Money Lending Firms']
                    : ['貴金屬及寶石商', '保險代理及經紀', '放債業務公司']
                }
              />
              <ProcessBar
                locale={locale}
                steps={
                  isEn
                    ? ['Initial Consultation', 'Document Preparation', 'Application Submission', 'Regulatory Review', 'Licence Issued']
                    : isSc
                    ? ['初步咨询', '文件准备', '递交申请', '监管审查', '牌照发出']
                    : ['初步諮詢', '文件準備', '遞交申請', '監管審查', '牌照發出']
                }
              />
              <div style={{ marginTop: 16 }}>
                <WaCta href={waHref} label={isEn ? 'WhatsApp Us – HK Licences' : isSc ? '立即 WhatsApp 查询香港牌照' : '立即 WhatsApp 查詢香港牌照'} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overseas' && (
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, padding: '60px 24px' }}>
            <div>
              <div style={{ borderLeft: '3px solid #EF4444', paddingLeft: 16, marginBottom: 32 }}>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#334155', lineHeight: 1.85 }}>
                  {isEn
                    ? 'North America is one of the world\'s largest payment and remittance markets. Providing money services in the US or Canada requires federal MSB registration and state-by-state MTL licences.'
                    : isSc
                    ? '北美是全球最大的支付及汇款市场之一。在美国或加拿大提供货币服务需要联邦 MSB 登记及逐州 MTL 牌照。'
                    : '北美是全球最大的支付及匯款市場之一。在美國或加拿大提供貨幣服務需要聯邦 MSB 登記及逐州 MTL 牌照。'}
                </p>
              </div>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#C9A84C', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                {isEn ? 'OVERSEAS LICENCE SERVICES' : isSc ? '海外牌照服务' : '海外牌照服務'}
              </div>
              <SvcItem
                icon={docIcon}
                title={isEn ? 'US MSB Federal Registration (FinCEN)' : isSc ? '美国 MSB 联邦登记 (FinCEN)' : '美國 MSB 聯邦登記 (FinCEN)'}
                enSub="US MSB Registration – FinCEN"
                desc={isEn ? 'Mandatory federal registration for Money Services Businesses with FinCEN, the financial intelligence unit of the US Treasury.' : isSc ? '货币服务业务须向美国财政部金融情报部门FinCEN进行联邦强制登记。' : '貨幣服務業務須向美國財政部金融情報部門 FinCEN 進行聯邦強制登記。'}
              />
              <SvcItem
                icon={docIcon}
                title={isEn ? 'US Money Transmitter Licence (State-by-State)' : isSc ? '美国汇款牌照 MTL（逐州申请）' : '美國匯款牌照 MTL（逐州申請）'}
                enSub="US Money Transmitter Licence (MTL)"
                desc={isEn ? 'State-level MTL applications across all 50 US states. Requirements, fees, and timelines vary significantly by state.' : isSc ? '在美国50个州进行州级MTL申请。各州要求、费用及时间表差异显著。' : '在美國 50 個州進行州級 MTL 申請。各州要求、費用及時間表差異顯著。'}
              />
              <SvcItem
                icon={docIcon}
                title={isEn ? 'Canada MSB Registration (FINTRAC)' : isSc ? '加拿大 MSB 登记 (FINTRAC)' : '加拿大 MSB 登記 (FINTRAC)'}
                enSub="Canada MSB – FINTRAC"
                desc={isEn ? 'Registration with FINTRAC for money services businesses operating in Canada, covering currency exchange and funds transfer.' : isSc ? '在加拿大从事货币服务业务须向FINTRAC登记，涵盖货币兑换及资金转移。' : '在加拿大從事貨幣服務業務須向 FINTRAC 登記，涵蓋貨幣兌換及資金轉移。'}
              />
            </div>
            <div>
              <ClientTypeBox
                title={isEn ? 'Coverage' : isSc ? '覆盖范围' : '覆蓋範圍'}
                items={
                  isEn
                    ? ['All 50 US States MTL', 'Federal FinCEN Registration', 'Canada FINTRAC Registration']
                    : ['美國 50 個州 MTL', '聯邦 FinCEN 登記', '加拿大 FINTRAC']
                }
              />
              <ProcessBar
                locale={locale}
                steps={
                  isEn
                    ? ['Jurisdiction Assessment', 'Entity Setup', 'FinCEN Registration', 'State MTL Filing', 'Ongoing Compliance']
                    : isSc
                    ? ['司法管辖区评估', '实体设立', 'FinCEN 登记', '各州MTL申请', '持续合规']
                    : ['司法管轄區評估', '實體設立', 'FinCEN 登記', '各州 MTL 申請', '持續合規']
                }
              />
              <div style={{ marginTop: 16 }}>
                <WaCta href={waHref} label={isEn ? 'WhatsApp Us – MSB/MTL' : isSc ? '立即 WhatsApp 查询 MSB/MTL' : '立即 WhatsApp 查詢 MSB/MTL'} />
              </div>
              <div style={{ border: '1px solid #E2E8F0' }}>
                <div style={{ background: '#0F2557', padding: '12px 16px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>
                  {isEn ? 'FAQ' : isSc ? '常见问题' : '常見問題'}
                </div>
                <FaqAccordion
                  faqs={[
                    {
                      question: isEn ? 'What is the difference between US MSB and MTL?' : isSc ? '美国MSB和MTL有什么分别？' : '美國 MSB 和 MTL 有什麼分別？',
                      answer: isEn ? 'MSB is a federal-level registration with FinCEN required for all money services businesses. MTL (Money Transmitter Licence) is a state-level licence required in most states where you conduct business.' : isSc ? 'MSB是向FinCEN进行的联邦层面登记，所有货币服务业务均须登记。MTL（汇款牌照）是州级牌照，在大多数开展业务的州份均须申请。' : 'MSB 是向 FinCEN 進行的聯邦層面登記，所有貨幣服務業務均須登記。MTL（匯款牌照）是州級牌照，在大多數開展業務的州份均須申請。',
                    },
                    {
                      question: isEn ? 'How long does a US MTL application take?' : isSc ? '申请美国MTL需要多长时间？' : '申請美國 MTL 需要多長時間？',
                      answer: isEn ? 'Timelines vary by state, ranging from 3 months to over 18 months. States like New York and California are known for longer review periods. We advise prioritising key states first.' : isSc ? '时间因州而异，从3个月到18个月以上不等。纽约和加州以审查周期较长著称。我们建议优先申请重点州份。' : '時間因州而異，從 3 個月到 18 個月以上不等。紐約及加州以審查周期較長著稱。我們建議優先申請重點州份。',
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        <section style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', padding: '80px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1.3rem', color: '#0F2557', marginBottom: 6 }}>
              {isEn ? 'Submit an Enquiry' : isSc ? '提交查询' : '提交查詢'}
            </h2>
            <div style={{ width: 44, height: 3, background: '#C9A84C', margin: '12px 0 32px' }} />
            <InquiryForm locale={locale} sourcePage="licensing" waNumber={waNumber} />
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} waNumber={waNumber} />
    </>
  );
}
