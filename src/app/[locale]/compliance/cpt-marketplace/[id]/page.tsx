export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';
import BuyButton from './BuyButton';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';
type LK = 'tc' | 'en' | 'sc';

function lk(locale: Locale): LK { return locale === 'en' ? 'en' : locale === 'zh-Hans' ? 'sc' : 'tc'; }
function lp(locale: Locale, path: string) { return locale === 'zh-Hant' ? path : `/${locale}${path}`; }
function t(locale: Locale, tc: string, en: string, sc: string) { return locale === 'en' ? en : locale === 'zh-Hans' ? sc : tc; }

export default async function CptCoursePage({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
  const { locale, id } = await params;
  const k = lk(locale);

  const [course, waRow] = await Promise.all([
    prisma.cptCourse.findUnique({ where: { id } }),
    prisma.setting.findUnique({ where: { key: 'whatsapp_number' } }),
  ]);

  if (!course || !course.published) notFound();

  const waNumber = waRow?.value || '+85292318254';
  const name = (course.name as Record<string, string>)[k] || (course.name as Record<string, string>).tc;
  const desc = (course.description as Record<string, string>)[k] || '';

  return (
    <>
      <SiteHeader locale={locale} waNumber={waNumber} />

      {/* Breadcrumb */}
      <div style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '10px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', fontSize: '.78rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href={lp(locale, '/compliance')} style={{ color: '#64748B', textDecoration: 'none' }}>{t(locale, '持續合規', 'Compliance', '持续合规')}</Link>
          <span>›</span>
          <Link href={lp(locale, '/compliance/cpt-marketplace')} style={{ color: '#64748B', textDecoration: 'none' }}>{t(locale, 'CPT 課程', 'CPT Courses', 'CPT 课程')}</Link>
          <span>›</span>
          <span style={{ color: '#0F2557', fontWeight: 600 }}>{name}</span>
        </div>
      </div>

      <div style={{ background: '#F8FAFC', padding: '48px 0 72px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }} className="course-detail-grid">

          {/* Left: video preview + description */}
          <div>
            {/* Video preview (teaser / thumbnail) */}
            <div style={{ background: '#0F2557', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', marginBottom: 28 }}>
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="rgba(255,255,255,.2)"><path d="M8 5v14l11-7z"/></svg>
                  <p style={{ color: 'rgba(255,255,255,.4)', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem' }}>{t(locale, '購買後即可觀看完整課程', 'Full course available after purchase', '购买后即可观看完整课程')}</p>
                </div>
              )}
              {/* Overlay lock */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,26,62,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <p style={{ color: '#fff', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', fontWeight: 600 }}>
                  {t(locale, '購買後解鎖完整課程', 'Unlocked after purchase', '购买后解锁完整课程')}
                </p>
              </div>
            </div>

            {/* Description card */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '28px' }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 14 }}>
                {t(locale, '課程詳情', 'Course Details', '课程详情')}
              </div>
              <h1 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#0F2557', lineHeight: 1.3, marginBottom: 16 }}>{name}</h1>
              {desc && (
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#475569', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{desc}</p>
              )}
              <div style={{ marginTop: 24, padding: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#64748B', lineHeight: 1.8 }}>
                  {t(locale,
                    '✓ SFC 認可 CPT 課程\n✓ 即購即看，終身訪問\n✓ 提供培訓完成記錄',
                    '✓ SFC-approved CPT course\n✓ Instant access, lifetime viewing\n✓ Training completion record provided',
                    '✓ SFC 认可 CPT 课程\n✓ 即购即看，终身访问\n✓ 提供培训完成记录'
                  ).split('\n').map((line, i) => <div key={i}>{line}</div>)}
                </div>
              </div>
            </div>
          </div>

          {/* Right: purchase box */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ background: '#0F2557' }}>
              <div style={{ background: '#EF4444', padding: '12px 20px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.9rem', color: '#fff' }}>
                {t(locale, '立即購買課程', 'Purchase This Course', '立即购买课程')}
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '2rem', fontWeight: 900, color: '#fff' }}>HK${course.price.toLocaleString()}</div>
                  <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.78rem', color: 'rgba(255,255,255,.5)', marginTop: 4 }}>
                    {t(locale, '一次性付款 · 終身訪問', 'One-time payment · Lifetime access', '一次性付款 · 终身访问')}
                  </div>
                </div>
                <BuyButton courseId={id} locale={locale} price={course.price} label={t(locale, '立即購買', 'Buy Now', '立即购买')} />
                <div style={{ marginTop: 16, fontSize: '.75rem', color: 'rgba(255,255,255,.45)', fontFamily: "'Noto Sans TC',sans-serif", lineHeight: 1.7, textAlign: 'center' }}>
                  {t(locale, '由 Stripe 安全付款處理', 'Powered by Stripe secure payments', '由 Stripe 安全付款处理')}
                </div>
              </div>
            </div>

            {/* WhatsApp enquiry */}
            <div style={{ marginTop: 12, background: '#fff', border: '1px solid #E2E8F0', padding: '16px 20px' }}>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>
                {t(locale, '有任何問題？WhatsApp 查詢', 'Questions? WhatsApp us', '有任何问题？WhatsApp 查询')}
              </p>
              <a
                href={`https://wa.me/${waNumber.replace(/\D/g,'')}?text=${encodeURIComponent(t(locale,`Hi Sandbox Compliance，我想查詢 CPT 課程：${name}`,`Hi Sandbox Compliance, I'd like to enquire about the CPT course: ${name}`,`Hi Sandbox Compliance，我想查询 CPT 课程：${name}`))}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', color: '#fff', padding: '11px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.85rem', textDecoration: 'none' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.86 1.428 5.492L2 22l4.641-1.395A9.953 9.953 0 0012 22c5.523 0 10-4.483 10-10.003C22 6.484 17.523 2 12 2z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){.course-detail-grid{grid-template-columns:1fr!important}}
      `}</style>
      <SiteFooter locale={locale} waNumber={waNumber} />
    </>
  );
}
