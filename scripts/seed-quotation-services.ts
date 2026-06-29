/**
 * One-time seed: inserts the 30 hardcoded quotation services into the DB.
 * Run: npx tsx scripts/seed-quotation-services.ts
 */
import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

const SVCS = [
  {p:'A',code:'INC_BASIC',tc:'香港有限公司成立（基礎）',en:'HK Ltd Co. Formation (Basic)',sc:'香港有限公司成立（基础）',price:'HK$1,800',popular:false,order:1},
  {p:'A',code:'INC_FULL',tc:'公司成立 + 首年秘書 + 商業登記',en:'Incorporation + 1st Year Sec + BR',sc:'公司成立 + 首年秘书 + 商业登记',price:'HK$3,200',popular:true,order:2},
  {p:'A',code:'INC_PREM',tc:'公司成立（高級套餐）',en:'Incorporation Premium Package',sc:'公司成立（高级套餐）',price:'HK$5,500',popular:false,order:3},
  {p:'A',code:'DEREG',tc:'公司結業 / 撤銷登記',en:'Deregistration / Strike Off',sc:'公司注销 / 撤销登记',price:'HK$3,500',popular:false,order:4},
  {p:'B',code:'COSEC_BASIC',tc:'公司秘書（基礎月費計劃）',en:'Company Secretary (Basic Monthly)',sc:'公司秘书（基础月费计划）',price:'HK$350/月',popular:true,order:1},
  {p:'B',code:'COSEC_ELITE',tc:'公司秘書（精英月費計劃）',en:'Company Secretary (Elite Monthly)',sc:'公司秘书（精英月费计划）',price:'HK$680/月',popular:false,order:2},
  {p:'B',code:'COSEC_PREM',tc:'公司秘書（高級月費計劃）',en:'Company Secretary (Premium Monthly)',sc:'公司秘书（高级月费计划）',price:'HK$1,200/月',popular:false,order:3},
  {p:'B',code:'AR',tc:'周年申報表遞交',en:'Annual Return Filing (NAR1)',sc:'周年申报表递交',price:'HK$800',popular:false,order:4},
  {p:'B',code:'BR_RENEW',tc:'商業登記證年期更新',en:'Business Registration Renewal',sc:'商业登记证续期',price:'HK$600',popular:false,order:5},
  {p:'C',code:'BOOKKEEP',tc:'每月簿記服務',en:'Monthly Bookkeeping Service',sc:'每月记账服务',price:'HK$168/月起',popular:false,order:1},
  {p:'C',code:'FINSTAT',tc:'年度財務報表',en:'Annual Financial Statements',sc:'年度财务报表',price:'HK$3,500起',popular:false,order:2},
  {p:'C',code:'TAX_AGENT',tc:'稅務代理服務',en:'Tax Representative Service',sc:'税务代理服务',price:'HK$800/年',popular:false,order:3},
  {p:'D',code:'AUDIT_BASIC',tc:'審計 + 報稅（不含簿記）',en:'Audit + Tax Filing (No Bookkeeping)',sc:'审计 + 报税（不含记账）',price:'HK$5,800',popular:false,order:1},
  {p:'D',code:'AUDIT_FULL',tc:'簿記 + 審計 + 報稅（完整）',en:'Bookkeeping + Audit + Tax Filing (Full)',sc:'记账 + 审计 + 报税（完整）',price:'HK$7,800',popular:true,order:2},
  {p:'D',code:'AUDIT_SME',tc:'純審計安排（中小企CPA）',en:'Audit Arrangement Only (SME CPA)',sc:'纯审计安排（中小企CPA）',price:'HK$3,999起',popular:false,order:3},
  {p:'E',code:'TAX_FILING',tc:'利得稅報稅表申報',en:'Profits Tax Return Filing',sc:'利得税报税表申报',price:'HK$2,500起',popular:false,order:1},
  {p:'E',code:'TAX_OFFSHORE',tc:'境外收入豁免申請',en:'Offshore Tax Exemption Application',sc:'境外收入豁免申请',price:'HK$8,000起',popular:false,order:2},
  {p:'E',code:'TAX_ADVISORY',tc:'稅務規劃及顧問',en:'Tax Planning & Advisory',sc:'税务规划及顾问',price:'詢價',popular:false,order:3},
  {p:'F',code:'VO',tc:'虛擬辦公室及註冊地址',en:'Virtual Office & Registered Address',sc:'虚拟办公室及注册地址',price:'HK$800/年',popular:false,order:1},
  {p:'F',code:'MAIL',tc:'郵件處理及轉發',en:'Mail Handling & Forwarding',sc:'邮件处理及转发',price:'HK$1,200/年',popular:false,order:2},
  {p:'F',code:'MEETING',tc:'會議室（日票）',en:'Meeting Room (Day Pass)',sc:'会议室（日票）',price:'HK$500/天',popular:false,order:3},
  {p:'G',code:'F_SCR',tc:'重要控制人登記冊',en:'Significant Controllers Register (SCR)',sc:'重要控制人登记册',price:'HK$800',popular:false,order:1},
  {p:'G',code:'F_BRANCH',tc:'分行註冊',en:'Branch Office Registration',sc:'分行注册',price:'HK$1,500',popular:false,order:2},
  {p:'G',code:'F_CO_RENAME',tc:'公司更名',en:'Company Name Change',sc:'公司更名',price:'HK$1,200',popular:false,order:3},
  {p:'G',code:'F_NOTARY',tc:'國際公證 + 高等法院加簽',en:'International Notarisation + Apostille',sc:'国际公证 + 高等法院加签',price:'詢價',popular:false,order:4},
  {p:'G',code:'F_TRADEMARK',tc:'香港商標註冊',en:'Hong Kong Trademark Registration',sc:'香港商标注册',price:'詢價',popular:false,order:5},
  {p:'G',code:'F_BUSCAP',tc:'增加註冊股本',en:'Increase Registered Share Capital',sc:'增加注册股本',price:'HK$800',popular:false,order:6},
  {p:'H',code:'G_HKTP',tc:'高端人才通行證計劃（TTPS）',en:'Top Talent Pass Scheme (TTPS)',sc:'高端人才通行证计划（TTPS）',price:'詢價',popular:false,order:1},
  {p:'H',code:'G_QMAS',tc:'優質移民入境計劃（QMAS）',en:'Quality Migrant Admission Scheme (QMAS)',sc:'优才计划（QMAS）',price:'詢價',popular:false,order:2},
  {p:'H',code:'G_IANG',tc:'輸入內地人才計劃（IANG）',en:'Admission of Mainland Talents (IANG)',sc:'输入内地人才计划（IANG）',price:'詢價',popular:false,order:3},
  {p:'H',code:'G_RENEWAL',tc:'簽證 / 許可証續期',en:'Visa / Permit Renewal',sc:'签证 / 许可证续期',price:'詢價',popular:false,order:4},
];

async function main() {
  // Skip pillar groups A–H that already have DB entries to avoid duplicates
  const existing = await prisma.package.findMany({
    where: { group: { in: ['A','B','C','D','E','F','G','H'] } },
    select: { group: true },
  });

  if (existing.length > 0) {
    console.log(`⚠️  Found ${existing.length} existing service(s) in groups A–H. Skipping seed to avoid duplicates.`);
    console.log('   Delete them from /admin/quotation first if you want to re-seed.');
    return;
  }

  let count = 0;
  for (const s of SVCS) {
    await prisma.package.create({
      data: {
        group: s.p,
        name: { tc: s.tc, en: s.en, sc: s.sc },
        price: s.price,
        featured: s.popular,
        order: s.order,
        tierLabel: '',
        ctaWhatsappMessage: null,
      },
    });
    count++;
    console.log(`  ✓ ${s.p} — ${s.tc}`);
  }

  console.log(`\n✅ Seeded ${count} services into the database.`);
  console.log('   Visit /admin/quotation to manage them.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
