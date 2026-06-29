export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';
type LK = 'tc' | 'en' | 'sc';

function lk(locale: Locale): LK { return locale === 'en' ? 'en' : locale === 'zh-Hans' ? 'sc' : 'tc'; }
function lp(locale: Locale, path: string) { return locale === 'zh-Hant' ? path : `/${locale}${path}`; }
function t(locale: Locale, tc: string, en: string, sc: string) { return locale === 'en' ? en : locale === 'zh-Hans' ? sc : tc; }

function getVideoEmbed(url: string): string | null {
  if (!url) return null;
  // Vimeo: https://vimeo.com/123456789
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  // YouTube: https://youtube.com/watch?v=xxx or https://youtu.be/xxx
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
  // Direct video (Blob URL) — return as-is for <video> tag
  return url;
}

export default async function CptSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale } = await params;
  const { session_id } = await searchParams;
  const k = lk(locale);

  if (!session_id) redirect(lp(locale, '/compliance/cpt-marketplace'));

  const waRow = await prisma.setting.findUnique({ where: { key: 'whatsapp_number' } });
  const waNumber = waRow?.value || '+85292318254';

  // Verify payment with Stripe
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    redirect(lp(locale, '/compliance/cpt-marketplace'));
  }

  if (session.payment_status !== 'paid') {
    redirect(lp(locale, '/compliance/cpt-marketplace'));
  }

  const courseId = session.metadata?.courseId;
  if (!courseId) redirect(lp(locale, '/compliance/cpt-marketplace'));

  const course = await prisma.cptCourse.findUnique({ where: { id: courseId } });
  if (!course) redirect(lp(locale, '/compliance/cpt-marketplace'));

  // Record purchase (idempotent — webhook may have already done this)
  await prisma.cptPurchase.upsert({
    where: { stripeSessionId: session_id },
    create: {
      stripeSessionId: session_id,
      courseId,
      email: session.customer_details?.email || '',
      name: session.customer_details?.name || null,
      amountPaid: (session.amount_total ?? 0) / 100,
    },
    update: {},
  });

  const name = (course.name as Record<string, string>)[k] || (course.name as Record<string, string>).tc;
  const embedUrl = course.videoUrl ? getVideoEmbed(course.videoUrl) : null;
  const isDirectVideo = embedUrl && !embedUrl.includes('vimeo') && !embedUrl.includes('youtube');

  return (
    <>
      <SiteHeader locale={locale} waNumber={waNumber} />

      {/* Success banner */}
      <div style={{ background: '#065F46', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.9rem', color: '#fff' }}>
          {t(locale, '付款成功！課程已解鎖。', 'Payment successful! Course unlocked.', '付款成功！课程已解锁。')}
        </span>
      </div>

      <div style={{ background: '#F8FAFC', padding: '48px 0 72px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>

          {/* Course title */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 8 }}>
              {t(locale, '您已購買', 'You purchased', '您已购买')}
            </div>
            <h1 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 800, fontSize: 'clamp(1.3rem,3vw,1.8rem)', color: '#0F2557', lineHeight: 1.3 }}>{name}</h1>
          </div>

          {/* Video player */}
          {embedUrl ? (
            <div style={{ background: '#000', aspectRatio: '16/9', marginBottom: 28, position: 'relative' }}>
              {isDirectVideo ? (
                <video controls autoPlay style={{ width: '100%', height: '100%' }} src={embedUrl} />
              ) : (
                <iframe
                  src={embedUrl}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          ) : (
            <div style={{ background: '#0F2557', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="rgba(255,255,255,.3)"><path d="M8 5v14l11-7z"/></svg>
              <p style={{ color: 'rgba(255,255,255,.5)', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem' }}>
                {t(locale, '課程視頻即將上線，我們將透過電郵通知您。', 'Course video coming soon — you will be notified by email.', '课程视频即将上线，我们将通过电邮通知您。')}
              </p>
            </div>
          )}

          {/* Purchase details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="success-grid">
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '20px 24px' }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 14 }}>
                {t(locale, '購買詳情', 'Purchase Details', '购买详情')}
              </div>
              {[
                [t(locale, '電郵', 'Email', '电邮'), session.customer_details?.email || '—'],
                [t(locale, '姓名', 'Name', '姓名'), session.customer_details?.name || '—'],
                [t(locale, '付款金額', 'Amount paid', '付款金额'), `HK$${((session.amount_total ?? 0) / 100).toLocaleString()}`],
                ['Stripe ID', session_id.slice(0, 20) + '…'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9', gap: 12 }}>
                  <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#94A3B8' }}>{k}</span>
                  <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#334155', fontWeight: 600, textAlign: 'right', wordBreak: 'break-all' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#0F2557', padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 14 }}>
                {t(locale, '需要協助？', 'Need help?', '需要协助？')}
              </div>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', color: 'rgba(255,255,255,.7)', lineHeight: 1.75, marginBottom: 20 }}>
                {t(locale, '如有任何問題，請透過 WhatsApp 聯絡我們，我們將在一個工作天內回覆。', 'For any queries, WhatsApp us and we will respond within one business day.', '如有任何问题，请通过 WhatsApp 联系我们，我们将在一个工作天内回复。')}
              </p>
              <a
                href={`https://wa.me/${waNumber.replace(/\D/g,'')}?text=${encodeURIComponent(t(locale,`Hi Sandbox Compliance，我已購買 CPT 課程「${name}」，需要協助。`,`Hi Sandbox Compliance, I purchased the CPT course "${name}" and need assistance.`,`Hi Sandbox Compliance，我已购买 CPT 课程「${name}」，需要协助。`))}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', color: '#fff', padding: '12px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', textDecoration: 'none' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.86 1.428 5.492L2 22l4.641-1.395A9.953 9.953 0 0012 22c5.523 0 10-4.483 10-10.003C22 6.484 17.523 2 12 2z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link href={lp(locale, '/compliance/cpt-marketplace')} style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', color: '#64748B', textDecoration: 'none' }}>
              ← {t(locale, '返回課程列表', 'Back to all courses', '返回课程列表')}
            </Link>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:640px){.success-grid{grid-template-columns:1fr!important}}`}</style>
      <SiteFooter locale={locale} waNumber={waNumber} />
    </>
  );
}
