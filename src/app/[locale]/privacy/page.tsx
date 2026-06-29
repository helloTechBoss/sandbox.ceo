export const dynamic = 'force-dynamic';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';
  return {
    title: isEn ? 'Privacy Policy | Sandbox Group' : isSc ? '隐私政策 | Sandbox Group' : '私隱政策 | Sandbox Group',
    description: isEn ? 'Privacy Policy for Sandbox Group compliance and licensing services.' : isSc ? 'Sandbox Group 合规及牌照服务隐私政策。' : 'Sandbox Group 合規及牌照服務私隱政策。',
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';

  const waNum = await prisma.setting.findUnique({ where: { key: 'whatsapp_number' } }).catch(() => null);
  const waNumber = waNum?.value || '+85292318254';

  return (
    <>
      <SiteHeader locale={locale} waNumber={waNumber} />
      <main>
        <section style={{ background: '#0F2557', padding: '48px 24px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#fff', marginBottom: 8 }}>
              {isEn ? 'Privacy Policy' : isSc ? '隐私政策' : '私隱政策'}
            </h1>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', color: 'rgba(255,255,255,.6)' }}>
              {isEn ? 'Last updated: January 2024' : isSc ? '最后更新：2024年1月' : '最後更新：2024年1月'}
            </p>
          </div>
        </section>

        <section style={{ padding: '60px 24px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: '48px' }}>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', paddingBottom: 10, borderBottom: '1px solid #E2E8F0', marginBottom: 12, marginTop: 32 }}>
              {isEn ? 'Information We Collect' : isSc ? '收集的资料' : '收集的資料'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', lineHeight: 1.85 }}>
              {isEn
                ? 'We collect personal information you provide, including name, phone number, email address, and business details, in order to provide services and follow up on enquiries.'
                : isSc
                ? '我们收集您提供的个人资料，包括姓名、电话号码、电邮地址及业务详情，以便提供服务及跟进查询。'
                : '我們收集您提供的個人資料，包括姓名、電話號碼、電郵地址及業務詳情，以便提供服務及跟進查詢。'}
            </p>

            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', paddingBottom: 10, borderBottom: '1px solid #E2E8F0', marginBottom: 12, marginTop: 32 }}>
              {isEn ? 'How We Use Your Information' : isSc ? '资料使用' : '資料使用'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', lineHeight: 1.85 }}>
              {isEn
                ? 'Your information is used only for: providing requested services; responding to enquiries; sending service-related notifications; and complying with legal and regulatory requirements.'
                : isSc
                ? '您的资料仅用于以下目的：提供所申请的服务；回覆查询；发送服务相关通知；符合法律及监管要求。'
                : '您的資料僅用於以下目的：提供所申請的服務；回覆查詢；發送服務相關通知；符合法律及監管要求。'}
            </p>

            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', paddingBottom: 10, borderBottom: '1px solid #E2E8F0', marginBottom: 12, marginTop: 32 }}>
              {isEn ? 'Data Protection' : isSc ? '资料保护' : '資料保護'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', lineHeight: 1.85 }}>
              {isEn
                ? 'The Company takes reasonable technical and organisational measures to protect your personal data against unauthorised access, disclosure, or destruction.'
                : isSc
                ? '本公司采取合理的技术及组织措施保护您的个人资料，防止未经授权的存取、披露或损毁。'
                : '本公司採取合理的技術及組織措施保護您的個人資料，防止未經授權的存取、披露或損毀。'}
            </p>

            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', paddingBottom: 10, borderBottom: '1px solid #E2E8F0', marginBottom: 12, marginTop: 32 }}>
              {isEn ? 'Data Retention' : isSc ? '资料保留' : '資料保留'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', lineHeight: 1.85 }}>
              {isEn
                ? 'We retain your personal data in accordance with Hong Kong legal requirements and business needs. Generally, client data is retained for seven years after the end of services.'
                : isSc
                ? '我们根据香港法律要求及业务需要保留您的个人资料。一般而言，客户资料保留期为服务结束后七年。'
                : '我們根據香港法律要求及業務需要保留您的個人資料。一般而言，客戶資料保留期為服務結束後七年。'}
            </p>

            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', paddingBottom: 10, borderBottom: '1px solid #E2E8F0', marginBottom: 12, marginTop: 32 }}>
              {isEn ? 'Third-Party Disclosure' : isSc ? '第三方披露' : '第三方披露'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', lineHeight: 1.85 }}>
              {isEn
                ? 'Except as required by law, the Company will not sell, transfer, or disclose your personal data to any third party.'
                : isSc
                ? '除法律要求外，本公司不会将您的个人资料出售、转让或披露予任何第三方。'
                : '除法律要求外，本公司不會將您的個人資料出售、轉讓或披露予任何第三方。'}
            </p>

            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', paddingBottom: 10, borderBottom: '1px solid #E2E8F0', marginBottom: 12, marginTop: 32 }}>
              {isEn ? 'Your Rights' : isSc ? '您的权利' : '您的權利'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', lineHeight: 1.85 }}>
              {isEn
                ? 'Under the Personal Data (Privacy) Ordinance (Cap. 486), you have the right to access and correct your personal data held by the Company. To exercise this right, please contact us.'
                : isSc
                ? '根据《个人资料（私隐）条例》（第486章），您有权查阅及更正本公司持有的您的个人资料。如需行使此权利，请联络我们。'
                : '根據《個人資料（私隱）條例》（第486章），您有權查閱及更正本公司持有的您的個人資料。如需行使此權利，請聯絡我們。'}
            </p>

            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', paddingBottom: 10, borderBottom: '1px solid #E2E8F0', marginBottom: 12, marginTop: 32 }}>
              {isEn ? 'Contact Us' : isSc ? '联络我们' : '聯絡我們'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', lineHeight: 1.85 }}>
              {isEn
                ? 'If you have any questions about this Privacy Policy, please contact us at:'
                : isSc
                ? '如对本私隐政策有任何疑问，请透过以下方式联络我们：'
                : '如對本私隱政策有任何疑問，請透過以下方式聯絡我們：'}
            </p>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', lineHeight: 1.85, marginTop: 12 }}>
              Email: <a href="mailto:info@sandbox.ceo" style={{ color: '#0F2557' }}>info@sandbox.ceo</a>
              <br />
              WhatsApp: <a href={`https://wa.me/${waNumber.replace(/\D/g, '')}`} style={{ color: '#0F2557' }}>+852 9231 8254</a>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} waNumber={waNumber} />
    </>
  );
}
