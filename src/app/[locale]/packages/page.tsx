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
    title: t(locale, '服務套餐及培訓課程 — Sandbox Group', 'Service Packages & Training — Sandbox Group', '服务套餐及培训课程 — Sandbox Group'),
    description: t(locale, '一站式選購企業服務套餐及 CPT 培訓課程。多項服務同時選擇，一次付款。', 'Browse and purchase service packages and CPT training courses in one place.', '一站式选购企业服务套餐及 CPT 培训课程。多项服务同时选择，一次付款。'),
  };
}

// Groups to exclude from the master packages page (handled separately on quotation page)
const EXCLUDE_GROUPS = new Set(['A','B','C','D','E','F','G','H']);

export default async function PackagesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  const [allPkgs, cptRaw, waRow] = await Promise.all([
    prisma.package.findMany({
      where: { group: { notIn: [...EXCLUDE_GROUPS] } },
      orderBy: [{ group: 'asc' }, { order: 'asc' }],
      include: { features: { where: { enabled: true }, orderBy: { order: 'asc' } } },
    }),
    prisma.cptCourse.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    }),
    prisma.setting.findUnique({ where: { key: 'whatsapp_number' } }),
  ]);

  const waNumber = waRow?.value || '+85292318254';

  // Group packages
  const groupMap = new Map<string, PkgItem[]>();
  for (const pkg of allPkgs) {
    if (!groupMap.has(pkg.group)) groupMap.set(pkg.group, []);
    groupMap.get(pkg.group)!.push({
      id: pkg.id,
      group: pkg.group,
      tierLabel: pkg.tierLabel,
      name: pkg.name as PkgItem['name'],
      price: pkg.price,
      stripeAmount: pkg.stripeAmount,
      featured: pkg.featured,
      features: pkg.features.map(f => ({ label: f.label as PkgItem['features'][0]['label'], enabled: f.enabled })),
    });
  }

  const packageGroups = [...groupMap.entries()].map(([group, items]) => ({ group, items }));

  const cptCourses: CptItem[] = cptRaw.map(c => ({
    id: c.id,
    name: c.name as CptItem['name'],
    price: c.price,
    description: c.description as CptItem['description'],
    thumbnailUrl: c.thumbnailUrl,
    featured: c.featured,
  }));

  return (
    <>
      <SiteHeader locale={locale} waNumber={waNumber} />

      {/* Hero */}
      <section style={{ background: '#0F2557', padding: '52px 0 44px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 50%,rgba(201,168,76,.12) 0%,transparent 65%)', zIndex: 0 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 14 }}>
            — SANDBOX GROUP · PACKAGES & PLANS
          </p>
          <h1 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: '#fff', lineHeight: 1.15, marginBottom: 12 }}>
            {t(locale, '服務套餐及培訓課程', 'Service Packages & Training', '服务套餐及培训课程')}
          </h1>
          <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: 'rgba(255,255,255,.7)', maxWidth: 580, lineHeight: 1.8 }}>
            {t(locale,
              '選擇一項或多項服務，一次付款，完成後我們會聯絡您提供所需資料。',
              'Select one or more services, pay in a single checkout. We will contact you to collect the required information after payment.',
              '选择一项或多项服务，一次付款，完成后我们会联络您提供所需资料。'
            )}
          </p>
        </div>
      </section>

      <PackagesShell
        locale={locale}
        waNumber={waNumber}
        packageGroups={packageGroups}
        cptCourses={cptCourses}
      />

      <SiteFooter locale={locale} waNumber={waNumber} />
    </>
  );
}
