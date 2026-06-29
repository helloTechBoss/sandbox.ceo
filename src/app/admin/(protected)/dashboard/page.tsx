export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const session = await auth();
  const [leadCount, newLeadCount, articleCount, packageCount] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.article.count({ where: { published: true } }),
    prisma.package.count(),
  ]);

  const recentLeads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '.875rem', color: '#64748B' }}>
          Welcome back, {session?.user?.name ?? session?.user?.email}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Total Leads', value: leadCount, sub: `${newLeadCount} new`, color: '#0F2557' },
          { label: 'New Leads', value: newLeadCount, sub: 'Awaiting follow-up', color: '#EF4444' },
          { label: 'Published Articles', value: articleCount, sub: 'Insights posts', color: '#C9A84C' },
          { label: 'Packages', value: packageCount, sub: 'Pricing packages', color: '#64748B' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '20px 24px' }}>
            <div style={{ fontSize: '.75rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '2rem', color: stat.color, lineHeight: 1, marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '.78rem', color: '#94A3B8' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557' }}>Recent Leads</h2>
          <a href="/admin/leads" style={{ fontSize: '.8rem', color: '#EF4444', fontWeight: 600, textDecoration: 'none' }}>View All →</a>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Name', 'Service', 'Source', 'Status', 'Date'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentLeads.map((lead, _i) => (
              <tr key={lead.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                <td style={tdStyle}><a href={`/admin/leads/${lead.id}`} style={{ color: '#0F2557', fontWeight: 600, textDecoration: 'none' }}>{lead.name}</a></td>
                <td style={tdStyle}><span style={{ fontSize: '.8rem', color: '#64748B' }}>{lead.serviceInterest || '—'}</span></td>
                <td style={tdStyle}><span style={{ fontSize: '.8rem', color: '#64748B' }}>{lead.sourcePage || '—'}</span></td>
                <td style={tdStyle}>
                  <span style={{
                    display: 'inline-block', padding: '2px 10px', fontSize: '.72rem', fontWeight: 700,
                    background: lead.status === 'NEW' ? '#FEF2F2' : lead.status === 'CONVERTED' ? '#F0FDF4' : '#F8FAFC',
                    color: lead.status === 'NEW' ? '#EF4444' : lead.status === 'CONVERTED' ? '#16A34A' : '#64748B',
                    borderRadius: 4,
                  }}>
                    {lead.status}
                  </span>
                </td>
                <td style={tdStyle}><span style={{ fontSize: '.8rem', color: '#94A3B8' }}>{new Date(lead.createdAt).toLocaleDateString('en-HK')}</span></td>
              </tr>
            ))}
            {recentLeads.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: '#94A3B8', fontSize: '.875rem' }}>
                  No leads yet. Leads will appear here when users submit the enquiry form.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: '.875rem', color: '#334155' };
