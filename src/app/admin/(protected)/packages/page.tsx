export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    include: { features: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  });

  // Group by group field
  const groups = new Map<string, typeof packages>();
  for (const pkg of packages) {
    if (!groups.has(pkg.group)) groups.set(pkg.group, []);
    groups.get(pkg.group)!.push(pkg);
  }

  const thStyle: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: '.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em' };
  const tdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: '.875rem', color: '#334155' };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 4 }}>Packages &amp; Plans</h1>
          <p style={{ fontSize: '.875rem', color: '#64748B' }}>{packages.length} packages across {groups.size} groups</p>
        </div>
        <Link href="/admin/packages/new" style={{ background: '#EF4444', color: '#fff', padding: '10px 20px', fontSize: '.875rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          + New Package
        </Link>
      </div>

      {Array.from(groups.entries()).map(([groupName, pkgs]) => (
        <div key={groupName} style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 10 }}>
            {groupName}
          </div>
          <div style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  <th style={thStyle}>Name (TC)</th>
                  <th style={thStyle}>Tier Label</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>Featured</th>
                  <th style={thStyle}>Order</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {pkgs.map(pkg => {
                  const name = (pkg.name as Record<string, string>)?.tc ?? '';
                  return (
                    <tr key={pkg.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                      <td style={{ ...tdStyle, fontWeight: 600, color: '#0F2557' }}>{name}</td>
                      <td style={tdStyle}>{pkg.tierLabel}</td>
                      <td style={tdStyle}>{pkg.price}</td>
                      <td style={tdStyle}>
                        {pkg.featured && (
                          <span style={{ background: '#C9A84C', color: '#fff', fontSize: '.7rem', fontWeight: 700, padding: '2px 8px' }}>Featured</span>
                        )}
                      </td>
                      <td style={{ ...tdStyle, color: '#94A3B8' }}>{pkg.order}</td>
                      <td style={tdStyle}>
                        <Link href={`/admin/packages/${pkg.id}`} style={{ fontSize: '.78rem', color: '#EF4444', fontWeight: 600, textDecoration: 'none' }}>Edit →</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {packages.length === 0 && (
        <p style={{ color: '#94A3B8', fontSize: '.875rem' }}>No packages yet.</p>
      )}
    </div>
  );
}
