export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';
type LK = 'tc' | 'en' | 'sc';

function lk(locale: Locale): LK {
  return locale === 'en' ? 'en' : locale === 'zh-Hans' ? 'sc' : 'tc';
}
function lp(locale: Locale, path: string) {
  return locale === 'zh-Hant' ? path : `/${locale}${path}`;
}
function t(locale: Locale, tc: string, en: string, sc: string) {
  return locale === 'en' ? en : locale === 'zh-Hans' ? sc : tc;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return {
    title: t(locale, 'CPT 持續專業培訓課程 — Sandbox Compliance', 'CPT Training Marketplace — Sandbox Compliance', 'CPT 持续专业培训课程 — Sandbox Compliance'),
    description: t(locale, 'SFC 認可持續專業培訓課程。即時購買，立即觀看。', 'SFC-approved CPT courses. Buy instantly, watch immediately.', 'SFC 认可持续专业培训课程。即时购买，立即观看。'),
  };
}

export default async function CptMarketplacePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const k = lk(locale);

  const courses = await prisma.cptCourse.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
  });

  const waNumber = await prisma.setting.findUnique({ where: { key: 'whatsapp_number' } }).then(r => r?.value || '+85292318254');

  return (
    <>
      <SiteHeader locale={locale} waNumber={waNumber} />

      {/* Hero */}
      <section style={{ background: '#0F2557', padding: '52px 0 44px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%,rgba(201,168,76,.12) 0%,transparent 65%)', zIndex: 0 }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 14 }}>
            — SANDBOX COMPLIANCE · CPT MARKETPLACE
          </p>
          <h1 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: '#fff', lineHeight: 1.15, marginBottom: 12 }}>
            {t(locale, '持續專業培訓課程', 'CPT Training Courses', '持续专业培训课程')}
          </h1>
          <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: 'rgba(255,255,255,.7)', maxWidth: 560, lineHeight: 1.8, marginBottom: 0 }}>
            {t(locale,
              'SFC 認可 CPT 課程，即購即看。課程涵蓋 AML/CFT、監管更新、ESG 及合規最佳實踐。',
              'SFC-approved CPT courses. Buy and watch instantly. Topics include AML/CFT, regulatory updates, ESG and compliance best practices.',
              'SFC 认可 CPT 课程，即购即看。课程涵盖 AML/CFT、监管更新、ESG 及合规最佳实践。'
            )}
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '10px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', fontSize: '.78rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href={lp(locale, '/compliance')} style={{ color: '#64748B', textDecoration: 'none' }}>{t(locale, '持續合規', 'Compliance', '持续合规')}</Link>
          <span>›</span>
          <span style={{ color: '#0F2557', fontWeight: 600 }}>{t(locale, 'CPT 課程', 'CPT Courses', 'CPT 课程')}</span>
        </div>
      </div>

      {/* Course grid */}
      <div style={{ background: '#F8FAFC', padding: '48px 0 72px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          {courses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎓</div>
              <p style={{ fontSize: '1rem', color: '#94A3B8' }}>{t(locale, '課程即將推出，敬請期待。', 'Courses coming soon.', '课程即将推出，敬请期待。')}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
              {courses.map(c => {
                const name = (c.name as Record<string, string>)[k] || (c.name as Record<string, string>).tc;
                const desc = (c.description as Record<string, string>)[k] || '';
                return (
                  <Link key={c.id} href={lp(locale, `/compliance/cpt-marketplace/${c.id}`)} style={{ textDecoration: 'none', display: 'block' }}>
                    <div style={{ background: '#fff', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', height: '100%', borderTop: c.featured ? '3px solid #C9A84C' : '3px solid #0F2557' }}>
                      {/* Thumbnail */}
                      <div style={{ position: 'relative', background: '#0F2557', aspectRatio: '16/9', overflow: 'hidden', flexShrink: 0 }}>
                        {c.thumbnailUrl ? (
                          <img src={c.thumbnailUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="rgba(255,255,255,.2)"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        )}
                        {c.featured && (
                          <span style={{ position: 'absolute', top: 10, left: 10, background: '#C9A84C', color: '#fff', fontFamily: "'Montserrat',sans-serif", fontSize: '.6rem', fontWeight: 700, padding: '3px 8px', letterSpacing: '.08em' }}>
                            {t(locale, '精選', 'FEATURED', '精选')}
                          </span>
                        )}
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(239,68,68,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.95rem', color: '#0F2557', lineHeight: 1.4, marginBottom: 8 }}>{name}</h3>
                        {desc && <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#64748B', lineHeight: 1.7, marginBottom: 16, flex: 1 }}>{desc.length > 100 ? desc.slice(0, 100) + '…' : desc}</p>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                          <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.15rem', color: '#EF4444' }}>HK${c.price.toLocaleString()}</span>
                          <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.8rem', color: '#0F2557', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                            {t(locale, '立即購買 →', 'Buy Now →', '立即购买 →')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <SiteFooter locale={locale} waNumber={waNumber} />
    </>
  );
}
