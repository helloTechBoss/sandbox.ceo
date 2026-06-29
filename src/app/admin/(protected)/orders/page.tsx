export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const STATUS_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  pending_onboarding:  { label: 'Pending Onboarding', bg: '#FEF3C7', color: '#92400E' },
  onboarding_complete: { label: 'Onboarding Done',    bg: '#DBEAFE', color: '#1E40AF' },
  in_progress:         { label: 'In Progress',         bg: '#EDE9FE', color: '#5B21B6' },
  delivered:           { label: 'Delivered',           bg: '#D1FAE5', color: '#065F46' },
};

async function updateStatus(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const status = formData.get('status') as string;
  await prisma.serviceOrder.update({ where: { id }, data: { status } });
  redirect('/admin/orders');
}

export default async function OrdersPage() {
  const orders = await prisma.serviceOrder.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
      onboarding: { select: { fullName: true, email: true, phone: true, companyName: true } },
    },
  });

  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 4 }}>Orders & CRM</h1>
          <p style={{ fontSize: '.875rem', color: '#64748B' }}>{orders.length} total orders</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {Object.entries(STATUS_LABELS).map(([k, v]) => {
            const count = orders.filter(o => o.status === k).length;
            return count > 0 ? (
              <span key={k} style={{ background: v.bg, color: v.color, padding: '4px 10px', fontSize: '.72rem', fontWeight: 700, borderRadius: 2 }}>
                {count} {v.label}
              </span>
            ) : null;
          })}
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1', padding: '48px', textAlign: 'center' }}>
          <p style={{ color: '#94A3B8', fontSize: '.9rem' }}>No orders yet. Orders appear here after customers complete checkout.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Date', 'Client', 'Services', 'HKD', 'Status', 'Onboarding', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const s = STATUS_LABELS[o.status] ?? { label: o.status, bg: '#F1F5F9', color: '#64748B' };
                const client = o.onboarding;
                return (
                  <tr key={o.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontSize: '.78rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                      {new Date(o.createdAt).toLocaleDateString('zh-HK')}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {client ? (
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '.85rem', color: '#0F2557' }}>{client.fullName}</div>
                          <div style={{ fontSize: '.75rem', color: '#94A3B8' }}>{client.email}</div>
                          {client.phone && <div style={{ fontSize: '.75rem', color: '#94A3B8' }}>{client.phone}</div>}
                        </div>
                      ) : (
                        <span style={{ fontSize: '.78rem', color: '#CBD5E1', fontStyle: 'italic' }}>Awaiting onboarding</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {o.items.map(i => (
                          <span key={i.id} style={{ fontSize: '.75rem', color: '#475569' }}>
                            {(i.name as Record<string,string>)?.tc || (i.name as Record<string,string>)?.en}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.85rem', color: '#EF4444', whiteSpace: 'nowrap' }}>
                      HK${o.totalAmount.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <form action={updateStatus} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input type="hidden" name="id" value={o.id} />
                        <select name="status" defaultValue={o.status} style={{ fontSize: '.75rem', padding: '4px 8px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer' }}>
                          {Object.entries(STATUS_LABELS).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                          ))}
                        </select>
                        <button type="submit" style={{ background: '#0F2557', color: '#fff', border: 'none', padding: '4px 10px', fontSize: '.7rem', fontWeight: 700, cursor: 'pointer' }}>
                          Save
                        </button>
                      </form>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: s.bg, color: s.color, padding: '3px 8px', fontSize: '.7rem', fontWeight: 700 }}>
                        {client ? '✓ Done' : '○ Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <Link href={`/admin/orders/${o.id}`} style={{ fontSize: '.78rem', color: '#EF4444', fontWeight: 600, textDecoration: 'none' }}>
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
