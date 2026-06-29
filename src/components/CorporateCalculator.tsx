'use client';
import { useState, useCallback } from 'react';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';
type LK = 'tc' | 'en' | 'sc';

// ─── Pricing (20_50 band fixed: 1000 added) ────────────────────────────────
const C_BASE: Record<string, { type?: string; fee?: number; [k: number]: number }> = {
  none_op: { type: 'fixed', fee: 2960 },
  zero:    { type: 'fixed', fee: 2520 },
  '1_2':   { 200: 3980, 500: 4200, 800: 4530, 1000: 4750 },
  '2_5':   { 200: 4310, 500: 4530, 800: 4860, 1000: 5080 },
  '5_10':  { 200: 4750, 500: 4970, 800: 5300, 1000: 5520 },
  '10_20': { 200: 5410, 500: 5630, 800: 5960, 1000: 6180 },
  '20_50': { 200: 5850, 500: 6400, 800: 7170, 1000: 7950 },
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

interface Svc {
  p: string; code: string;
  nameTc: string; nameEn: string; nameSc: string;
  price: string; popular?: boolean;
  ctaWaMessage?: string;
}

interface DbService {
  id: string;
  group: string;
  name: unknown;
  price: string;
  featured: boolean;
  ctaWhatsappMessage: string | null;
  order: number;
}
const SVCS: Svc[] = [
  {p:'A',code:'INC_BASIC',nameTc:'香港有限公司成立（基礎）',nameEn:'HK Ltd Co. Formation (Basic)',nameSc:'香港有限公司成立（基础）',price:'HK$1,800'},
  {p:'A',code:'INC_FULL',nameTc:'公司成立 + 首年秘書 + 商業登記',nameEn:'Incorporation + 1st Year Sec + BR',nameSc:'公司成立 + 首年秘书 + 商业登记',price:'HK$3,200',popular:true},
  {p:'A',code:'INC_PREM',nameTc:'公司成立（高級套餐）',nameEn:'Incorporation Premium Package',nameSc:'公司成立（高级套餐）',price:'HK$5,500'},
  {p:'A',code:'DEREG',nameTc:'公司結業 / 撤銷登記',nameEn:'Deregistration / Strike Off',nameSc:'公司注销 / 撤销登记',price:'HK$3,500'},
  {p:'B',code:'COSEC_BASIC',nameTc:'公司秘書（基礎月費計劃）',nameEn:'Company Secretary (Basic Monthly)',nameSc:'公司秘书（基础月费计划）',price:'HK$350/月',popular:true},
  {p:'B',code:'COSEC_ELITE',nameTc:'公司秘書（精英月費計劃）',nameEn:'Company Secretary (Elite Monthly)',nameSc:'公司秘书（精英月费计划）',price:'HK$680/月'},
  {p:'B',code:'COSEC_PREM',nameTc:'公司秘書（高級月費計劃）',nameEn:'Company Secretary (Premium Monthly)',nameSc:'公司秘书（高级月费计划）',price:'HK$1,200/月'},
  {p:'B',code:'AR',nameTc:'周年申報表遞交',nameEn:'Annual Return Filing (NAR1)',nameSc:'周年申报表递交',price:'HK$800'},
  {p:'B',code:'BR_RENEW',nameTc:'商業登記證年期更新',nameEn:'Business Registration Renewal',nameSc:'商业登记证续期',price:'HK$600'},
  {p:'C',code:'BOOKKEEP',nameTc:'每月簿記服務',nameEn:'Monthly Bookkeeping Service',nameSc:'每月记账服务',price:'HK$168/月起'},
  {p:'C',code:'FINSTAT',nameTc:'年度財務報表',nameEn:'Annual Financial Statements',nameSc:'年度财务报表',price:'HK$3,500起'},
  {p:'C',code:'TAX_AGENT',nameTc:'稅務代理服務',nameEn:'Tax Representative Service',nameSc:'税务代理服务',price:'HK$800/年'},
  {p:'D',code:'AUDIT_BASIC',nameTc:'審計 + 報稅（不含簿記）',nameEn:'Audit + Tax Filing (No Bookkeeping)',nameSc:'审计 + 报税（不含记账）',price:'HK$5,800'},
  {p:'D',code:'AUDIT_FULL',nameTc:'簿記 + 審計 + 報稅（完整）',nameEn:'Bookkeeping + Audit + Tax Filing (Full)',nameSc:'记账 + 审计 + 报税（完整）',price:'HK$7,800',popular:true},
  {p:'D',code:'AUDIT_SME',nameTc:'純審計安排（中小企CPA）',nameEn:'Audit Arrangement Only (SME CPA)',nameSc:'纯审计安排（中小企CPA）',price:'HK$3,999起'},
  {p:'E',code:'TAX_FILING',nameTc:'利得稅報稅表申報',nameEn:'Profits Tax Return Filing',nameSc:'利得税报税表申报',price:'HK$2,500起'},
  {p:'E',code:'TAX_OFFSHORE',nameTc:'境外收入豁免申請',nameEn:'Offshore Tax Exemption Application',nameSc:'境外收入豁免申请',price:'HK$8,000起'},
  {p:'E',code:'TAX_ADVISORY',nameTc:'稅務規劃及顧問',nameEn:'Tax Planning & Advisory',nameSc:'税务规划及顾问',price:'詢價'},
  {p:'F',code:'VO',nameTc:'虛擬辦公室及註冊地址',nameEn:'Virtual Office & Registered Address',nameSc:'虚拟办公室及注册地址',price:'HK$800/年'},
  {p:'F',code:'MAIL',nameTc:'郵件處理及轉發',nameEn:'Mail Handling & Forwarding',nameSc:'邮件处理及转发',price:'HK$1,200/年'},
  {p:'F',code:'MEETING',nameTc:'會議室（日票）',nameEn:'Meeting Room (Day Pass)',nameSc:'会议室（日票）',price:'HK$500/天'},
  {p:'G',code:'F_SCR',nameTc:'重要控制人登記冊',nameEn:'Significant Controllers Register (SCR)',nameSc:'重要控制人登记册',price:'HK$800'},
  {p:'G',code:'F_BRANCH',nameTc:'分行註冊',nameEn:'Branch Office Registration',nameSc:'分行注册',price:'HK$1,500'},
  {p:'G',code:'F_CO_RENAME',nameTc:'公司更名',nameEn:'Company Name Change',nameSc:'公司更名',price:'HK$1,200'},
  {p:'G',code:'F_NOTARY',nameTc:'國際公證 + 高等法院加簽',nameEn:'International Notarisation + Apostille',nameSc:'国际公证 + 高等法院加签',price:'詢價'},
  {p:'G',code:'F_TRADEMARK',nameTc:'香港商標註冊',nameEn:'Hong Kong Trademark Registration',nameSc:'香港商标注册',price:'詢價'},
  {p:'G',code:'F_BUSCAP',nameTc:'增加註冊股本',nameEn:'Increase Registered Share Capital',nameSc:'增加注册股本',price:'HK$800'},
  {p:'H',code:'G_HKTP',nameTc:'高端人才通行證計劃（TTPS）',nameEn:'Top Talent Pass Scheme (TTPS)',nameSc:'高端人才通行证计划（TTPS）',price:'詢價'},
  {p:'H',code:'G_QMAS',nameTc:'優質移民入境計劃（QMAS）',nameEn:'Quality Migrant Admission Scheme (QMAS)',nameSc:'优才计划（QMAS）',price:'詢價'},
  {p:'H',code:'G_IANG',nameTc:'輸入內地人才計劃（IANG）',nameEn:'Admission of Mainland Talents (IANG)',nameSc:'输入内地人才计划（IANG）',price:'詢價'},
  {p:'H',code:'G_RENEWAL',nameTc:'簽證 / 許可証續期',nameEn:'Visa / Permit Renewal',nameSc:'签证 / 许可证续期',price:'詢價'},
];

const PILLAR_NAMES: Record<LK, Record<string, string>> = {
  tc: {A:'公司成立',B:'公司秘書',C:'會計',D:'審計',E:'稅務',F:'商務中心',G:'企業服務',H:'簽證及移民'},
  en: {A:'Company Formation',B:'Company Secretary',C:'Accounting',D:'Audit',E:'Tax Advisory',F:'Business Centre',G:'Other Corp Services',H:'Visa & Immigration'},
  sc: {A:'公司成立',B:'公司秘书',C:'会计',D:'审计',E:'税务',F:'商务中心',G:'企业服务',H:'签证及移民'},
};

const TABS: Record<LK, { key: string; label: string }[]> = {
  tc: [{ key: 'services', label: '服務一覽' }, { key: 'calc', label: '報價計算器' }],
  en: [{ key: 'services', label: 'All Services' }, { key: 'calc', label: 'Quote Calculator' }],
  sc: [{ key: 'services', label: '服务一览' }, { key: 'calc', label: '报价计算器' }],
};

function lkOf(locale: Locale): LK {
  return locale === 'en' ? 'en' : locale === 'zh-Hans' ? 'sc' : 'tc';
}

const WA_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M11.999 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.86 1.428 5.492L2 22l4.641-1.395C8.26 21.468 10.093 22 12 22c5.523 0 10-4.483 10-10.003C22 6.484 17.523 2 12 2z"/>
  </svg>
);

const selectStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #CBD5E1',
  padding: '10px 12px',
  fontFamily: "'Noto Sans TC',sans-serif",
  fontSize: '.88rem',
  color: '#0F2557',
  background: '#fff',
  borderRadius: 0,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 36,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Noto Sans TC',sans-serif",
  fontSize: '.8rem',
  color: '#475569',
  display: 'block',
  marginBottom: 6,
  fontWeight: 600,
};

export default function CorporateCalculator({
  locale,
  waNumber,
  dbServices = [],
  defaultWaMsg = '',
}: {
  locale: Locale;
  waNumber: string;
  dbServices?: DbService[];
  defaultWaMsg?: string;
}) {
  const lk = lkOf(locale);
  const isEn = lk === 'en';
  const isSc = lk === 'sc';
  const waBase = `https://wa.me/${waNumber.replace(/\D/g, '')}`;

  // Use DB services when the admin has added any; otherwise fall back to hardcoded SVCS
  const activeSvcs: Svc[] = dbServices.length > 0
    ? dbServices.map(s => {
        const n = s.name as { tc: string; en: string; sc: string };
        return {
          p: s.group,
          code: s.id,
          nameTc: n.tc || '',
          nameEn: n.en || '',
          nameSc: n.sc || '',
          price: s.price,
          popular: s.featured,
          ctaWaMessage: s.ctaWhatsappMessage ?? undefined,
        };
      })
    : SVCS;

  const [tab, setTab] = useState('services');
  const [rev, setRev] = useState('none_op');
  const [txn, setTxn] = useState(200);
  const [banks, setBanks] = useState(1);
  const [extState, setExtState] = useState<boolean[]>(new Array(11).fill(false));

  const toggleExt = useCallback((i: number) => {
    setExtState(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  }, []);

  // ─── Fee calculation ───────────────────────────────────────────────────────
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
  const extItems = EXT[lk].filter((_, i) => extState[i]);

  // ─── Dynamic WhatsApp URLs ─────────────────────────────────────────────────
  const calcWaText = [
    isEn ? 'Hi Sandbox Corporate, I would like a quotation for accounting & audit services:' :
    isSc ? 'Hi Sandbox Corporate，我想查询会计及审计服务报价：' :
    'Hi Sandbox Corporate，我想查詢會計及審計服務報價：',
    `${isEn ? 'Revenue' : isSc ? '年营业额' : '年營業額'}：${revLabel}`,
    noTxn ? '' : `${isEn ? 'Transactions' : '年交易量'}：${txnLabel}`,
    `${isEn ? 'Bank accounts' : isSc ? '银行账户' : '銀行帳戶'}：${banks}`,
    extCnt > 0 ? `${isEn ? 'Complexity items' : isSc ? '复杂项目' : '複雜項目'}：${extItems.join('、')}` : '',
    `${isEn ? 'Estimated fee' : isSc ? '估计费用' : '估計費用'}：${totalStr}`,
  ].filter(Boolean).join('\n');

  function svcWaHref(svc: Svc) {
    if (svc.ctaWaMessage) return `${waBase}?text=${encodeURIComponent(svc.ctaWaMessage)}`;
    const name = lk === 'en' ? svc.nameEn : lk === 'sc' ? svc.nameSc : svc.nameTc;
    const msg = isEn
      ? `Hi Sandbox Corporate, I would like a quotation for: ${name} (${svc.price})`
      : isSc
      ? `Hi Sandbox Corporate，我想查询以下服务的报价：${name}（${svc.price}）`
      : `Hi Sandbox Corporate，我想查詢以下服務的報價：${name}（${svc.price}）`;
    return `${waBase}?text=${encodeURIComponent(msg)}`;
  }

  const calcWaHref = defaultWaMsg
    ? `${waBase}?text=${encodeURIComponent(defaultWaMsg)}`
    : `${waBase}?text=${encodeURIComponent(calcWaText)}`;

  const pillars = ['A','B','C','D','E','F','G','H'].filter(p => activeSvcs.some(s => s.p === p));
  const pnames = PILLAR_NAMES[lk];

  return (
    <>
      {/* ── HERO — matches site style ─────────────────────────────────────── */}
      <section style={{ background: '#0F2557', padding: '52px 0 44px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 14 }}>
            — SANDBOX CORPORATE
          </p>
          <h1 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff', lineHeight: 1.1, marginBottom: 12 }}>
            {isEn ? 'Corporate Services Quotation' : isSc ? '企业服务即时报价' : '企業服務即時報價'}
          </h1>
          <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: 'rgba(255,255,255,.7)', maxWidth: 540, lineHeight: 1.8, marginBottom: 28 }}>
            {isEn
              ? 'Instant accounting & audit fee estimates. 8 service categories covering company formation, secretary, tax, visa and more — all with transparent pricing.'
              : isSc
              ? '即时会计及审计费用估算，8大服务类别涵盖公司成立、秘书、税务、签证等，费用透明。'
              : '即時會計及審計費用估算，8大服務類別涵蓋公司成立、秘書、稅務、簽證等，費用透明。'}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => { setTab('calc'); setTimeout(() => document.getElementById('calc-section')?.scrollIntoView({ behavior: 'smooth' }), 50); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EF4444', color: '#fff', padding: '11px 22px', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              {isEn ? '↓ Instant Fee Estimate' : isSc ? '↓ 即时费用估算' : '↓ 即時費用估算'}
            </button>
            <a
              href={`${waBase}?text=${encodeURIComponent(isEn ? 'Hi Sandbox Corporate, I would like to enquire about your services.' : 'Hi Sandbox Corporate，我想查詢企業服務報價。')}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#fff', padding: '11px 22px', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', fontWeight: 700, border: '1.5px solid rgba(255,255,255,.35)', textDecoration: 'none' }}
            >
              {WA_ICON}
              {isEn ? 'WhatsApp Enquiry' : isSc ? 'WhatsApp 查询' : 'WhatsApp 查詢'}
            </a>
          </div>
        </div>
      </section>

      {/* ── TAB NAV — matches site SubTabNav style ────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: '2px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', display: 'flex' }}>
          {TABS[lk].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                background: 'none', border: 'none', padding: '14px 22px 12px', cursor: 'pointer',
                fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', fontWeight: tab === t.key ? 700 : 400,
                color: tab === t.key ? '#0F2557' : '#64748B',
                borderBottom: tab === t.key ? '2px solid #EF4444' : '2px solid transparent',
                marginBottom: -2,
                transition: 'all .15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div id="calc-section" style={{ background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '36px 24px 56px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 28, alignItems: 'start' }} className="calc-outer-grid">

          {/* ── LEFT MAIN ─────────────────────────────────────────────────── */}
          <div>
            {tab === 'calc' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* 01 Company profile */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '24px' }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #F1F5F9' }}>
                    {isEn ? '01 · Company Profile' : isSc ? '01 · 公司资料' : '01 · 公司資料'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="rev-txn-grid">
                    <div>
                      <label style={labelStyle}>{isEn ? 'Annual Revenue' : isSc ? '年营业额' : '年營業額'}</label>
                      <select value={rev} onChange={e => setRev(e.target.value)} style={selectStyle}>
                        {REV[lk].map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                      </select>
                    </div>
                    <div style={{ opacity: noTxn ? 0.4 : 1, pointerEvents: noTxn ? 'none' : 'auto' }}>
                      <label style={labelStyle}>{isEn ? 'Annual Transactions' : '年交易量'}</label>
                      <select value={txn} onChange={e => setTxn(Number(e.target.value))} style={selectStyle}>
                        {TXN[lk].map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 02 Bank accounts */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '24px' }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #F1F5F9' }}>
                    {isEn ? '02 · Bank Accounts' : isSc ? '02 · 银行账户' : '02 · 銀行帳戶'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1' }}>
                      <button onClick={() => setBanks(b => Math.max(1, b - 1))} style={{ width: 36, height: 36, background: '#F8FAFC', border: 'none', borderRight: '1px solid #CBD5E1', fontSize: '1.2rem', fontWeight: 700, color: '#0F2557', cursor: 'pointer' }}>−</button>
                      <span style={{ minWidth: 48, textAlign: 'center', fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F2557', padding: '0 8px' }}>{banks}</span>
                      <button onClick={() => setBanks(b => b + 1)} style={{ width: 36, height: 36, background: '#F8FAFC', border: 'none', borderLeft: '1px solid #CBD5E1', fontSize: '1.2rem', fontWeight: 700, color: '#0F2557', cursor: 'pointer' }}>+</button>
                    </div>
                    <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: '#64748B', lineHeight: 1.6 }}>
                      {isEn
                        ? <>{`1st account included · Each extra: `}<strong style={{ color: '#0F2557' }}>+HKD 500</strong></>
                        : isSc
                        ? <>{`基本费用含一个账户 · 每个额外账户：`}<strong style={{ color: '#0F2557' }}>+港元 500</strong></>
                        : <>{`基本費用含一個帳戶 · 每個額外帳戶：`}<strong style={{ color: '#0F2557' }}>+港元 500</strong></>}
                    </p>
                  </div>
                </div>

                {/* 03 Complexity */}
                <div style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '24px' }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 6, paddingBottom: 12, borderBottom: '1px solid #F1F5F9' }}>
                    {isEn ? '03 · Accounting Complexity Items' : isSc ? '03 · 额外会计复杂项目' : '03 · 額外會計複雜項目'}
                  </div>
                  <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.78rem', color: '#94A3B8', marginBottom: 16 }}>
                    {isEn ? <>Each selected item: <strong style={{ color: '#475569' }}>+HKD 500</strong></> : <>每個選定項目增加 <strong style={{ color: '#475569' }}>港元 500</strong></>}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }} className="ext-items-grid">
                    {EXT[lk].map((label, i) => (
                      <label
                        key={i}
                        onClick={() => toggleExt(i)}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px',
                          border: `1px solid ${extState[i] ? '#0F2557' : '#E2E8F0'}`,
                          background: extState[i] ? '#EFF6FF' : '#FAFAFA',
                          cursor: 'pointer', transition: 'all .12s',
                        }}
                      >
                        <div style={{
                          width: 16, height: 16, flexShrink: 0, marginTop: 2,
                          border: `2px solid ${extState[i] ? '#0F2557' : '#CBD5E1'}`,
                          background: extState[i] ? '#0F2557' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {extState[i] && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.78rem', color: extState[i] ? '#0F2557' : '#475569', lineHeight: 1.45, fontWeight: extState[i] ? 600 : 400 }}>{label}</span>
                        {extState[i] && <span style={{ marginLeft: 'auto', fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, color: '#EF4444', flexShrink: 0 }}>+500</span>}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Fee summary — dark navy matching site's process bars */}
                <div style={{ background: '#091A3E', padding: '24px' }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.18em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 16 }}>
                    {isEn ? 'Fee Estimate Summary' : isSc ? '费用估算摘要' : '費用估算摘要'}
                  </div>
                  {[
                    [isEn ? 'Annual Revenue' : isSc ? '年营业额' : '年營業額', revLabel],
                    ...(!noTxn ? [[isEn ? 'Transactions' : '年交易量', txnLabel]] : []),
                    [isEn ? 'Base Fee' : isSc ? '基本费用' : '基本費用', isNegot ? '—' : `${pre}${base.toLocaleString()}`],
                    [isEn ? `Bank Accounts (${banks})` : `銀行帳戶 (${banks})`, bankFee > 0 ? `+${pre}${bankFee.toLocaleString()}` : (isEn ? 'Included' : '已包含')],
                    ...(extCnt > 0 ? [[isEn ? `Complexity (${extCnt} items)` : `複雜項目 (${extCnt})`, `+${pre}${extFee.toLocaleString()}`]] : []),
                  ].map(([k, v], i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.07)', gap: 16 }}>
                      <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: 'rgba(255,255,255,.5)' }}>{k}</span>
                      <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: '#fff', fontWeight: 600, textAlign: 'right', flexShrink: 0 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(201,168,76,.35)', gap: 16 }}>
                    <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: 'rgba(255,255,255,.65)' }}>
                      {isEn ? 'Estimated Total (Annual)' : isSc ? '估计总费用（年度）' : '估計總費用（年度）'}
                    </span>
                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: isNegot ? '.95rem' : '1.6rem', color: isNegot ? '#C9A84C' : '#fff' }}>
                      {totalStr}
                    </span>
                  </div>
                  <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.72rem', color: 'rgba(255,255,255,.28)', marginTop: 10, lineHeight: 1.65 }}>
                    {isEn ? 'Annual estimate for reference only. Final fee confirmed upon engagement.' : isSc ? '年度估算，仅供参考。最终费用于确认委托后确定。' : '年度估算，僅供參考。最終費用於確認委託後確定。'}
                  </p>
                  <a
                    href={calcWaHref}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#EF4444', color: '#fff', padding: '13px 16px', marginTop: 20, fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.9rem', textDecoration: 'none' }}
                  >
                    {WA_ICON}
                    {isEn ? 'WhatsApp — Get Accurate Quote' : isSc ? 'WhatsApp 获取准确报价' : 'WhatsApp 獲取準確報價'}
                  </a>
                </div>

              </div>
            ) : (
              /* ── SERVICES TAB ─────────────────────────────────────────── */
              <div>
                {pillars.map(p => {
                  const svcs = activeSvcs.filter(s => s.p === p);
                  return (
                    <div key={p} style={{ marginBottom: 32 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: '#0F2557', color: '#fff', fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '.75rem' }}>{p}</span>
                        <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.95rem', color: '#0F2557' }}>{pnames[p]}</span>
                        <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', color: '#94A3B8' }}>{svcs.length}{isEn ? ' services' : isSc ? '项服务' : '項服務'}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 2 }}>
                        {svcs.map(svc => {
                          const name = lk === 'en' ? svc.nameEn : lk === 'sc' ? svc.nameSc : svc.nameTc;
                          const isQ = svc.price === '詢價' || svc.price === 'Quotation';
                          return (
                            <a key={svc.code} href={svcWaHref(svc)} target="_blank" rel="noopener noreferrer"
                              style={{ display: 'block', background: '#fff', border: '1px solid #E2E8F0', borderLeft: '3px solid #0F2557', padding: '16px 18px', textDecoration: 'none', position: 'relative' }}>
                              {svc.popular && (
                                <span style={{ position: 'absolute', top: 10, right: 10, background: '#EF4444', color: '#fff', fontFamily: "'Montserrat',sans-serif", fontSize: '.6rem', fontWeight: 700, padding: '2px 6px' }}>
                                  {isEn ? 'Popular' : isSc ? '热门' : '熱門'}
                                </span>
                              )}
                              <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.85rem', color: '#0F2557', marginBottom: 8, lineHeight: 1.4, paddingRight: svc.popular ? 44 : 0 }}>{name}</h3>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.85rem', color: isQ ? '#C9A84C' : '#EF4444' }}>{isQ ? (isEn ? 'Get Quote' : '詢價') : svc.price}</span>
                                <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.72rem', color: '#94A3B8' }}>{isEn ? 'Enquire →' : isSc ? '查询 →' : '查詢 →'}</span>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR — matches site dark navy sidebar style ───────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Free consultation — matches site's InquiryForm sidebar style */}
            <div style={{ background: '#0F2557' }}>
              <div style={{ background: '#EF4444', padding: '12px 20px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#fff' }}>
                {isEn ? 'Free Initial Consultation' : isSc ? '免费初步咨询' : '免費初步諮詢'}
              </div>
              <div style={{ padding: '20px' }}>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: 'rgba(255,255,255,.75)', lineHeight: 1.8, marginBottom: 18 }}>
                  {isEn
                    ? 'WhatsApp us now — reply within 1 hour during business hours. No obligation.'
                    : isSc
                    ? '即刻 WhatsApp 我们，办公时间内1小时内回复，无需承诺。'
                    : '即刻 WhatsApp 我們，辦公時間內1小時內回覆，無需承諾。'}
                </p>
                <a
                  href={`${waBase}?text=${encodeURIComponent(isEn ? 'Hi Sandbox Corporate, I would like a free initial consultation.' : 'Hi Sandbox Corporate，我想預約免費初步諮詢。')}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#EF4444', color: '#fff', padding: '12px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', textDecoration: 'none' }}
                >
                  {WA_ICON} WhatsApp
                </a>
              </div>
            </div>

            {/* Why us */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '20px' }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 14 }}>
                {isEn ? 'Why Sandbox Corporate' : isSc ? '为何选择我们' : '為何選擇我們'}
              </div>
              {[
                isEn ? '✓ TCSP-licensed provider' : '✓ 持牌TCSP服務商',
                isEn ? '✓ Former banking compliance officers' : '✓ 前銀行合規主管團隊',
                isEn ? '✓ One-stop: formation to audit' : '✓ 一站式：由成立到審計',
                isEn ? '✓ Transparent fixed pricing' : '✓ 透明固定報價',
                isEn ? '✓ Reply within 1 business day' : '✓ 一個工作天內回覆',
              ].map((pt, i, arr) => (
                <div key={i} style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: '#475569', padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid #F1F5F9' : 'none', lineHeight: 1.5 }}>{pt}</div>
              ))}
            </div>

            {/* TCSP badge */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '16px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#0F2557', marginBottom: 4 }}>TCSP</div>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.78rem', color: '#64748B', lineHeight: 1.5 }}>
                {isEn ? 'Licensed Trust & Company Service Provider' : isSc ? '持牌信托及公司服务提供商' : '持牌信託及公司服務提供商'}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .calc-outer-grid { grid-template-columns: 1fr !important; }
          .rev-txn-grid { grid-template-columns: 1fr !important; }
          .ext-items-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
