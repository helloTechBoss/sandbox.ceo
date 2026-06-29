export const dynamic = 'force-dynamic';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import InquiryForm from '@/components/InquiryForm';
import { prisma } from '@/lib/prisma';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';

  const waSetting = await prisma.setting.findUnique({ where: { key: 'whatsapp_number' } }).catch(() => null);
  const waNumber = waSetting?.value || '+85292318254';
  const waBase = `https://wa.me/${waNumber.replace(/\D/g, '')}`;
  const waContact = `${waBase}?text=${encodeURIComponent('Hi，我想查詢合規及牌照服務')}`;

  const t = (tc: string, en: string, sc?: string) => isEn ? en : isSc ? (sc ?? tc) : tc;

  const teamCards = [
    {
      initials: 'CO',
      nameTc: '合規部總監',
      titleTc: '合規部總監',
      titleEn: 'Head of Compliance',
      bio: t(
        '前投資銀行 MLRO，擁有逾 15 年 AML 合規經驗',
        'Former investment bank MLRO with 15+ years AML compliance experience',
        '前投资银行 MLRO，拥有逾 15 年 AML 合规经验',
      ),
    },
    {
      initials: 'LL',
      nameTc: '牌照申請總監',
      titleTc: '牌照申請總監',
      titleEn: 'Head of Licensing',
      bio: t(
        '曾處理逾 200 宗 MSO 及 SFC 牌照申請',
        'Handled 200+ MSO and SFC licence applications',
        '曾处理逾 200 宗 MSO 及 SFC 牌照申请',
      ),
    },
    {
      initials: 'CS',
      nameTc: '企業服務總監',
      titleTc: '企業服務總監',
      titleEn: 'Head of Corporate',
      bio: t(
        '香港執業會計師，專注金融機構企業架構',
        'Hong Kong practising CPA specialising in financial institution corporate structures',
        '香港执业会计师，专注金融机构企业架构',
      ),
    },
  ];

  const whyCards = [
    {
      tc: '前銀行從業員',
      en: 'Former Bankers',
      descTc: '團隊成員均曾任職頂級金融機構',
      descEn: 'Team members from top-tier financial institutions',
    },
    {
      tc: '全程代辦',
      en: 'End-to-End',
      descTc: '從申請到持續合規，一站式服務',
      descEn: 'From application to ongoing compliance, one-stop service',
    },
    {
      tc: '透明收費',
      en: 'Transparent Fees',
      descTc: '固定報價，無隱藏收費',
      descEn: 'Fixed quotes, no hidden fees',
    },
    {
      tc: '快速回應',
      en: 'Fast Response',
      descTc: 'WhatsApp 直達，即日回覆',
      descEn: 'WhatsApp direct line, same-day response',
    },
  ];

  return (
    <>
      <SiteHeader locale={locale} waNumber={waNumber} />
      <main>
        {/* ── HERO ── */}
        <section style={{ background: 'linear-gradient(135deg,#091A3E 0%,#0F2557 60%,#1a3a7a 100%)', padding: '100px 0 80px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%,rgba(201,168,76,.08) 0%,transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 28, height: 2, background: '#C9A84C' }} />
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700, letterSpacing: '.2em', color: '#C9A84C', textTransform: 'uppercase' }}>
                {t('關於我們', 'About Us', '关于我们')} · ABOUT US
              </span>
              <div style={{ width: 28, height: 2, background: '#C9A84C' }} />
            </div>
            <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: '#fff', letterSpacing: '.04em', marginBottom: 16 }}>
              Sandbox Group
            </h1>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: 'clamp(.95rem,2vw,1.2rem)', color: '#C9A84C', fontWeight: 600 }}>
              {t('香港合規與牌照申請專家', 'Hong Kong Compliance & Licensing Experts', '香港合规与牌照申请专家')}
            </p>
          </div>
        </section>

        {/* ── OUR STORY ── */}
        <section style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 60, alignItems: 'start' }}>
            <div>
              <span style={sectionLabel}>{t('我們的故事', 'Our Story', '我们的故事')}</span>
              <h2 style={sectionTitle}>{t('由業界精英創立', 'Founded by Industry Veterans', '由业界精英创立')}</h2>
              <div style={goldBar} />
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.95rem', color: '#64748B', lineHeight: 2, marginBottom: 16 }}>
                {t(
                  'Sandbox Group 由前銀行合規主任及洗錢申報主任（MLRO）創立，深耕香港金融監管市場逾十年。我們的團隊成員曾任職於頂級投資銀行及跨國金融機構，擁有豐富的第一線監管經驗。',
                  "Sandbox Group was founded by former bank compliance officers and MLROs with over a decade of experience in Hong Kong's financial regulatory market. Our team members have served at leading investment banks and multinational financial institutions.",
                  'Sandbox Group 由前银行合规主任及洗钱申报主任（MLRO）创立，深耕香港金融监管市场逾十年。我们的团队成员曾任职于顶级投资银行及跨国金融机构，拥有丰富的第一线监管经验。',
                )}
              </p>
            </div>
            {/* Stats box */}
            <div style={{ background: '#0F2557', padding: '36px 32px' }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.18em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,.15)' }}>
                {t('核心數字', 'Key Numbers', '核心数字')}
              </div>
              {[
                { num: '10+', label: t('年行業經驗', 'Years Experience', '年行业经验') },
                { num: '500+', label: t('客戶服務量', 'Clients Served', '客户服务量') },
                { num: '4', label: t('核心業務部門', 'Core Divisions', '核心业务部门') },
                { num: 'HK+GBA', label: t('服務覆蓋', 'Coverage', '服务覆盖') },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,.08)' : 'none' }}>
                  <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', color: 'rgba(255,255,255,.65)' }}>{s.label}</span>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#fff' }}>{s.num}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OUR MISSION ── */}
        <section style={{ background: '#F8FAFC', padding: '80px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={sectionLabel}>{t('我們的使命', 'Our Mission', '我们的使命')}</span>
              <h2 style={sectionTitle}>{t('讓合規觸手可及', 'Making Compliance Accessible', '让合规触手可及')}</h2>
              <div style={{ ...goldBar, margin: '12px auto 36px' }} />
            </div>
            <div style={{ maxWidth: 800, margin: '0 auto', borderLeft: '4px solid #EF4444', paddingLeft: 32 }}>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '1.05rem', color: '#334155', lineHeight: 2, fontStyle: 'italic' }}>
                {t(
                  '我們的使命是讓每一家金融機構——無論規模大小——都能獲得與大型機構同等水準的合規支援，以合理的成本實現監管合規，專注業務增長。',
                  'Our mission is to ensure every financial institution — regardless of size — has access to the same calibre of compliance support as major institutions, achieving regulatory compliance at a reasonable cost so they can focus on business growth.',
                  '我们的使命是让每一家金融机构——无论规模大小——都能获得与大型机构同等水准的合规支援，以合理的成本实现监管合规，专注业务增长。',
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={sectionLabel}>{t('我們的優勢', 'Our Advantages', '我们的优势')}</span>
              <h2 style={sectionTitle}>{t('為何選擇我們', 'Why Choose Us', '为何选择我们')}</h2>
              <div style={{ ...goldBar, margin: '12px auto 36px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 2, background: '#E2E8F0' }}>
              {whyCards.map((card, i) => (
                <div key={i} style={{ background: '#fff', padding: '36px 32px' }}>
                  <div style={{ width: 48, height: 48, background: '#0F2557', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F2557', marginBottom: 4, letterSpacing: '.02em' }}>{card.en}</h3>
                  <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: '#C9A84C', fontWeight: 600, marginBottom: 10 }}>{card.tc}</div>
                  <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#64748B', lineHeight: 1.8 }}>
                    {isEn ? card.descEn : card.descTc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OUR TEAM ── */}
        <section style={{ background: '#F8FAFC', padding: '80px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={sectionLabel}>{t('我們的團隊', 'Our Team', '我们的团队')}</span>
              <h2 style={sectionTitle}>{t('資深業界專家', 'Senior Industry Experts', '资深业界专家')}</h2>
              <div style={{ ...goldBar, margin: '12px auto 36px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {teamCards.map((member, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                  <div style={{ height: 8, background: '#0F2557' }} />
                  <div style={{ padding: '32px 28px' }}>
                    <div style={{ width: 64, height: 64, background: '#C9A84C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                      <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>{member.initials}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', marginBottom: 4 }}>
                      {isEn ? member.titleEn : member.titleTc}
                    </h3>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.75rem', color: '#C9A84C', fontWeight: 600, letterSpacing: '.05em', marginBottom: 14 }}>
                      {member.titleEn.toUpperCase()}
                    </div>
                    <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', color: '#64748B', lineHeight: 1.8 }}>
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{ background: '#EF4444', padding: '60px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: 'clamp(1.2rem,2.5vw,1.7rem)', color: '#fff' }}>
                {t('準備好開始了嗎？立即與我們的專家團隊聯絡。', 'Ready to get started? Contact our expert team today.', '准备好开始了吗？立即与我们的专家团队联络。')}
              </h2>
            </div>
            <a href={waContact} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#fff', color: '#EF4444', padding: '14px 28px',
              fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.95rem',
              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              <WaIcon /> {t('WhatsApp 聯絡', 'WhatsApp Us', 'WhatsApp 联络')}
            </a>
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
              <InquiryForm locale={locale} sourcePage="about" waNumber={waNumber} />
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}
