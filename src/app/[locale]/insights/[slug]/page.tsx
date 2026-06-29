export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import InquiryForm from '@/components/InquiryForm';
import { prisma } from '@/lib/prisma';
import { ArticleJsonLd } from '@/components/JsonLd';
import { hreflang } from '@/lib/seo';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const lk = locale === 'zh-Hant' ? 'tc' : locale === 'en' ? 'en' : 'sc';
  const article = await prisma.article.findUnique({ where: { slug } }).catch(() => null);
  if (!article) return { title: 'Article Not Found' };
  const title = (article.title as Record<string, string>)?.[lk] ?? '';
  const description = (article.excerpt as Record<string, string>)?.[lk] ?? '';
  return {
    title,
    description,
    alternates: hreflang(`/insights/${slug}`),
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://www.sandbox.ceo/insights/${slug}`,
      publishedTime: article.publishedAt?.toISOString(),
      images: [{ url: '/og-default.png', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';
  const lk = locale === 'zh-Hant' ? 'tc' : locale === 'en' ? 'en' : 'sc';

  const waSetting = await prisma.setting.findUnique({ where: { key: 'whatsapp_number' } }).catch(() => null);
  const waNumber = waSetting?.value || '+85292318254';
  const waBase = `https://wa.me/${waNumber.replace(/\D/g, '')}`;
  const waContact = `${waBase}?text=${encodeURIComponent('Hi，我想查詢合規及牌照服務')}`;

  const article = await prisma.article.findUnique({ where: { slug } }).catch(() => null);

  const t = (tc: string, en: string, sc?: string) => isEn ? en : isSc ? (sc ?? tc) : tc;

  if (!article) {
    return (
      <>
        <SiteHeader locale={locale} waNumber={waNumber} />
        <main>
          <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '4rem', color: '#E2E8F0', lineHeight: 1, marginBottom: 16 }}>404</div>
            <h1 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1.5rem', color: '#0F2557', marginBottom: 12 }}>
              {t('文章未找到', 'Article Not Found', '文章未找到')}
            </h1>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', color: '#64748B', marginBottom: 32 }}>
              {t('您尋找的文章不存在或已被移除。', 'The article you are looking for does not exist or has been removed.', '您寻找的文章不存在或已被移除。')}
            </p>
            <a href={`/${locale}/insights`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#0F2557', color: '#fff', padding: '12px 24px',
              fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.9rem',
              textDecoration: 'none',
            }}>
              ← {t('返回 Insights', 'Back to Insights', '返回 Insights')}
            </a>
          </div>
        </main>
        <SiteFooter locale={locale} waNumber={waNumber} />
      </>
    );
  }

  const title = (article.title as Record<string, string>)?.[lk] ?? '';
  const body = (article.body as Record<string, string>)?.[lk] ?? '';
  const cat = (article.category as Record<string, string>)?.[lk] ?? '';
  const catColor = article.categoryColor === 'gold' ? '#C9A84C' : article.categoryColor === 'navy' ? '#0F2557' : '#EF4444';

  // Detect if body looks like HTML
  const isHtml = body.trim().startsWith('<');

  const excerpt = (article.excerpt as Record<string, string>)?.[lk] ?? '';

  return (
    <>
      <ArticleJsonLd title={title} description={excerpt} slug={slug} publishedAt={article.publishedAt} modifiedAt={article.updatedAt} />
      <SiteHeader locale={locale} waNumber={waNumber} />
      <main>
        {/* ── ARTICLE HEADER ── */}
        <section style={{ background: '#0F2557', padding: '80px 0 60px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
            <a href={`/${locale}/insights`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Montserrat',sans-serif", fontSize: '.75rem', fontWeight: 600, color: '#C9A84C', textDecoration: 'none', marginBottom: 24, letterSpacing: '.05em', textTransform: 'uppercase' }}>
              ← {t('返回 Insights', 'Back to Insights', '返回 Insights')}
            </a>
            {cat && (
              <div style={{ marginBottom: 16 }}>
                <span style={{
                  fontFamily: "'Montserrat',sans-serif", fontSize: '.62rem', fontWeight: 700,
                  letterSpacing: '.12em', textTransform: 'uppercase', color: '#fff',
                  background: catColor, padding: '5px 14px', display: 'inline-block',
                }}>{cat}</span>
              </div>
            )}
            <h1 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: 'clamp(1.5rem,3.5vw,2.2rem)', color: '#fff', lineHeight: 1.45, marginBottom: 20 }}>
              {title}
            </h1>
            {article.publishedAt && (
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.78rem', fontWeight: 600, color: '#94A3B8' }}>
                {new Date(article.publishedAt).toLocaleDateString(
                  locale === 'en' ? 'en-HK' : 'zh-HK',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── ARTICLE BODY ── */}
        <section style={{ padding: '60px 0 80px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
            {isHtml ? (
              <div
                style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.95rem', color: '#334155', lineHeight: 1.95 }}
                dangerouslySetInnerHTML={{ __html: body }}
              />
            ) : (
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.95rem', color: '#334155', lineHeight: 1.95, whiteSpace: 'pre-wrap' }}>
                {body}
              </div>
            )}

            {/* ── WA CTA BOX ── */}
            <div style={{ background: '#0F2557', padding: '36px 32px', marginTop: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#fff', marginBottom: 6 }}>
                  {t('有任何問題？立即聯絡我們。', 'Have questions? Contact us now.', '有任何问题？立即联络我们。')}
                </h3>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', color: 'rgba(255,255,255,.6)' }}>
                  {t('我們的專家團隊提供免費初步諮詢。', 'Our expert team offers a free initial consultation.', '我们的专家团队提供免费初步咨询。')}
                </p>
              </div>
              <a href={waContact} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#EF4444', color: '#fff', padding: '12px 24px',
                fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.9rem',
                textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                <WaIcon /> {t('WhatsApp 查詢', 'WhatsApp Enquiry', 'WhatsApp 查询')}
              </a>
            </div>
          </div>
        </section>

        {/* ── INQUIRY FORM ── */}
        <section style={{ padding: '80px 0', background: '#F8FAFC' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={sectionLabel}>{t('發送查詢', 'Get in Touch', '发送查询')}</span>
              <h2 style={sectionTitle}>{t('聯絡我們', 'Contact Us', '联络我们')}</h2>
              <div style={{ ...goldBar, margin: '12px auto 36px' }} />
            </div>
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              <InquiryForm locale={locale} sourcePage="insights" waNumber={waNumber} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} waNumber={waNumber} />
    </>
  );
}

/* ── Shared styles ── */
const sectionLabel: React.CSSProperties = {
  fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700,
  letterSpacing: '.18em', color: '#C9A84C', textTransform: 'uppercase',
  marginBottom: 8, display: 'block',
};
const sectionTitle: React.CSSProperties = {
  fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700,
  fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#0F2557', marginBottom: 6,
};
const goldBar: React.CSSProperties = { width: 44, height: 3, background: '#C9A84C', margin: '12px 0 36px' };

function WaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}
