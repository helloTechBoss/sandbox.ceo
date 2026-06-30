import { TBHeader, TBFooter } from '../components';
import '../techboss.css';

export default function EULAPage() {
  return (
    <>
      <TBHeader />
      <main>
        <section style={{ background: '#000', padding: '80px 0 60px', borderBottom: '1px solid #111' }}>
          <div className="tb-container">
            <span className="tb-label">Legal · 法律文件</span>
            <h1 className="tb-h2" style={{ marginBottom: 12 }}>End User License Agreement</h1>
            <div className="tb-gold-bar" />
            <p style={{ fontSize: 13, color: '#555' }}>Last updated: June 2025</p>
          </div>
        </section>
        <section className="tb-section" style={{ background: '#000' }}>
          <div className="tb-container" style={{ maxWidth: 800 }}>
            {[
              { heading: '1. Acceptance of Terms', body: 'By downloading, installing, or using the Tech Boss application, you agree to be bound by this End User License Agreement. If you do not agree, do not use the app.' },
              { heading: '2. License Grant', body: 'Tech Boss Limited grants you a limited, non-exclusive, non-transferable, revocable license to use the Tech Boss application for your personal or business purposes, subject to these terms.' },
              { heading: '3. Restrictions', body: 'You may not: copy, modify, or distribute the application; reverse engineer or decompile the application; remove any proprietary notices; use the application for any unlawful purpose; or transfer your license to another person.' },
              { heading: '4. Intellectual Property', body: 'The Tech Boss application, including all content, features, and functionality, is owned by Tech Boss Limited and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.' },
              { heading: '5. Termination', body: 'This license is effective until terminated. Your rights under this license will terminate automatically if you fail to comply with any of its terms. Upon termination, you must destroy all copies of the application.' },
              { heading: '6. Disclaimer of Warranties', body: 'The application is provided "as is" without warranty of any kind. Tech Boss Limited disclaims all warranties, express or implied, including warranties of merchantability and fitness for a particular purpose.' },
              { heading: '7. Contact', body: 'For questions about this EULA, contact us at hello@techboss.app' },
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
