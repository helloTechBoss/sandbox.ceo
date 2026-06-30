export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export default async function MembersPage() {
  const members = await prisma.member.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { orders: true } },
    },
  });

  const badge = (ok: boolean) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 10px', fontSize: '.7rem', fontWeight: 700,
      fontFamily: "'Montserrat',sans-serif",
      background: ok ? '#F0FDF4' : '#FFF7ED',
      color: ok ? '#166534' : '#9A3412',
      border: `1px solid ${ok ? '#86EFAC' : '#FDBA74'}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: ok ? '#22C55E' : '#F97316', display: 'inline-block' }} />
      {ok ? 'Verified' : 'Pending'}
    </span>
  );

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', margin: 0 }}>
            Members
          </h1>
          <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', color: '#64748B', margin: '6px 0 0' }}>
            {members.length} registered members
          </p>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.85rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
              {['Name', 'Email', 'Phone', 'Verified', 'Orders', 'Registered'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: "'Montserrat',sans-serif", fontSize: '.72rem', fontWeight: 700, letterSpacing: '.06em', color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '40px 16px', textAlign: 'center', color: '#94A3B8', fontFamily: "'Noto Sans TC',sans-serif" }}>
                  No members yet
                </td>
              </tr>
            ) : members.map((m, i) => (
              <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0F2557', fontFamily: "'Noto Sans TC',sans-serif" }}>{m.name}</td>
                <td style={{ padding: '14px 16px', color: '#334155', fontFamily: "'Montserrat',sans-serif", fontSize: '.82rem' }}>{m.email}</td>
                <td style={{ padding: '14px 16px', color: '#64748B', fontFamily: "'Montserrat',sans-serif", fontSize: '.82rem' }}>{m.phone || '—'}</td>
                <td style={{ padding: '14px 16px' }}>{badge(m.emailVerified)}</td>
                <td style={{ padding: '14px 16px', fontFamily: "'Montserrat',sans-serif", fontWeight: 700, color: m._count.orders > 0 ? '#0F2557' : '#94A3B8' }}>
                  {m._count.orders}
                </td>
                <td style={{ padding: '14px 16px', color: '#64748B', fontFamily: "'Montserrat',sans-serif", fontSize: '.78rem', whiteSpace: 'nowrap' }}>
                  {m.createdAt.toLocaleDateString('zh-HK')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
