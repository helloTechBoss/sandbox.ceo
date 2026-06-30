import { TBHeader, TBFooter } from '../components';
import '../techboss.css';

export default function DeliveryPolicyPage() {
  return (
    <>
      <TBHeader />
      <main>
        <section style={{ background: '#000', padding: '80px 0 60px', borderBottom: '1px solid #111' }}>
          <div className="tb-container">
            <span className="tb-label">Legal · 法律文件</span>
            <h1 className="tb-h2" style={{ marginBottom: 12 }}>Delivery Policy</h1>
            <div className="tb-gold-bar" />
            <p style={{ fontSize: 13, color: '#555' }}>Last updated: June 2025</p>
          </div>
        </section>
        <section className="tb-section" style={{ background: '#000' }}>
          <div className="tb-container" style={{ maxWidth: 800 }}>
            {[
              { heading: 'Physical Products', body: 'For physical merchandise (T-shirts, hoodies, NFC cards, etc.), we offer delivery within Hong Kong via SF Express or Lalamove. Standard delivery takes 2–4 business days. Express same-day delivery is available for an additional fee.' },
              { heading: 'Delivery Areas', body: 'We deliver to all areas in Hong Kong, including Hong Kong Island, Kowloon, and New Territories. For delivery to remote areas (Tung Chung, Discovery Bay, outlying islands), additional charges and time may apply.' },
              { heading: 'Delivery Fees', body: 'Standard delivery: HK$30. Express delivery: HK$60. Free delivery on orders over HK$500. SF Locker pickup available at no additional charge.' },
              { heading: 'Digital Products', body: 'Digital products (app subscriptions, course access, digital downloads) are delivered immediately upon payment confirmation via email or through the Tech Boss app.' },
              { heading: 'Order Tracking', body: 'Once your order is dispatched, you will receive a tracking number via WhatsApp or email. You can track your order on the SF Express website.' },
              { heading: 'Contact for Delivery Issues', body: 'For any delivery-related inquiries, please WhatsApp us at +852 9231 8254 or email hello@techboss.app with your order number.' },
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
