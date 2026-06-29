export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import InquiryForm from '@/components/InquiryForm';
import { prisma } from '@/lib/prisma';
import { OrgJsonLd } from '@/components/JsonLd';
import { hreflang, ogImage } from '@/lib/seo';
import { getSeoMeta } from '@/lib/getSeoMeta';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';
  const lk = isEn ? 'en' : isSc ? 'sc' : 'tc';
  const { title, description, keywords } = await getSeoMeta('contact', lk, {
    title: isEn ? 'Contact Us' : isSc ? '联络我们' : '聯絡我們',
    description: isEn
      ? 'Get immediate expert advice from our compliance and licensing advisory team via WhatsApp. Free initial consultation — reply within 1 hour during business hours.'
      : isSc
      ? '透过WhatsApp即时获取我们合规及牌照顾问团队的专业建议，提供免费初步评估，办公时间内1小时内回复。'
      : '透過WhatsApp即時獲取我們合規及牌照顧問團隊的專業建議，提供免費初步評估，辦公時間內1小時內回覆。',
    keywords: ['香港合規諮詢', '牌照申請查詢', 'WhatsApp合規顧問', 'compliance consultation Hong Kong', 'MSO licensing enquiry', 'SFC licence advice', 'free compliance consultation'],
  });
  return {
    title,
    description,
    keywords,
    alternates: hreflang('/contact'),
    openGraph: { type: 'website', title, description, url: 'https://www.sandbox.ceo/contact', images: ogImage(title) },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';
  const waNum = await prisma.setting.findUnique({ where: { key: 'whatsapp_number' } });
  const waNumber = waNum?.value || '+85292318254';
  const waHref = `https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi，我想查詢合規及牌照服務')}`;

  return (
    <>
      <OrgJsonLd />
      <SiteHeader locale={locale} waNumber={waNumber} />
      <main>
        {/* Page Hero */}
        <div style={{ background: '#0F2557', padding: '56px 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 10 }}>
              CONTACT
            </p>
            <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff', letterSpacing: '.02em', marginBottom: 8 }}>
              {isEn ? 'Get Immediate Expert Advice' : isSc ? '即时获取专业建议' : '即時獲取專業建議'}
            </h1>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '1rem', color: '#C9A84C', fontWeight: 700, marginBottom: 10 }}>
              {isEn ? 'Get Immediate Expert Response' : isSc ? '立即获取专家回复' : '立即獲取專家回覆'}
            </p>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: 'rgba(255,255,255,.6)', maxWidth: 560, lineHeight: 1.85 }}>
              {isEn
                ? 'Our professional advisory team provides fast WhatsApp responses, giving you the compliance and licensing information you need right away.'
                : isSc
                ? '我们的专业顾问团队提供快速 WhatsApp 回复，即时为您提供所需的合规及牌照资讯。'
                : '我們的專業顧問團隊提供快速 WhatsApp 回覆，即時為您提供所需的合規及牌照資訊。'}
            </p>
          </div>
        </div>

        <section style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }} className="contact-grid">
            {/* Contact Info */}
            <div>
              <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1.3rem', color: '#0F2557', marginBottom: 6 }}>
                {isEn ? 'Hong Kong Office Contact' : isSc ? '香港办公室联络' : '香港辦公室聯絡'}
              </h2>
              <div style={{ width: 44, height: 3, background: '#C9A84C', margin: '12px 0 32px' }} />

              {/* WhatsApp CTA box */}
              <div style={{ background: '#EF4444', padding: 28, marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, color: '#fff', fontSize: '.95rem', marginBottom: 16 }}>
                  {isEn ? 'Get Immediate Expert Response' : isSc ? '即时专家回复' : '即時專家回覆'}
                </h3>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', color: 'rgba(255,255,255,.85)', lineHeight: 1.7, marginBottom: 20 }}>
                  {isEn
                    ? 'Our advisory team responds via WhatsApp within 1 hour during business hours. Send us a message describing your needs for a free initial assessment.'
                    : isSc
                    ? '我们的顾问团队在办公时间内于 1 小时内透过 WhatsApp 回复。发送讯息描述您的需求，获取免费初步评估。'
                    : '我們的顧問團隊在辦公時間內於 1 小時內透過 WhatsApp 回覆。發送訊息描述您的需求，獲取免費初步評估。'}
                </p>
                <a href={waHref} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#fff', color: '#EF4444', padding: '12px 20px',
                  fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.9rem',
                  width: '100%', justifyContent: 'center', textDecoration: 'none',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  {isEn ? 'WhatsApp Us Now' : isSc ? '立即 WhatsApp' : '立即 WhatsApp'}
                </a>
              </div>

              {/* Details */}
              <div style={{ border: '1px solid #E2E8F0', padding: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 6 }}>
                      WhatsApp
                    </div>
                    <a href={waHref} style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '1rem', color: '#0F2557', fontWeight: 700, textDecoration: 'none' }}>
                      {waNumber}
                    </a>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 6 }}>
                      {isEn ? 'Office' : isSc ? '办公室' : '辦公室'}
                    </div>
                    <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      {isEn
                        ? 'Room 1002B, 10/F, Metro Centre II\n21 Lam Hing St, Kowloon Bay\nHong Kong'
                        : isSc
                        ? '香港九龙湾临兴街21号\n美罗中心二期10楼1002B室'
                        : '香港九龍灣臨興街21號\n美羅中心二期10樓1002B室'}
                    </p>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 6 }}>
                      {isEn ? 'Office Hours' : isSc ? '办公时间' : '辦公時間'}
                    </div>
                    <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {isEn
                        ? 'Mon–Fri: 09:00 – 18:00\nWhatsApp received all day, replied during office hours'
                        : isSc
                        ? '周一至周五：09:00 – 18:00\nWhatsApp 全天接收，办公时间内回复'
                        : '週一至週五：09:00 – 18:00\nWhatsApp 全天接收，辦公時間內回覆'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div>
              <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1.3rem', color: '#0F2557', marginBottom: 6 }}>
                {isEn ? 'Send Us an Enquiry' : isSc ? '发送查询' : '發送查詢'}
              </h2>
              <div style={{ width: 44, height: 3, background: '#C9A84C', margin: '12px 0 32px' }} />
              <InquiryForm locale={locale} sourcePage="contact" waNumber={waNumber} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} waNumber={waNumber} />
      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
    </>
  );
}
