export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function SectionListPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({
    where: { slug },
    include: { sections: { orderBy: { order: 'asc' } } },
  });

  if (!page) {
    return (
      <div style={{ padding: 32 }}>
        <Link href="/admin/sections" style={{ fontSize: '.85rem', color: '#64748B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>← Back</Link>
        <p style={{ color: '#EF4444', fontWeight: 600 }}>Page not found.</p>
      </div>
    );
  }

  // Group sections: null subTab first as "General", then by subTab
  const groups: Map<string, typeof page.sections> = new Map();
  for (const section of page.sections) {
    const key = section.subTab ?? '__general__';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(section);
  }

  // Sort: general first, then alphabetically
  const sortedGroups = Array.from(groups.entries()).sort(([a], [b]) => {
    if (a === '__general__') return -1;
    if (b === '__general__') return 1;
    return a.localeCompare(b);
  });

  const thStyle: React.CSSProperties = { padding: '10px 16px', textAlign: 'left', fontSize: '.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em' };
  const tdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: '.875rem', color: '#334155' };

  return (
    <div style={{ padding: 32 }}>
      <Link href="/admin/sections" style={{ fontSize: '.85rem', color: '#64748B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>← Back to Pages</Link>
      <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 24, textTransform: 'uppercase' }}>{page.slug}</h1>

      {sortedGroups.map(([groupKey, sections]) => (
        <div key={groupKey} style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 10 }}>
            {groupKey === '__general__' ? 'General' : groupKey}
          </div>
          <div style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  <th style={thStyle}>Key</th>
                  <th style={thStyle}>Sub-tab</th>
                  <th style={thStyle}>Content Preview (TC)</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sections.map(section => {
                  const tc = ((section.translations as Record<string, string>)?.tc ?? '').slice(0, 60);
                  return (
                    <tr key={section.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                      <td style={{ ...tdStyle, fontWeight: 600, color: '#0F2557' }}>{section.key}</td>
                      <td style={{ ...tdStyle, color: '#64748B' }}>{section.subTab ?? '—'}</td>
                      <td style={{ ...tdStyle, color: '#64748B', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tc || '—'}</td>
                      <td style={tdStyle}>
                        <Link href={`/admin/sections/${slug}/${section.id}`} style={{ fontSize: '.78rem', color: '#EF4444', fontWeight: 600, textDecoration: 'none' }}>Edit →</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {page.sections.length === 0 && (
        <p style={{ color: '#94A3B8', fontSize: '.875rem' }}>No sections for this page.</p>
      )}
    </div>
  );
}
