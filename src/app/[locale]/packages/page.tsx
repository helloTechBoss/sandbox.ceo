export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PackagesShell, { PkgItem, CptItem } from './PackagesShell';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';
function t(locale: Locale, tc: string, en: string, sc: string) { return locale === 'en' ? en : locale === 'zh-Hans' ? sc : tc; }

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return {
    title: t(locale, 'Sandbox Marketplace — 服務市場', 'Sandbox Marketplace', 'Sandbox Marketplace — 服务市场'),
    description: t(locale, '一站式選購企業服務及 CPT 培訓課程。多項服務同時選擇，一次付款。', 'Browse and purchase corporate services and CPT training in one place.', '一站式选购企业服务及 CPT 培训课程。'),
  };
}

const GROUP_ORDER = ['A','B','C','D','E','F','G','H','mso','incorporation','comsec','accounting','audit','compliance','licensing','tech'];

export default async function PackagesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  const [allPkgs, cptRaw, waRow] = await Promise.all([
    prisma.package.findMany({
      orderBy: [{ group: 'asc' }, { order: 'asc' }],
      include: { features: { where: { enabled: true }, orderBy: { order: 'asc' } } },
    }),
    prisma.cptCourse.findMany({ where: { published: true }, orderBy: [{ featured: 'desc' }, { order: 'asc' }] }),
    prisma.setting.findUnique({ where: { key: 'whatsapp_number' } }),
  ]);

  const waNumber = waRow?.value || '+85292318254';

  const groupMap = new Map<string, PkgItem[]>();
  for (const pkg of allPkgs) {
    if (!groupMap.has(pkg.group)) groupMap.set(pkg.group, []);
    groupMap.get(pkg.group)!.push({
      id: pkg.id, group: pkg.group, tierLabel: pkg.tierLabel,
      name: pkg.name as PkgItem['name'], price: pkg.price, stripeAmount: pkg.stripeAmount,
      featured: pkg.featured,
      features: pkg.features.map(f => ({ label: f.label as PkgItem['features'][0]['label'], enabled: f.enabled })),
    });
  }

  const packageGroups = [...groupMap.entries()]
    .sort(([a], [b]) => {
      const ai = GROUP_ORDER.indexOf(a), bi = GROUP_ORDER.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    })
    .map(([group, items]) => ({ group, items }));

  const cptCourses: CptItem[] = cptRaw.map(c => ({
    id: c.id, name: c.name as CptItem['name'], price: c.price,
    description: c.description as CptItem['description'],
    thumbnailUrl: c.thumbnailUrl, featured: c.featured,
  }));

  const totalServices = allPkgs.filter(p => p.stripeAmount !== null).length;

  return (
    <>
      <SiteHeader locale={locale} waNumber={waNumber} />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: 500, display: 'flex', alignItems: 'center', overflow: 'hidden', backgroundColor: '#0F2557' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80"
          alt="" aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%', zIndex: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg,rgba(9,26,62,.93) 0%,rgba(9,26,62,.8) 55%,rgba(9,26,62,.5) 100%)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '80px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 2, background: '#C9A84C' }} />
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.2em', color: '#E8D28A', textTransform: 'uppercase' }}>
              SANDBOX GROUP · MARKETPLACE
            </span>
          </div>

          <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#fff', lineHeight: 1.1, marginBottom: 16, maxWidth: 640 }}>
            {t(locale, '企業服務及培訓', 'Corporate Services\n& Training', '企业服务及培训')}<br />
            <span style={{ color: '#EF4444' }}>Marketplace</span>
          </h1>

          <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.97rem', color: 'rgba(255,255,255,.72)', maxWidth: 520, lineHeight: 1.9, marginBottom: 36 }}>
            {t(locale,
              '一站式選購企業服務及 CPT 持續培訓課程。登記成為會員，即可多項選擇，一次付款。',
              'One-stop shop for corporate services and CPT training. Register as a member, select multiple services, and pay in a single checkout.',
              '一站式选购企业服务及 CPT 持续培训课程。注册成为会员，即可多项选择，一次付款。'
            )}
          </p>

          {/* Stat pills */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { num: `${totalServices}+`, label: t(locale, '可購買服務', 'Purchasable Services', '可购买服务') },
              { num: `${cptRaw.length}`, label: t(locale, 'CPT 課程', 'CPT Courses', 'CPT 课程') },
              { num: '1', label: t(locale, '次付款', 'Checkout', '次付款') },
            ].map(s => (
              <div key={s.num} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', padding: '14px 22px', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#fff', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.72rem', color: '#94A3B8', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '16px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[
            t(locale, '登記成為會員即可購買', 'Register to purchase', '注册成为会员即可购买'),
            t(locale, 'Stripe 安全付款', 'Secured by Stripe', 'Stripe 安全付款'),
            t(locale, '付款後提交所需資料', 'Submit documents after payment', '付款后提交所需资料'),
            t(locale, '我們主動跟進為您服務', 'We follow up with you', '我们主动跟进为您服务'),
          ].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#64748B' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {label}
            </div>
          ))}
        </div>
      </div>

      <PackagesShell locale={locale} waNumber={waNumber} packageGroups={packageGroups} cptCourses={cptCourses} />

      <SiteFooter locale={locale} waNumber={waNumber} />
    </>
  );
}
