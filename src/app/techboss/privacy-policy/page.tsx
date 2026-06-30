import { TBHeader, TBFooter } from '../components';
import '../techboss.css';

export default function PrivacyPolicyPage() {
  return (
    <>
      <TBHeader />
      <main>
        <section style={{ background: '#000', padding: '80px 0 60px', borderBottom: '1px solid #111' }}>
          <div className="tb-container">
            <span className="tb-label">Legal · 法律文件</span>
            <h1 className="tb-h2" style={{ marginBottom: 12 }}>Privacy Policy</h1>
            <div className="tb-gold-bar" />
            <p style={{ fontSize: 13, color: '#555' }}>Last updated: June 2025</p>
          </div>
        </section>
        <section className="tb-section" style={{ background: '#000' }}>
          <div className="tb-container" style={{ maxWidth: 800 }}>
            {[
              { heading: '1. Information We Collect', body: 'We collect information you provide directly to us, including name, email address, phone number, and business information when you register for our services, contact us, or use our platform. We also collect usage data and technical information when you interact with our website or apps.' },
              { heading: '2. How We Use Your Information', body: 'We use the information we collect to provide, maintain, and improve our services; process transactions; send promotional communications (with your consent); respond to your comments and questions; and comply with legal obligations.' },
              { heading: '3. Information Sharing', body: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.' },
              { heading: '4. Data Security', body: 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.' },
              { heading: '5. Cookies', body: 'We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.' },
              { heading: '6. Your Rights', body: 'You have the right to access, update, or delete your personal information. You may also object to processing, request restriction of processing, and request data portability. To exercise these rights, contact us at hello@techboss.app.' },
              { heading: '7. Contact Us', body: 'If you have any questions about this Privacy Policy, please contact us at hello@techboss.app or Tech Boss Limited, Room 1002B, 10/F, Metro Centre II, 21 Lam Hing St, Kowloon Bay, Hong Kong.' },
            ].map(s => (
              <div key={s.heading} style={{ marginBottom: 40 }}>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 16 }}>{s.heading}</h2>
                <p style={{ fontSize: 14, color: '#888', lineHeight: 1.9 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <TBFooter />
    </>
  );
}
