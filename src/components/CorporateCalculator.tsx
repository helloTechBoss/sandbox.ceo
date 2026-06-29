'use client';
import { useState, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
type Locale = 'zh-Hant' | 'en' | 'zh-Hans';
type LK = 'tc' | 'en' | 'sc';

// ─── Pricing data (fixed: 20_50 now includes 1000) ───────────────────────────
const C_BASE: Record<string, { type?: string; fee?: number; [k: number]: number }> = {
  none_op: { type: 'fixed', fee: 2960 },
  zero:    { type: 'fixed', fee: 2520 },
  '1_2':   { 200: 3980, 500: 4200, 800: 4530, 1000: 4750 },
  '2_5':   { 200: 4310, 500: 4530, 800: 4860, 1000: 5080 },
  '5_10':  { 200: 4750, 500: 4970, 800: 5300, 1000: 5520 },
  '10_20': { 200: 5410, 500: 5630, 800: 5960, 1000: 6180 },
  '20_50': { 200: 5850, 500: 6400, 800: 7170, 1000: 7950 }, // fixed: was missing 1000
  '50_100':  { type: 'fixed', fee: 10470 },
  '100_200': { type: 'negotiable' },
};

const REV: Record<LK, [string, string][]> = {
  tc: [['none_op','無業務（≤5年）'],['zero','零申報（休眠公司）'],['1_2','港元 1M – 2M'],['2_5','港元 2M – 5M'],['5_10','港元 5M – 10M'],['10_20','港元 10M – 20M'],['20_50','港元 20M – 50M'],['50_100','港元 50M – 100M'],['100_200','港元 100M – 200M']],
  en: [['none_op','No Operation (≤5 yrs)'],['zero','Zero Filing (Dormant)'],['1_2','HKD 1M – 2M'],['2_5','HKD 2M – 5M'],['5_10','HKD 5M – 10M'],['10_20','HKD 10M – 20M'],['20_50','HKD 20M – 50M'],['50_100','HKD 50M – 100M'],['100_200','HKD 100M – 200M']],
  sc: [['none_op','无业务（≤5年）'],['zero','零申报（休眠公司）'],['1_2','港元 1M – 2M'],['2_5','港元 2M – 5M'],['5_10','港元 5M – 10M'],['10_20','港元 10M – 20M'],['20_50','港元 20M – 50M'],['50_100','港元 50M – 100M'],['100_200','港元 100M – 200M']],
};

const TXN: Record<LK, [number, string][]> = {
  tc: [[200,'≤ 200 宗交易'],[500,'201–500 宗交易'],[800,'501–800 宗交易'],[1000,'801–1,000 宗交易']],
  en: [[200,'≤ 200 transactions'],[500,'201–500 transactions'],[800,'501–800 transactions'],[1000,'801–1,000 transactions']],
  sc: [[200,'≤ 200 宗交易'],[500,'201–500 宗交易'],[800,'501–800 宗交易'],[1000,'801–1,000 宗交易']],
};

const EXT: Record<LK, string[]> = {
  tc: ['投資收益／財富管理帳戶收益','股票、基金、加密貨幣或其他金融資產交易','固定資產','無形資產','附屬公司或聯營公司','多層公司架構','股東或關聯方貸款','存貨／庫存管理','電商會計（Shopify、Amazon、淘寶等）','薪酬及強積金處理','其他複雜會計安排'],
  en: ['Investment income / wealth management income','Stocks, funds, crypto or other financial assets','Fixed assets','Intangible assets','Subsidiaries or associated companies','Multi-layer company structure','Shareholder or related-party loans','Inventory / stock management','E-commerce (Shopify, Amazon, Taobao, etc.)','Payroll and MPF handling','Other complex accounting arrangements'],
  sc: ['投资收益／财富管理账户收益','股票、基金、加密货币或其他金融资产交易','固定资产','无形资产','附属公司或联营公司','多层公司架构','股东或关联方贷款','存货／库存管理','电商会计（Shopify、Amazon、淘宝等）','薪酬及强积金处理','其他复杂会计安排'],
};

// ─── Services data ───────────────────────────────────────────────────────────
interface Svc {
  p: string; pc: string; code: string;
  nameTc: string; nameEn: string; nameSc: string;
  price: string; popular?: boolean;
}
const SVCS: Svc[] = [
  {p:'A',pc:'pillar-a',code:'INC_BASIC',nameTc:'香港有限公司成立（基礎）',nameEn:'HK Ltd Co. Formation (Basic)',nameSc:'香港有限公司成立（基础）',price:'HK$1,800'},
  {p:'A',pc:'pillar-a',code:'INC_FULL',nameTc:'公司成立 + 首年秘書 + 商業登記',nameEn:'Incorporation + 1st Year Sec + BR',nameSc:'公司成立 + 首年秘书 + 商业登记',price:'HK$3,200',popular:true},
  {p:'A',pc:'pillar-a',code:'INC_PREM',nameTc:'公司成立（高級套餐）',nameEn:'Incorporation Premium Package',nameSc:'公司成立（高级套餐）',price:'HK$5,500'},
  {p:'A',pc:'pillar-a',code:'DEREG',nameTc:'公司結業 / 撤銷登記',nameEn:'Deregistration / Strike Off',nameSc:'公司注销 / 撤销登记',price:'HK$3,500'},
  {p:'B',pc:'pillar-b',code:'COSEC_BASIC',nameTc:'公司秘書（基礎月費計劃）',nameEn:'Company Secretary (Basic Monthly)',nameSc:'公司秘书（基础月费计划）',price:'HK$350/月',popular:true},
  {p:'B',pc:'pillar-b',code:'COSEC_ELITE',nameTc:'公司秘書（精英月費計劃）',nameEn:'Company Secretary (Elite Monthly)',nameSc:'公司秘书（精英月费计划）',price:'HK$680/月'},
  {p:'B',pc:'pillar-b',code:'COSEC_PREM',nameTc:'公司秘書（高級月費計劃）',nameEn:'Company Secretary (Premium Monthly)',nameSc:'公司秘书（高级月费计划）',price:'HK$1,200/月'},
  {p:'B',pc:'pillar-b',code:'AR',nameTc:'周年申報表遞交',nameEn:'Annual Return Filing (NAR1)',nameSc:'周年申报表递交',price:'HK$800'},
  {p:'B',pc:'pillar-b',code:'BR_RENEW',nameTc:'商業登記證年期更新',nameEn:'Business Registration Renewal',nameSc:'商业登记证续期',price:'HK$600'},
  {p:'C',pc:'pillar-c',code:'BOOKKEEP',nameTc:'每月簿記服務',nameEn:'Monthly Bookkeeping Service',nameSc:'每月记账服务',price:'HK$168/月起'},
  {p:'C',pc:'pillar-c',code:'FINSTAT',nameTc:'年度財務報表',nameEn:'Annual Financial Statements',nameSc:'年度财务报表',price:'HK$3,500起'},
  {p:'C',pc:'pillar-c',code:'TAX_AGENT',nameTc:'稅務代理服務',nameEn:'Tax Representative Service',nameSc:'税务代理服务',price:'HK$800/年'},
  {p:'D',pc:'pillar-d',code:'AUDIT_BASIC',nameTc:'審計 + 報稅（不含簿記）',nameEn:'Audit + Tax Filing (No Bookkeeping)',nameSc:'审计 + 报税（不含记账）',price:'HK$5,800'},
  {p:'D',pc:'pillar-d',code:'AUDIT_FULL',nameTc:'簿記 + 審計 + 報稅（完整）',nameEn:'Bookkeeping + Audit + Tax Filing (Full)',nameSc:'记账 + 审计 + 报税（完整）',price:'HK$7,800',popular:true},
  {p:'D',pc:'pillar-d',code:'AUDIT_SME',nameTc:'純審計安排（中小企CPA）',nameEn:'Audit Arrangement Only (SME CPA)',nameSc:'纯审计安排（中小企CPA）',price:'HK$3,999起'},
  {p:'E',pc:'pillar-e',code:'TAX_FILING',nameTc:'利得稅報稅表申報',nameEn:'Profits Tax Return Filing',nameSc:'利得税报税表申报',price:'HK$2,500起'},
  {p:'E',pc:'pillar-e',code:'TAX_OFFSHORE',nameTc:'境外收入豁免申請',nameEn:'Offshore Tax Exemption Application',nameSc:'境外收入豁免申请',price:'HK$8,000起'},
  {p:'E',pc:'pillar-e',code:'TAX_ADVISORY',nameTc:'稅務規劃及顧問',nameEn:'Tax Planning & Advisory',nameSc:'税务规划及顾问',price:'詢價'},
  {p:'F',pc:'pillar-f',code:'VO',nameTc:'虛擬辦公室及註冊地址',nameEn:'Virtual Office & Registered Address',nameSc:'虚拟办公室及注册地址',price:'HK$800/年'},
  {p:'F',pc:'pillar-f',code:'MAIL',nameTc:'郵件處理及轉發',nameEn:'Mail Handling & Forwarding',nameSc:'邮件处理及转发',price:'HK$1,200/年'},
  {p:'F',pc:'pillar-f',code:'MEETING',nameTc:'會議室（日票）',nameEn:'Meeting Room (Day Pass)',nameSc:'会议室（日票）',price:'HK$500/天'},
  {p:'G',pc:'pillar-g',code:'F_SCR',nameTc:'重要控制人登記冊',nameEn:'Significant Controllers Register (SCR)',nameSc:'重要控制人登记册',price:'HK$800'},
  {p:'G',pc:'pillar-g',code:'F_BRANCH',nameTc:'分行註冊',nameEn:'Branch Office Registration',nameSc:'分行注册',price:'HK$1,500'},
  {p:'G',pc:'pillar-g',code:'F_CO_RENAME',nameTc:'公司更名',nameEn:'Company Name Change',nameSc:'公司更名',price:'HK$1,200'},
  {p:'G',pc:'pillar-g',code:'F_NOTARY',nameTc:'國際公證 + 高等法院加簽',nameEn:'International Notarisation + Apostille',nameSc:'国际公证 + 高等法院加签',price:'詢價'},
  {p:'G',pc:'pillar-g',code:'F_TRADEMARK',nameTc:'香港商標註冊',nameEn:'Hong Kong Trademark Registration',nameSc:'香港商标注册',price:'詢價'},
  {p:'G',pc:'pillar-g',code:'F_BUSCAP',nameTc:'增加註冊股本',nameEn:'Increase Registered Share Capital',nameSc:'增加注册股本',price:'HK$800'},
  {p:'H',pc:'pillar-h',code:'G_HKTP',nameTc:'高端人才通行證計劃（TTPS）',nameEn:'Top Talent Pass Scheme (TTPS)',nameSc:'高端人才通行证计划（TTPS）',price:'詢價'},
  {p:'H',pc:'pillar-h',code:'G_QMAS',nameTc:'優質移民入境計劃（QMAS）',nameEn:'Quality Migrant Admission Scheme (QMAS)',nameSc:'优才计划（QMAS）',price:'詢價'},
  {p:'H',pc:'pillar-h',code:'G_IANG',nameTc:'輸入內地人才計劃（IANG）',nameEn:'Admission of Mainland Talents (IANG)',nameSc:'输入内地人才计划（IANG）',price:'詢價'},
  {p:'H',pc:'pillar-h',code:'G_RENEWAL',nameTc:'簽證 / 許可証續期',nameEn:'Visa / Permit Renewal',nameSc:'签证 / 许可证续期',price:'詢價'},
];

const PILLAR_NAMES: Record<LK, Record<string, string>> = {
  tc: {A:'公司成立',B:'公司秘書',C:'會計',D:'審計',E:'稅務',F:'商務中心',G:'企業服務',H:'簽證及移民'},
  en: {A:'Company Formation',B:'Company Secretary',C:'Accounting',D:'Audit',E:'Tax Advisory',F:'Business Centre',G:'Other Corp Services',H:'Visa & Immigration'},
  sc: {A:'公司成立',B:'公司秘书',C:'会计',D:'审计',E:'税务',F:'商务中心',G:'企业服务',H:'签证及移民'},
};

// ─── i18n helper ─────────────────────────────────────────────────────────────
function lkOf(locale: Locale): LK {
  return locale === 'en' ? 'en' : locale === 'zh-Hans' ? 'sc' : 'tc';
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CorporateCalculator({ locale, waNumber }: { locale: Locale; waNumber: string }) {
  const lk = lkOf(locale);
  const isEn = lk === 'en';
  const isSc = lk === 'sc';
  const waBase = `https://wa.me/${waNumber.replace(/\D/g, '')}`;

  // calculator state
  const [rev, setRev] = useState('none_op');
  const [txn, setTxn] = useState(200);
  const [banks, setBanks] = useState(1);
  const [extState, setExtState] = useState<boolean[]>(new Array(11).fill(false));

  const toggleExt = useCallback((i: number) => {
    setExtState(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  }, []);

  // ─── Calculator output ───────────────────────────────────────────────────
  const pkg = C_BASE[rev];
  const isFixed = pkg.type === 'fixed';
  const isNegot = pkg.type === 'negotiable';
  const noTxn = isFixed || isNegot;
  const base = isNegot ? 0 : isFixed ? (pkg.fee ?? 0) : (pkg[txn] ?? pkg[200] ?? 0);
  const extCnt = extState.filter(Boolean).length;
  const bankFee = (banks - 1) * 500;
  const extFee = extCnt * 500;
  const total = isNegot ? null : base + bankFee + extFee;
  const pre = isEn ? 'HKD ' : '港元 ';
  const totalStr = total === null
    ? (isEn ? 'Contact us for quotation' : isSc ? '请联络我们获取报价' : '請聯絡我們獲取報價')
    : `${pre}${total.toLocaleString()}`;

  const revLabel = (REV[lk].find(r => r[0] === rev) || ['', ''])[1];
  const txnLabel = (TXN[lk].find(r => r[0] === txn) || [0, ''])[1] as string;
  const extItems = (EXT[lk]).filter((_, i) => extState[i]);

  // ─── Dynamic WhatsApp URL for calculator CTA ─────────────────────────────
  const calcWaText = [
    isEn ? 'Hi Sandbox Corporate, I would like a quotation for accounting & audit services:' :
    isSc ? 'Hi Sandbox Corporate，我想查询会计及审计服务报价：' :
    'Hi Sandbox Corporate，我想查詢會計及審計服務報價：',
    `${isEn ? 'Revenue' : '年營業額'}：${revLabel}`,
    noTxn ? '' : `${isEn ? 'Transactions' : '年交易量'}：${txnLabel}`,
    `${isEn ? 'Bank accounts' : '銀行帳戶'}：${banks}`,
    extCnt > 0 ? `${isEn ? 'Complexity items' : '複雜項目'}：${extItems.join('、')}` : '',
    `${isEn ? 'Estimated fee' : '估計費用'}：${totalStr}`,
  ].filter(Boolean).join('\n');
  const calcWaHref = `${waBase}?text=${encodeURIComponent(calcWaText)}`;

  // ─── Service card WhatsApp message ───────────────────────────────────────
  function svcWaHref(svc: Svc) {
    const name = lk === 'en' ? svc.nameEn : lk === 'sc' ? svc.nameSc : svc.nameTc;
    const msg = isEn
      ? `Hi Sandbox Corporate, I would like a quotation for: ${name} (${svc.price})`
      : isSc
      ? `Hi Sandbox Corporate，我想查询以下服务的报价：${name}（${svc.price}）`
      : `Hi Sandbox Corporate，我想查詢以下服務的報價：${name}（${svc.price}）`;
    return `${waBase}?text=${encodeURIComponent(msg)}`;
  }

  const pillars = ['A','B','C','D','E','F','G','H'];
  const pnames = PILLAR_NAMES[lk];

  const pillarColors: Record<string, string> = {
    A: '#0F2557', B: '#1a3a7a', C: '#1e4d99', D: '#2563eb',
    E: '#7c3aed', F: '#9333ea', G: '#C9A84C', H: '#EF4444',
  };

  return (
    <>
      <main>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section style={{ background: '#0F2557', position: 'relative', padding: '64px 0 56px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)', backgroundSize: '48px 48px', zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 10 }}>
              SANDBOX CORPORATE · Division 04
            </p>
            <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#fff', letterSpacing: '.03em', lineHeight: 1.05, marginBottom: 12 }}>
              SANDBOX<br /><span style={{ color: '#EF4444' }}>CORPORATE</span>
            </h1>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#C9A84C', marginBottom: 10 }}>
              {isEn ? 'All-in-one Corporate Services · Transparent Pricing · Instant Quote' : isSc ? '一站式企业服务 · 费用透明 · 即时报价' : '一站式企業服務 · 費用透明 · 即時報價'}
            </p>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', color: 'rgba(255,255,255,.6)', maxWidth: 560, lineHeight: 1.85, marginBottom: 28 }}>
              {isEn
                ? 'Company formation, company secretary, accounting & audit, tax advisory, visa and banking introduction — all under one roof, led by former compliance officers.'
                : isSc
                ? '从公司成立、公司秘书、会计审计、税务规划、签证到银行开户介绍，一站式企业服务，由前合规主管领导。'
                : '從公司成立、公司秘書、會計審計、稅務規劃、簽證到銀行開戶介紹，一站式企業服務，由前合規主管領導。'}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="#calc-section" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EF4444', color: '#fff', padding: '12px 22px', fontFamily: "'Montserrat',sans-serif", fontSize: '.78rem', fontWeight: 700, letterSpacing: '.06em', textDecoration: 'none', textTransform: 'uppercase', borderRadius: 2 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 9h2v4M14 9h2M14 13h2"/></svg>
                {isEn ? 'Instant Fee Estimate' : isSc ? '即时费用估算' : '即時費用估算'}
              </a>
              <a href={`${waBase}?text=${encodeURIComponent(isEn ? 'Hi Sandbox Corporate, I would like to enquire about your services.' : 'Hi Sandbox Corporate，我想查詢企業服務。')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#fff', padding: '12px 22px', fontFamily: "'Montserrat',sans-serif", fontSize: '.78rem', fontWeight: 700, letterSpacing: '.06em', textDecoration: 'none', textTransform: 'uppercase', border: '1.5px solid rgba(255,255,255,.3)', borderRadius: 2 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M11.999 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.86 1.428 5.492L2 22l4.641-1.395C8.26 21.468 10.093 22 12 22c5.523 0 10-4.483 10-10.003C22 6.484 17.523 2 12 2z"/></svg>
                {isEn ? 'WhatsApp Enquiry' : isSc ? 'WhatsApp 查询' : 'WhatsApp 查詢'}
              </a>
            </div>
            <div style={{ display: 'flex', gap: 1, marginTop: 40, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.12)', maxWidth: 400 }}>
              {[
                { num: '40+', label: isEn ? 'Services' : isSc ? '企业服务' : '企業服務' },
                { num: '10+', label: isEn ? 'Years Exp.' : isSc ? '年行业经验' : '年行業經驗' },
                { num: 'TCSP', label: isEn ? 'Licensed' : isSc ? '持牌' : '持牌' },
              ].map(s => (
                <div key={s.num} style={{ background: 'rgba(9,26,62,.6)', padding: '16px 20px', textAlign: 'center', flex: 1 }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#fff', lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.72rem', color: '#94A3B8', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CALCULATOR ───────────────────────────────────────────────────── */}
        <section id="calc-section" style={{ background: '#091A3E', padding: '64px 0', scrollMarginTop: 72 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 10 }}>
              {isEn ? 'Fee Calculator' : isSc ? '费用计算器' : '費用計算器'}
            </p>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#fff', marginBottom: 8 }}>
              {isEn ? 'Accounting, Audit & Tax — Instant Fee Estimate' : isSc ? '会计、审计及税务费用即时估算' : '會計、審計及稅務費用即時估算'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: 'rgba(255,255,255,.5)', marginBottom: 40, maxWidth: 560 }}>
              {isEn ? 'Select your revenue, transaction volume and complexity items to see an instant estimate.' : isSc ? '选择年营业额、交易量及复杂项目，即时查看估算费用。' : '選擇年營業額、交易量及複雜項目，即時查看估算費用。'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }} className="calc-grid-2col">
              {/* Left inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Revenue + Transactions */}
                <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', padding: 24 }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 16 }}>
                    {isEn ? 'Company Profile' : isSc ? '公司资料' : '公司資料'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="calc-rev-txn">
                    <div>
                      <label style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.8rem', color: 'rgba(255,255,255,.65)', display: 'block', marginBottom: 8 }}>
                        {isEn ? 'Annual Revenue' : isSc ? '年营业额' : '年營業額'}
                      </label>
                      <select value={rev} onChange={e => setRev(e.target.value)} style={{ width: '100%', background: '#0F2557', color: '#fff', border: '1px solid rgba(255,255,255,.25)', padding: '10px 12px', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', borderRadius: 2, cursor: 'pointer' }}>
                        {REV[lk].map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                      </select>
                    </div>
                    <div style={{ opacity: noTxn ? 0.35 : 1, pointerEvents: noTxn ? 'none' : 'auto' }}>
                      <label style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.8rem', color: 'rgba(255,255,255,.65)', display: 'block', marginBottom: 8 }}>
                        {isEn ? 'Annual Transactions' : isSc ? '年交易量' : '年交易量'}
                      </label>
                      <select value={txn} onChange={e => setTxn(Number(e.target.value))} style={{ width: '100%', background: '#0F2557', color: '#fff', border: '1px solid rgba(255,255,255,.25)', padding: '10px 12px', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', borderRadius: 2, cursor: 'pointer' }}>
                        {TXN[lk].map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bank accounts */}
                <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', padding: 24 }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 16 }}>
                    {isEn ? 'Bank Accounts' : isSc ? '银行账户' : '銀行帳戶'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid rgba(255,255,255,.25)', borderRadius: 2 }}>
                      <button onClick={() => setBanks(b => Math.max(1, b - 1))} style={{ width: 36, height: 36, background: 'rgba(255,255,255,.1)', color: '#fff', border: 'none', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer' }}>−</button>
                      <span style={{ minWidth: 40, textAlign: 'center', fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#fff', padding: '0 4px' }}>{banks}</span>
                      <button onClick={() => setBanks(b => b + 1)} style={{ width: 36, height: 36, background: 'rgba(255,255,255,.1)', color: '#fff', border: 'none', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer' }}>+</button>
                    </div>
                    <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.8rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>
                      {isEn ? <>1st account included. Each extra: <strong style={{ color: '#C9A84C' }}>+HKD 500</strong></> : isSc ? <>基本费用已含一个账户。每个额外账户：<strong style={{ color: '#C9A84C' }}>+港元 500</strong></> : <>基本費用已含一個帳戶。每個額外帳戶：<strong style={{ color: '#C9A84C' }}>+港元 500</strong></>}
                    </p>
                  </div>
                </div>

                {/* Complexity items */}
                <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', padding: 24 }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 6 }}>
                    {isEn ? 'Accounting Complexity Items' : isSc ? '额外会计复杂项目' : '額外會計複雜項目'}
                  </div>
                  <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.75rem', color: 'rgba(255,255,255,.38)', marginBottom: 14 }}>
                    {isEn ? <>Each selected item: <strong style={{ color: '#E8D28A' }}>+HKD 500</strong></> : <>每個選定項目增加 <strong style={{ color: '#E8D28A' }}>港元 500</strong></>}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }} className="ext-grid">
                    {EXT[lk].map((label, i) => (
                      <label key={i} onClick={() => toggleExt(i)} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '9px 12px', background: extState[i] ? 'rgba(201,168,76,.15)' : 'rgba(255,255,255,.04)', border: `1px solid ${extState[i] ? '#C9A84C' : 'rgba(255,255,255,.12)'}`, cursor: 'pointer', borderRadius: 2, transition: 'all .15s' }}>
                        <div style={{ width: 16, height: 16, border: `2px solid ${extState[i] ? '#C9A84C' : 'rgba(255,255,255,.35)'}`, background: extState[i] ? '#C9A84C' : 'transparent', borderRadius: 2, flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {extState[i] && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0F2557" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.78rem', color: extState[i] ? '#E8D28A' : 'rgba(255,255,255,.65)', lineHeight: 1.4 }}>{label}</span>
                        {extState[i] && <span style={{ marginLeft: 'auto', fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, color: '#C9A84C', flexShrink: 0 }}>+500</span>}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right summary */}
              <div style={{ background: '#0F2557', border: '1px solid rgba(201,168,76,.3)', padding: 28, position: 'sticky', top: 80 }}>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,.1)' }}>
                  {isEn ? 'Fee Estimate Summary' : isSc ? '费用估算摘要' : '費用估算摘要'}
                </div>
                {/* Rows */}
                {[
                  [isEn ? 'Revenue' : isSc ? '年营业额' : '年營業額', revLabel],
                  ...(!noTxn ? [[isEn ? 'Transactions' : '年交易量', txnLabel]] : []),
                  [isEn ? 'Base Fee' : isSc ? '基本费用' : '基本費用', isNegot ? '—' : `${pre}${(isNegot ? 0 : base).toLocaleString()}`],
                  [isEn ? `Bank Accts (${banks})` : `銀行帳戶 (${banks})`, bankFee > 0 ? `+${pre}${bankFee.toLocaleString()}` : (isEn ? 'Included' : '已包含')],
                  ...(extCnt > 0 ? [[isEn ? `Complexity (${extCnt})` : `複雜項目 (${extCnt})`, `+${pre}${extFee.toLocaleString()}`]] : []),
                ].map(([k, v], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.06)', gap: 12 }}>
                    <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.8rem', color: 'rgba(255,255,255,.5)' }}>{k}</span>
                    <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.8rem', color: '#fff', fontWeight: 600, textAlign: 'right', flexShrink: 0 }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '2px solid rgba(201,168,76,.4)' }}>
                  <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: 'rgba(255,255,255,.7)' }}>
                    {isEn ? 'Estimated Total' : isSc ? '估计总费用' : '估計總費用'}
                  </span>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: isNegot ? '1rem' : '1.4rem', color: isNegot ? '#C9A84C' : '#fff', textAlign: 'right' }}>
                    {totalStr}
                  </span>
                </div>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.73rem', color: 'rgba(255,255,255,.3)', marginTop: 10, lineHeight: 1.6 }}>
                  {isEn ? 'Annual estimate for reference only. Final fee confirmed upon engagement.' : isSc ? '年度估算，仅供参考。最终费用于确认委托后确定。' : '年度估算，僅供參考。最終費用於確認委託後確定。'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
                  <a href={calcWaHref} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#EF4444', color: '#fff', padding: '13px 16px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', textDecoration: 'none', borderRadius: 2 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M11.999 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.86 1.428 5.492L2 22l4.641-1.395C8.26 21.468 10.093 22 12 22c5.523 0 10-4.483 10-10.003C22 6.484 17.523 2 12 2z"/></svg>
                    {isEn ? 'WhatsApp — Get Accurate Quote' : isSc ? 'WhatsApp 获取准确报价' : 'WhatsApp 獲取準確報價'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ALL SERVICES GRID ────────────────────────────────────────────── */}
        <section style={{ background: '#fff', padding: '72px 0' }} id="services">
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 10 }}>
              {isEn ? 'All Services' : isSc ? '全部服务' : '全部服務'}
            </p>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#0F2557', marginBottom: 6 }}>
              {isEn ? '8 Service Pillars · 30+ Corporate Services' : isSc ? '8大服务支柱 · 30+企业服务' : '8大服務支柱 · 30+企業服務'}
            </h2>
            <div style={{ width: 44, height: 3, background: '#C9A84C', marginBottom: 40 }} />

            {pillars.map(p => {
              const svcs = SVCS.filter(s => s.p === p);
              return (
                <div key={p} style={{ marginBottom: 40 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, background: pillarColors[p], color: '#fff', fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '.78rem', borderRadius: 2 }}>{p}</span>
                    <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557' }}>{pnames[p]}</span>
                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', color: '#94A3B8', letterSpacing: '.06em' }}>{svcs.length}{isEn ? ' services' : isSc ? '项服务' : '項服務'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                    {svcs.map(svc => {
                      const name = lk === 'en' ? svc.nameEn : lk === 'sc' ? svc.nameSc : svc.nameTc;
                      const isQ = svc.price === '詢價' || svc.price === 'Quotation';
                      const priceDisp = isQ ? (isEn ? 'Get Quote' : '詢價') : svc.price;
                      return (
                        <a key={svc.code} href={svcWaHref(svc)} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '18px 18px 14px', textDecoration: 'none', transition: 'border-color .15s, box-shadow .15s', borderTop: `3px solid ${pillarColors[p]}`, position: 'relative' }}>
                          {svc.popular && (
                            <span style={{ position: 'absolute', top: -10, right: 12, background: '#EF4444', color: '#fff', fontFamily: "'Montserrat',sans-serif", fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', letterSpacing: '.08em' }}>
                              ★ {isEn ? 'Popular' : isSc ? '热门' : '熱門'}
                            </span>
                          )}
                          <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.87rem', color: '#0F2557', marginBottom: 12, lineHeight: 1.4 }}>{name}</h3>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '.88rem', color: isQ ? '#C9A84C' : '#EF4444' }}>{priceDisp}</span>
                            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '.06em' }}>
                              {isEn ? 'Enquire →' : isSc ? '查询 →' : '查詢 →'}
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── PROCESS STEPS ────────────────────────────────────────────────── */}
        <section style={{ background: '#091A3E', padding: '72px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 10 }}>
              {isEn ? 'Our Process' : isSc ? '服务流程' : '服務流程'}
            </p>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,2rem)', color: '#fff', marginBottom: 6 }}>
              {isEn ? 'All-in-One Service Process' : isSc ? '一站式服务流程' : '一站式服務流程'}
            </h2>
            <div style={{ width: 44, height: 3, background: '#C9A84C', marginBottom: 48 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
              {[
                {
                  num: '01',
                  h: isEn ? 'WhatsApp — Same-day Response' : isSc ? 'WhatsApp 查询，即日回复' : 'WhatsApp 查詢，即日回覆',
                  p: isEn ? 'Contact us and our team responds within one business day.' : isSc ? '联系我们，我们的专业团队会在一个工作天内回复您的查询。' : '聯絡我們，我們的專業團隊會在一個工作天內回覆您的查詢。',
                },
                {
                  num: '02',
                  h: isEn ? 'Assess Needs & Provide Quote' : isSc ? '评估需求，提供方案报价' : '評估需求，提供方案報價',
                  p: isEn ? 'We assess your business needs and provide a tailored solution with transparent pricing.' : isSc ? '我们评估您的业务需求，提供度身定制的方案及透明报价。' : '我們評估您的業務需求，提供度身訂造的方案及透明報價。',
                },
                {
                  num: '03',
                  h: isEn ? 'Engage & Prepare Documents' : isSc ? '确认委托，准备所需资料' : '確認委託，準備所需資料',
                  p: isEn ? 'Once engaged, we guide you through document preparation and follow up at every step.' : isSc ? '确认委托后，我们指引您准备所需文件，全程跟进每一步骤。' : '確認委託後，我們指引您準備所需文件，全程跟進每一步驟。',
                },
                {
                  num: '04',
                  h: isEn ? 'Delivered & Ongoing Support' : isSc ? '完成交付，后续持续支援' : '完成交付，後續持續支援',
                  p: isEn ? 'After delivery, we continue to provide ongoing support and follow-up services.' : isSc ? '服务完成后，我们继续提供持续支援及后续服务。' : '服務完成後，我們繼續提供持續支援及後續服務。',
                },
              ].map((step, i, arr) => (
                <div key={step.num} style={{ position: 'relative' }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: '2.2rem', color: 'rgba(255,255,255,.08)', lineHeight: 1, marginBottom: 12 }}>{step.num}</div>
                  <h4 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.95rem', color: '#fff', marginBottom: 10, lineHeight: 1.4 }}>{step.h}</h4>
                  <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.75 }}>{step.p}</p>
                  {i < arr.length - 1 && (
                    <div style={{ position: 'absolute', top: 12, right: -12, color: '#C9A84C', fontSize: '1.2rem', display: 'none' }} className="step-arrow">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
        <section style={{ background: '#EF4444', padding: '56px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
            <div>
              <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(1.2rem,3vw,1.8rem)', color: '#fff', marginBottom: 8 }}>
                {isEn ? 'Ready to Get Started?' : isSc ? '准备好开始了吗？' : '準備好開始了嗎？'}
              </h2>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', color: 'rgba(255,255,255,.85)', maxWidth: 480 }}>
                {isEn ? 'WhatsApp us now — free initial consultation, reply within 1 hour during business hours.' : isSc ? '立即 WhatsApp 我们，免费初步咨询，办公时间内1小时内回复。' : '立即 WhatsApp 我們，免費初步諮詢，辦公時間內1小時內回覆。'}
              </p>
            </div>
            <a href={`${waBase}?text=${encodeURIComponent(isEn ? 'Hi Sandbox Corporate, I would like to enquire about your services.' : 'Hi Sandbox Corporate，我想查詢企業服務報價。')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', color: '#EF4444', padding: '16px 28px', fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '.88rem', letterSpacing: '.06em', textDecoration: 'none', textTransform: 'uppercase', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M11.999 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.86 1.428 5.492L2 22l4.641-1.395C8.26 21.468 10.093 22 12 22c5.523 0 10-4.483 10-10.003C22 6.484 17.523 2 12 2z"/></svg>
              {isEn ? 'WhatsApp Us Now' : isSc ? '立即 WhatsApp' : '立即 WhatsApp'}
            </a>
          </div>
        </section>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .calc-grid-2col { grid-template-columns: 1fr !important; }
          .calc-rev-txn { grid-template-columns: 1fr !important; }
          .ext-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
