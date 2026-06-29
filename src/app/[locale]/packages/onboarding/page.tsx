export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { prisma } from '@/lib/prisma';
import OnboardingForm from './OnboardingForm';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';
function t(locale: Locale, tc: string, en: string, sc: string) { return locale === 'en' ? en : locale === 'zh-Hans' ? sc : tc; }
function lp(locale: Locale, path: string) { return locale === 'zh-Hant' ? path : `/${locale}${path}`; }
type LK = 'tc' | 'en' | 'sc';

export default async function OnboardingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale } = await params;
  const { session_id } = await searchParams;

  if (!session_id) redirect(lp(locale, '/packages'));

  const waRow = await prisma.setting.findUnique({ where: { key: 'whatsapp_number' } });
  const waNumber = waRow?.value || '+85292318254';

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, { expand: ['line_items'] });
  } catch {
    redirect(lp(locale, '/packages'));
  }

  if (session.payment_status !== 'paid') redirect(lp(locale, '/packages'));

  const k: LK = locale === 'en' ? 'en' : locale === 'zh-Hans' ? 'sc' : 'tc';
  const rawMeta = session.metadata?.itemMeta;
  const itemMeta: { type: string; id: string; name: Record<string, string>; amount: number }[] = rawMeta ? JSON.parse(rawMeta) : [];
  const items = itemMeta.map(i => ({ name: i.name[k] || i.name.tc, amount: i.amount }));
  const total = items.reduce((s, i) => s + i.amount, 0);

  const customerEmail = session.customer_details?.email || '';
  const customerName = session.customer_details?.name || '';

  return (
    <>
      <SiteHeader locale={locale} waNumber={waNumber} />

      {/* Success banner */}
      <div style={{ background: '#065F46', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#fff' }}>
          {t(locale,'付款成功！請填寫以下資料以開始服務。','Payment successful! Please complete the form below to begin your service.','付款成功！请填写以下资料以开始服务。')}
        </span>
      </div>

      <div style={{ background: '#F8FAFC', padding: '48px 0 72px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 8 }}>
              — {t(locale,'服務開通所需資料','Service Onboarding','服务开通所需资料')}
            </p>
            <h1 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 800, fontSize: 'clamp(1.3rem,3vw,1.7rem)', color: '#0F2557', lineHeight: 1.3 }}>
              {t(locale,'請填寫您的資料','Please provide your details','请填写您的资料')}
            </h1>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#64748B', lineHeight: 1.75, marginTop: 8 }}>
              {t(locale,
                '以下資料將幫助我們為您提供服務。所有資料均受保密協議保護。',
                'The following details help us deliver your services. All information is protected under confidentiality agreements.',
                '以下资料将帮助我们为您提供服务。所有资料均受保密协议保护。'
              )}
            </p>
          </div>

          <OnboardingForm
            locale={locale}
            sessionId={session_id}
            items={items}
            total={total}
            customerEmail={customerEmail}
            customerName={customerName}
          />
        </div>
      </div>

      <SiteFooter locale={locale} waNumber={waNumber} />
    </>
  );
}
