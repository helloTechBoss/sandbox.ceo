export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 4 }}>Team Members</h1>
          <p style={{ fontSize: '.875rem', color: '#64748B' }}>{members.length} members</p>
        </div>
        <Link href="/admin/team/new" style={{ background: '#EF4444', color: '#fff', padding: '10px 20px', fontSize: '.875rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          + New Member
        </Link>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Name (TC)', 'Title (TC)', 'Active', 'Order', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(m => {
              const name = (m.name as Record<string, string>)?.tc ?? '';
              const title = (m.title as Record<string, string>)?.tc ?? '';
              return (
                <tr key={m.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/admin/team/${m.id}`} style={{ color: '#0F2557', fontWeight: 600, fontSize: '.875rem', textDecoration: 'none' }}>{name}</Link>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '.8rem', color: '#64748B' }}>{title}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '2px 10px', fontSize: '.72rem', fontWeight: 700, background: m.active ? '#F0FDF4' : '#F8FAFC', color: m.active ? '#16A34A' : '#94A3B8', borderRadius: 4 }}>
                      {m.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '.8rem', color: '#94A3B8' }}>{m.order}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/admin/team/${m.id}`} style={{ fontSize: '.78rem', color: '#EF4444', fontWeight: 600, textDecoration: 'none' }}>Edit →</Link>
                  </td>
                </tr>
              );
            })}
            {members.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '40px 16px', textAlign: 'center', color: '#94A3B8', fontSize: '.875rem' }}>No team members yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
