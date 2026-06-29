export const dynamic = 'force-dynamic';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Terms of Service | Sandbox Group' : '使用條款 | Sandbox Group',
    description: isEn ? 'Terms of Service for Sandbox Group compliance and licensing services.' : 'Sandbox Group 合規及牌照服務使用條款。',
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
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
              {isEn ? 'Terms of Service' : isSc ? '使用条款' : '使用條款'}
            </h1>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', color: 'rgba(255,255,255,.6)' }}>
              {isEn ? 'Last updated: January 2024' : '最後更新：2024年1月'}
            </p>
          </div>
        </section>

        <section style={{ padding: '60px 24px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: '48px' }}>
            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', paddingBottom: 10, borderBottom: '1px solid #E2E8F0', marginBottom: 12, marginTop: 32 }}>
              {isEn ? 'Scope of Services' : isSc ? '服务范围' : '服務範圍'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', lineHeight: 1.85 }}>
              {isEn
                ? 'These Terms of Service apply to all services provided by Sandbox Group ("the Company"), including but not limited to compliance advisory, licence application, corporate services, and regulatory technology services.'
                : isSc
                ? '本使用条款适用于 Sandbox Group（下称「本公司」）提供的所有服务，包括但不限于合规顾问、牌照申请、企业服务及监管科技服务。'
                : '本使用條款適用於 Sandbox Group（下稱「本公司」）提供的所有服務，包括但不限於合規顧問、牌照申請、企業服務及監管科技服務。'}
            </p>

            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', paddingBottom: 10, borderBottom: '1px solid #E2E8F0', marginBottom: 12, marginTop: 32 }}>
              {isEn ? 'Nature of Services' : isSc ? '服务性质' : '服務性質'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', lineHeight: 1.85 }}>
              {isEn
                ? 'Services provided by the Company are advisory in nature and do not constitute legal advice. For legal advice, please consult a licensed solicitor. The Company does not guarantee the outcome of any licence application.'
                : isSc
                ? '本公司提供的服务属顾问性质，并非法律意见。如需法律意见，请咨询持牌律师。本公司不就任何牌照申请的最终结果作出保证。'
                : '本公司提供的服務屬顧問性質，並非法律意見。如需法律意見，請諮詢持牌律師。本公司不就任何牌照申請的最終結果作出保證。'}
            </p>

            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', paddingBottom: 10, borderBottom: '1px solid #E2E8F0', marginBottom: 12, marginTop: 32 }}>
              {isEn ? 'Confidentiality' : isSc ? '保密承诺' : '保密承諾'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', lineHeight: 1.85 }}>
              {isEn
                ? 'The Company maintains strict confidentiality of all information provided by clients and will not disclose it to third parties without consent, except as required by law.'
                : isSc
                ? '本公司对客户提供的所有资料严格保密，未经客户同意不会向第三方披露，法律要求除外。'
                : '本公司對客戶提供的所有資料嚴格保密，未經客戶同意不會向第三方披露，法律要求除外。'}
            </p>

            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', paddingBottom: 10, borderBottom: '1px solid #E2E8F0', marginBottom: 12, marginTop: 32 }}>
              {isEn ? 'Fees and Payment' : isSc ? '收费及付款' : '收費及付款'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', lineHeight: 1.85 }}>
              {isEn
                ? 'All service fees will be set out in the service agreement. Unless otherwise agreed, fees are payable before commencement of services. The Company reserves the right to charge additional fees for additional services.'
                : isSc
                ? '所有服务费用将在服务协议中列明。除非另有协议，费用须于服务开始前缴付。本公司保留就额外服务收取额外费用的权利。'
                : '所有服務費用將在服務協議中列明。除非另有協議，費用須於服務開始前繳付。本公司保留就額外服務收取額外費用的權利。'}
            </p>

            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', paddingBottom: 10, borderBottom: '1px solid #E2E8F0', marginBottom: 12, marginTop: 32 }}>
              {isEn ? 'Limitation of Liability' : isSc ? '责任限制' : '責任限制'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', lineHeight: 1.85 }}>
              {isEn
                ? "To the maximum extent permitted by law, the Company shall not be liable for any indirect, incidental, or consequential losses. The Company's liability is limited to the fees paid for the relevant services."
                : isSc
                ? '在法律允许的最大范围内，本公司对任何间接、附带或后果性损失概不负责。本公司的责任上限为相关服务的已付费用。'
                : '在法律允許的最大範圍內，本公司對任何間接、附帶或後果性損失概不負責。本公司的責任上限為相關服務的已付費用。'}
            </p>

            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', paddingBottom: 10, borderBottom: '1px solid #E2E8F0', marginBottom: 12, marginTop: 32 }}>
              {isEn ? 'Governing Law' : isSc ? '适用法律' : '適用法律'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', lineHeight: 1.85 }}>
              {isEn
                ? 'These Terms are governed by the laws of Hong Kong. Any disputes shall be submitted to the courts of Hong Kong.'
                : isSc
                ? '本使用条款受香港法律管辖，任何争议须提交香港法院处理。'
                : '本使用條款受香港法律管轄，任何爭議須提交香港法院處理。'}
            </p>

            <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', paddingBottom: 10, borderBottom: '1px solid #E2E8F0', marginBottom: 12, marginTop: 32 }}>
              {isEn ? 'Contact Us' : isSc ? '联络我们' : '聯絡我們'}
            </h2>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', lineHeight: 1.85 }}>
              {isEn
                ? 'If you have any questions about these Terms, please contact us at:'
                : isSc
                ? '如对本使用条款有任何疑问，请透过以下方式联络我们：'
                : '如對本使用條款有任何疑問，請透過以下方式聯絡我們：'}
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
