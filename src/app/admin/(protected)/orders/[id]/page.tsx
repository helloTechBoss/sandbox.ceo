export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.serviceOrder.findUnique({
    where: { id },
    include: {
      items: true,
      onboarding: { include: { docs: { orderBy: { uploadedAt: 'asc' } } } },
    },
  });

  if (!order) notFound();

  const ob = order.onboarding;

  const fieldRow = (label: string, value: string | null | undefined) =>
    value ? (
      <div style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
        <span style={{ width: 180, flexShrink: 0, fontSize: '.82rem', color: '#94A3B8', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: '.85rem', color: '#334155' }}>{value}</span>
      </div>
    ) : null;

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Link href="/admin/orders" style={{ fontSize: '.8rem', color: '#64748B', textDecoration: 'none' }}>← All Orders</Link>
        <span style={{ color: '#CBD5E1' }}>›</span>
        <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.9rem', color: '#0F2557' }}>Order {order.id.slice(0, 8).toUpperCase()}</span>
      </div>

      {/* Order summary */}
      <div style={{ background: '#0F2557', padding: '20px 24px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 6 }}>Order Summary</div>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.6rem', color: '#fff' }}>HK${order.totalAmount.toLocaleString()}</div>
          <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.4)', marginTop: 4 }}>{new Date(order.createdAt).toLocaleString('zh-HK')}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.4)', marginBottom: 4 }}>Stripe Session</div>
          <div style={{ fontFamily: 'monospace', fontSize: '.72rem', color: 'rgba(255,255,255,.6)', wordBreak: 'break-all' }}>{order.stripeSessionId}</div>
          <div style={{ marginTop: 10, background: '#EF4444', color: '#fff', display: 'inline-block', padding: '4px 12px', fontSize: '.72rem', fontWeight: 700 }}>{order.status.replace(/_/g, ' ').toUpperCase()}</div>
        </div>
      </div>

      {/* Items */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 14 }}>Services Purchased</div>
        {order.items.map(i => (
          <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F1F5F9', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '.875rem', color: '#0F2557' }}>{(i.name as Record<string,string>)?.tc}</div>
              <div style={{ fontSize: '.75rem', color: '#94A3B8' }}>{(i.name as Record<string,string>)?.en} · {i.itemType}</div>
            </div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, color: '#EF4444', whiteSpace: 'nowrap' }}>HK${i.amount.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Client onboarding */}
      {ob ? (
        <>
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '20px 24px', marginBottom: 20 }}>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 14 }}>Client Details</div>
            {fieldRow('Full Name', ob.fullName)}
            {fieldRow('Email', ob.email)}
            {fieldRow('Phone', ob.phone)}
            {fieldRow('Company Name', ob.companyName)}
            {fieldRow('Business Reg No.', ob.companyBrNo)}
            {fieldRow('HKID No.', ob.hkidNo)}
            {fieldRow('Notes', ob.notes)}
            {fieldRow('Submitted At', new Date(ob.submittedAt).toLocaleString('zh-HK'))}
          </div>

          {/* Documents */}
          {ob.docs.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 14 }}>Uploaded Documents</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ob.docs.map(doc => (
                  <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', textDecoration: 'none' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F2557" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '.82rem', color: '#0F2557' }}>{doc.docType.replace(/_/g, ' ').toUpperCase()}</div>
                      <div style={{ fontSize: '.75rem', color: '#64748B' }}>{doc.label}</div>
                    </div>
                    <span style={{ fontSize: '.75rem', color: '#EF4444', fontWeight: 600 }}>Download ↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '18px 24px', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: '.85rem', color: '#92400E', marginBottom: 4 }}>⏳ Awaiting Client Onboarding</div>
          <div style={{ fontSize: '.82rem', color: '#92400E' }}>The client has not yet submitted their details. They were sent to the onboarding page after payment.</div>
        </div>
      )}

      <Link href="/admin/orders" style={{ fontSize: '.82rem', color: '#64748B', textDecoration: 'none' }}>← Back to Orders</Link>
    </div>
  );
}
