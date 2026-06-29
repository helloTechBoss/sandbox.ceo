export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { prisma } from '@/lib/prisma';
import { OrgJsonLd } from '@/components/JsonLd';
import { hreflang, ogImage } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';
  const title = isEn ? 'Compliance & Licensing Insights' : isSc ? '合规及牌照行业洞察' : '合規及牌照行業洞察';
  const description = isEn
    ? 'Latest regulatory updates, compliance guides and licensing news for Hong Kong financial institutions — SFC, HKMA, Customs and cross-border developments.'
    : isSc
    ? '香港金融机构最新监管动态、合规指引及牌照资讯，涵盖SFC、HKMA、海关及跨境发展。'
    : '香港金融機構最新監管動態、合規指引及牌照資訊，涵蓋SFC、HKMA、海關及跨境發展。';
  return {
    title,
    description,
    alternates: hreflang('/insights'),
    openGraph: { type: 'website', title, description, url: 'https://www.sandbox.ceo/insights', images: ogImage(title) },
    twitter: { card: 'summary_large_image', title, description },
  };
}

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

export default async function InsightsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';
  const lk = locale === 'zh-Hant' ? 'tc' : locale === 'en' ? 'en' : 'sc';

  const waSetting = await prisma.setting.findUnique({ where: { key: 'whatsapp_number' } }).catch(() => null);
  const waNumber = waSetting?.value || '+85292318254';

  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
  });

  const t = (tc: string, en: string, sc?: string) => isEn ? en : isSc ? (sc ?? tc) : tc;

  return (
    <>
      <OrgJsonLd />
      <SiteHeader locale={locale} waNumber={waNumber} />
      <main>
        {/* ── HERO ── */}
        <section style={{ background: '#0F2557', padding: '100px 0 80px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 50%,rgba(201,168,76,.1) 0%,transparent 55%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 28, height: 2, background: '#C9A84C' }} />
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase' }}>
                {t('最新動態', 'Latest News', '最新动态')} · INSIGHTS
              </span>
              <div style={{ width: 28, height: 2, background: '#C9A84C' }} />
            </div>
            <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.2rem)', color: '#fff', letterSpacing: '.04em', marginBottom: 16 }}>
              Insights
            </h1>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: 'clamp(.95rem,2vw,1.15rem)', color: '#C9A84C', fontWeight: 600 }}>
              {t('合規及牌照最新資訊', 'Latest Compliance & Licensing News', '合规及牌照最新资讯')}
            </p>
          </div>
        </section>

        {/* ── ARTICLES ── */}
        <section style={{ padding: '80px 0', background: '#F8FAFC' }}>
          <style>{`
            @media(max-width:768px){.insights-grid{grid-template-columns:1fr!important}}
          `}</style>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            {articles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div style={{ width: 64, height: 64, background: '#E2E8F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5">
                    <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1.2rem', color: '#334155', marginBottom: 8 }}>
                  {t('暫無文章', 'No articles yet', '暂无文章')}
                </h2>
                <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', color: '#64748B' }}>
                  {t('敬請期待，我們將定期發布合規及牌照最新資訊。', 'Stay tuned — we publish regular updates on compliance and licensing.', '敬请期待，我们将定期发布合规及牌照最新资讯。')}
                </p>
              </div>
            ) : (
              <div className="insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                {articles.map(art => {
                  const cat = (art.category as Record<string, string>)?.[lk] ?? '';
                  const title = (art.title as Record<string, string>)?.[lk] ?? '';
                  const excerpt = (art.excerpt as Record<string, string>)?.[lk] ?? '';
                  const catColor = art.categoryColor === 'gold' ? '#C9A84C' : art.categoryColor === 'navy' ? '#0F2557' : '#EF4444';
                  return (
                    <a
                      key={art.id}
                      href={`/insights/${art.slug}`}
                      style={{ background: '#fff', border: '1px solid #E2E8F0', textDecoration: 'none', display: 'block', transition: 'border-color .2s, box-shadow .2s' }}
                    >
                      <div style={{ padding: '16px 20px 0' }}>
                        {cat && (
                          <span style={{
                            fontFamily: "'Montserrat',sans-serif", fontSize: '.62rem', fontWeight: 700,
                            letterSpacing: '.12em', textTransform: 'uppercase', color: '#fff',
                            background: catColor, padding: '4px 12px', display: 'inline-block',
                          }}>{cat}</span>
                        )}
                      </div>
                      <div style={{ padding: 20 }}>
                        {art.publishedAt && (
                          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.72rem', fontWeight: 600, color: '#94A3B8', marginBottom: 8 }}>
                            {new Date(art.publishedAt).toLocaleDateString(
                              locale === 'en' ? 'en-HK' : 'zh-HK',
                              { year: 'numeric', month: 'short', day: 'numeric' }
                            )}
                          </div>
                        )}
                        <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', marginBottom: 10, lineHeight: 1.55 }}>
                          {title}
                        </h3>
                        {excerpt && (
                          <p style={{
                            fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: '#64748B', lineHeight: 1.75,
                            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}>
                            {excerpt}
                          </p>
                        )}
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 14, fontFamily: "'Montserrat',sans-serif", fontSize: '.75rem', fontWeight: 700, color: '#EF4444' }}>
                          {t('閱讀更多', 'Read More', '阅读更多')} →
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} waNumber={waNumber} />
    </>
  );
}
