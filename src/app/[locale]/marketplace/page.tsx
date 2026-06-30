export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { Metadata } from 'next';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';
type LK = 'tc' | 'en' | 'sc';

function lkOf(locale: Locale): LK {
  return locale === 'en' ? 'en' : locale === 'zh-Hans' ? 'sc' : 'tc';
}

function t(locale: Locale, tc: string, en: string, sc: string) {
  return locale === 'en' ? en : locale === 'zh-Hans' ? sc : tc;
}

function localePath(locale: Locale, path: string) {
  return locale === 'zh-Hant' ? path : `/${locale}${path}`;
}

const WA_NUMBER = '+85292318254';

const PILLAR_NAMES: Record<LK, Record<string, string>> = {
  tc: { A: '公司成立', B: '公司秘書', C: '會計', D: '審計', E: '稅務', F: '商務中心', G: '企業服務', H: '簽證及移民' },
  en: { A: 'Company Formation', B: 'Company Secretary', C: 'Accounting', D: 'Audit', E: 'Tax Advisory', F: 'Business Centre', G: 'Other Corp Services', H: 'Visa & Immigration' },
  sc: { A: '公司成立', B: '公司秘书', C: '会计', D: '审计', E: '税务', F: '商务中心', G: '企业服务', H: '签证及移民' },
};

const PILLAR_ICONS: Record<string, string> = {
  A: '🏢', B: '📋', C: '📊', D: '🔍', E: '💰', F: '🏙️', G: '⚙️', H: '✈️',
};

const SVCS_FALLBACK = [
  { p: 'A', code: 'INC_BASIC', nameTc: '香港有限公司成立（基礎）', nameEn: 'HK Ltd Co. Formation (Basic)', nameSc: '香港有限公司成立（基础）', price: 'HK$1,800' },
  { p: 'A', code: 'INC_FULL', nameTc: '公司成立 + 首年秘書 + 商業登記', nameEn: 'Incorporation + 1st Year Sec + BR', nameSc: '公司成立 + 首年秘书 + 商业登记', price: 'HK$3,200', popular: true },
  { p: 'A', code: 'INC_PREM', nameTc: '公司成立（高級套餐）', nameEn: 'Incorporation Premium Package', nameSc: '公司成立（高级套餐）', price: 'HK$5,500' },
  { p: 'A', code: 'DEREG', nameTc: '公司結業 / 撤銷登記', nameEn: 'Deregistration / Strike Off', nameSc: '公司注销 / 撤销登记', price: 'HK$3,500' },
  { p: 'B', code: 'COSEC_BASIC', nameTc: '公司秘書（基礎月費計劃）', nameEn: 'Company Secretary (Basic Monthly)', nameSc: '公司秘书（基础月费计划）', price: 'HK$350/月', popular: true },
  { p: 'B', code: 'COSEC_ELITE', nameTc: '公司秘書（精英月費計劃）', nameEn: 'Company Secretary (Elite Monthly)', nameSc: '公司秘书（精英月费计划）', price: 'HK$680/月' },
  { p: 'B', code: 'COSEC_PREM', nameTc: '公司秘書（高級月費計劃）', nameEn: 'Company Secretary (Premium Monthly)', nameSc: '公司秘书（高级月费计划）', price: 'HK$1,200/月' },
  { p: 'B', code: 'AR', nameTc: '周年申報表遞交', nameEn: 'Annual Return Filing (NAR1)', nameSc: '周年申报表递交', price: 'HK$800' },
  { p: 'B', code: 'BR_RENEW', nameTc: '商業登記證年期更新', nameEn: 'Business Registration Renewal', nameSc: '商业登记证续期', price: 'HK$600' },
  { p: 'C', code: 'BOOKKEEP', nameTc: '每月簿記服務', nameEn: 'Monthly Bookkeeping Service', nameSc: '每月记账服务', price: 'HK$168/月起' },
  { p: 'C', code: 'FINSTAT', nameTc: '年度財務報表', nameEn: 'Annual Financial Statements', nameSc: '年度财务报表', price: 'HK$3,500起' },
  { p: 'C', code: 'TAX_AGENT', nameTc: '稅務代理服務', nameEn: 'Tax Representative Service', nameSc: '税务代理服务', price: 'HK$800/年' },
  { p: 'D', code: 'AUDIT_BASIC', nameTc: '審計 + 報稅（不含簿記）', nameEn: 'Audit + Tax Filing (No Bookkeeping)', nameSc: '审计 + 报税（不含记账）', price: 'HK$5,800' },
  { p: 'D', code: 'AUDIT_FULL', nameTc: '簿記 + 審計 + 報稅（完整）', nameEn: 'Bookkeeping + Audit + Tax Filing (Full)', nameSc: '记账 + 审计 + 报税（完整）', price: 'HK$7,800', popular: true },
  { p: 'D', code: 'AUDIT_SME', nameTc: '純審計安排（中小企CPA）', nameEn: 'Audit Arrangement Only (SME CPA)', nameSc: '纯审计安排（中小企CPA）', price: 'HK$3,999起' },
  { p: 'E', code: 'TAX_FILING', nameTc: '利得稅報稅表申報', nameEn: 'Profits Tax Return Filing', nameSc: '利得税报税表申报', price: 'HK$2,500起' },
  { p: 'E', code: 'TAX_OFFSHORE', nameTc: '境外收入豁免申請', nameEn: 'Offshore Tax Exemption Application', nameSc: '境外收入豁免申请', price: 'HK$8,000起' },
  { p: 'E', code: 'TAX_ADVISORY', nameTc: '稅務規劃及顧問', nameEn: 'Tax Planning & Advisory', nameSc: '税务规划及顾问', price: '詢價' },
  { p: 'F', code: 'VO', nameTc: '虛擬辦公室及註冊地址', nameEn: 'Virtual Office & Registered Address', nameSc: '虚拟办公室及注册地址', price: 'HK$800/年' },
  { p: 'F', code: 'MAIL', nameTc: '郵件處理及轉發', nameEn: 'Mail Handling & Forwarding', nameSc: '邮件处理及转发', price: 'HK$1,200/年' },
  { p: 'F', code: 'MEETING', nameTc: '會議室（日票）', nameEn: 'Meeting Room (Day Pass)', nameSc: '会议室（日票）', price: 'HK$500/天' },
  { p: 'G', code: 'F_SCR', nameTc: '重要控制人登記冊', nameEn: 'Significant Controllers Register (SCR)', nameSc: '重要控制人登记册', price: 'HK$800' },
  { p: 'G', code: 'F_BRANCH', nameTc: '分行註冊', nameEn: 'Branch Office Registration', nameSc: '分行注册', price: 'HK$1,500' },
  { p: 'G', code: 'F_CO_RENAME', nameTc: '公司更名', nameEn: 'Company Name Change', nameSc: '公司更名', price: 'HK$1,200' },
  { p: 'G', code: 'F_NOTARY', nameTc: '國際公證 + 高等法院加簽', nameEn: 'International Notarisation + Apostille', nameSc: '国际公证 + 高等法院加签', price: '詢價' },
  { p: 'G', code: 'F_TRADEMARK', nameTc: '香港商標註冊', nameEn: 'Hong Kong Trademark Registration', nameSc: '香港商标注册', price: '詢價' },
  { p: 'G', code: 'F_BUSCAP', nameTc: '增加註冊股本', nameEn: 'Increase Registered Share Capital', nameSc: '增加注册股本', price: 'HK$800' },
  { p: 'H', code: 'G_HKTP', nameTc: '高端人才通行證計劃（TTPS）', nameEn: 'Top Talent Pass Scheme (TTPS)', nameSc: '高端人才通行证计划（TTPS）', price: '詢價' },
  { p: 'H', code: 'G_QMAS', nameTc: '優質移民入境計劃（QMAS）', nameEn: 'Quality Migrant Admission Scheme (QMAS)', nameSc: '优才计划（QMAS）', price: '詢價' },
  { p: 'H', code: 'G_IANG', nameTc: '輸入內地人才計劃（IANG）', nameEn: 'Admission of Mainland Talents (IANG)', nameSc: '输入内地人才计划（IANG）', price: '詢價' },
  { p: 'H', code: 'G_RENEWAL', nameTc: '簽證 / 許可証續期', nameEn: 'Visa / Permit Renewal', nameSc: '签证 / 许可证续期', price: '詢價' },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: t(locale, 'Sandbox Marketplace | 服務市場', 'Sandbox Marketplace', 'Sandbox Marketplace | 服务市场'),
  };
}

export default async function MarketplacePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const lk = lkOf(locale);

  const [courses, dbServices] = await Promise.all([
    prisma.cptCourse.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    }),
    prisma.package.findMany({
      where: { group: { in: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] } },
      orderBy: [{ group: 'asc' }, { order: 'asc' }],
    }),
  ]);

  const svcs = dbServices.length > 0
    ? dbServices.map(p => ({
        p: p.group,
        code: p.id,
        nameTc: (p.name as Record<string, string>).tc,
        nameEn: (p.name as Record<string, string>).en,
        nameSc: (p.name as Record<string, string>).sc,
        price: p.price,
        popular: p.featured,
      }))
    : SVCS_FALLBACK;

  const pillars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].filter(p => svcs.some(s => s.p === p));
  const waBase = `https://wa.me/${WA_NUMBER.replace(/\D/g, '')}`;

  const getName = (svc: typeof svcs[0]) =>
    lk === 'en' ? svc.nameEn : lk === 'sc' ? svc.nameSc : svc.nameTc;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0F2557 0%, #1a3a7c 100%)', color: '#fff', padding: '64px 24px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#C9A84C' }}>
              Sandbox Group
            </span>
            <span style={{ width: 32, height: 1, background: '#C9A84C' }} />
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>
              Marketplace
            </span>
          </div>
          <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', margin: '0 0 12px', lineHeight: 1.2 }}>
            Sandbox Marketplace
          </h1>
          <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '1rem', color: 'rgba(255,255,255,.75)', maxWidth: 600, lineHeight: 1.7, margin: 0 }}>
            {t(locale,
              '一站式採購企業服務及專業培訓課程',
              'One-stop shop for corporate services and professional training courses',
              '一站式采购企业服务及专业培训课程'
            )}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>

        {/* CPT Courses Section */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 6 }}>
                {t(locale, '持續專業培訓', 'Continuing Professional Training', '持续专业培训')}
              </div>
              <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#0F2557', margin: 0 }}>
                CPT {t(locale, '培訓課程', 'Training Courses', '培训课程')}
              </h2>
            </div>
            <Link href={localePath(locale, '/compliance/cpt-marketplace')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', background: 'transparent',
              border: '1.5px solid #0F2557', color: '#0F2557',
              fontFamily: "'Montserrat',sans-serif", fontSize: '.8rem', fontWeight: 700,
              textDecoration: 'none', transition: 'all .2s',
            }}>
              {t(locale, '查看全部課程', 'View All Courses', '查看全部课程')} →
            </Link>
          </div>

          {courses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎓</div>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", color: '#94A3B8', margin: 0 }}>
                {t(locale, '課程即將上線', 'Courses coming soon', '课程即将上线')}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {courses.map(course => {
                const name = (course.name as Record<string, string>);
                const desc = (course.description as Record<string, string>);
                const courseName = lk === 'en' ? name.en : lk === 'sc' ? name.sc : name.tc;
                const courseDesc = lk === 'en' ? desc.en : lk === 'sc' ? desc.sc : desc.tc;
                return (
                  <Link key={course.id} href={localePath(locale, `/compliance/cpt-marketplace/${course.id}`)} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#fff', border: '1px solid #E2E8F0', overflow: 'hidden', transition: 'box-shadow .2s', cursor: 'pointer' }}>
                      {course.thumbnailUrl ? (
                        <div style={{ height: 180, overflow: 'hidden', background: '#0F2557' }}>
                          <img src={course.thumbnailUrl} alt={courseName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ height: 180, background: 'linear-gradient(135deg, #0F2557, #1a3a7c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '3rem' }}>🎓</span>
                        </div>
                      )}
                      <div style={{ padding: '20px 24px' }}>
                        {course.featured && (
                          <span style={{ display: 'inline-block', background: '#C9A84C', color: '#fff', fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.08em', padding: '3px 8px', textTransform: 'uppercase', marginBottom: 10 }}>
                            {t(locale, '精選', 'Featured', '精选')}
                          </span>
                        )}
                        <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', margin: '0 0 8px', lineHeight: 1.4 }}>
                          {courseName}
                        </h3>
                        <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', color: '#64748B', margin: '0 0 16px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {courseDesc}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#EF4444' }}>
                            HK${course.price.toLocaleString()}
                          </span>
                          <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.75rem', fontWeight: 700, color: '#0F2557', borderBottom: '1.5px solid #0F2557', paddingBottom: 1 }}>
                            {t(locale, '立即購買', 'Buy Now', '立即购买')} →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Corporate Services Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 6 }}>
                {t(locale, '企業服務', 'Corporate Services', '企业服务')}
              </div>
              <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#0F2557', margin: 0 }}>
                {t(locale, '服務一覽', 'All Services', '服务一览')}
              </h2>
            </div>
            <Link href={localePath(locale, '/quotation/corporate')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', background: '#EF4444', color: '#fff',
              fontFamily: "'Montserrat',sans-serif", fontSize: '.8rem', fontWeight: 700,
              textDecoration: 'none',
            }}>
              {t(locale, '企業報價計算器', 'Get a Quote', '企业报价计算器')} →
            </Link>
          </div>

          {pillars.map(pillar => (
            <div key={pillar} style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: '1.4rem' }}>{PILLAR_ICONS[pillar]}</span>
                <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', margin: 0 }}>
                  {PILLAR_NAMES[lk][pillar]}
                </h3>
                <div style={{ flex: 1, height: 1, background: '#E2E8F0', marginLeft: 8 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {svcs.filter(s => s.p === pillar).map(svc => {
                  const name = getName(svc);
                  const waMsg = encodeURIComponent(`Hi Sandbox Corporate，我想查詢：${name}（${svc.price}）`);
                  return (
                    <div key={svc.code} style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
                      {svc.popular && (
                        <span style={{ position: 'absolute', top: 12, right: 12, background: '#EF4444', color: '#fff', fontFamily: "'Montserrat',sans-serif", fontSize: '.6rem', fontWeight: 700, letterSpacing: '.08em', padding: '2px 7px', textTransform: 'uppercase' }}>
                          {t(locale, '熱門', 'Popular', '热门')}
                        </span>
                      )}
                      <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 600, fontSize: '.9rem', color: '#0F2557', lineHeight: 1.5, paddingRight: svc.popular ? 48 : 0 }}>
                        {name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                        <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.95rem', color: '#EF4444' }}>
                          {svc.price}
                        </span>
                        <a
                          href={`${waBase}?text=${waMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#25D366', color: '#fff', padding: '7px 14px', fontFamily: "'Montserrat',sans-serif", fontSize: '.75rem', fontWeight: 700, textDecoration: 'none' }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M11.999 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.86 1.428 5.492L2 22l4.641-1.395C8.26 21.468 10.093 22 12 22c5.523 0 10-4.483 10-10.003C22 6.484 17.523 2 12 2z" /></svg>
                          {t(locale, '查詢', 'Enquire', '查询')}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
