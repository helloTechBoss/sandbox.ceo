export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma';
import Link from 'next/link';

type Status = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'CLOSED';

const statusColors: Record<Status, { bg: string; text: string }> = {
  NEW: { bg: '#FEF2F2', text: '#EF4444' },
  CONTACTED: { bg: '#FFF7ED', text: '#EA580C' },
  QUALIFIED: { bg: '#EFF6FF', text: '#2563EB' },
  CONVERTED: { bg: '#F0FDF4', text: '#16A34A' },
  CLOSED: { bg: '#F8FAFC', text: '#64748B' },
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const { status, q, page: pageParam } = await searchParams;
  const page = Number(pageParam ?? '1');
  const pageSize = 20;

  const where: Prisma.LeadWhereInput = {};
  if (status && status !== 'ALL') where.status = status as Status;
  if (q) where.OR = [
    { name: { contains: q, mode: 'insensitive' } },
    { email: { contains: q, mode: 'insensitive' } },
    { phone: { contains: q } },
    { serviceInterest: { contains: q, mode: 'insensitive' } },
  ];

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where, orderBy: { createdAt: 'desc' },
      take: pageSize, skip: (page - 1) * pageSize,
    }),
    prisma.lead.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  const statusCounts = await prisma.lead.groupBy({
    by: ['status'],
    _count: { _all: true },
  });
  const countMap = Object.fromEntries(statusCounts.map(s => [s.status, s._count._all]));

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 4 }}>
          Leads
        </h1>
        <p style={{ fontSize: '.875rem', color: '#64748B' }}>{total} total leads</p>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 20, flexWrap: 'wrap' }}>
        {['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'CLOSED'].map(s => {
          const count = s === 'ALL' ? total : (countMap[s] ?? 0);
          const active = (status ?? 'ALL') === s;
          return (
            <Link
              key={s}
              href={`/admin/leads?status=${s}${q ? `&q=${q}` : ''}`}
              style={{
                padding: '6px 14px', fontSize: '.78rem', fontWeight: 700,
                background: active ? '#0F2557' : '#fff',
                color: active ? '#fff' : '#64748B',
                border: '1px solid #E2E8F0', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              {s} <span style={{ background: active ? 'rgba(255,255,255,.2)' : '#F1F5F9', padding: '1px 6px', borderRadius: 4, fontSize: '.72rem' }}>{count}</span>
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <form method="get" action="/admin/leads" style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        {status && <input type="hidden" name="status" value={status} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name, email, phone, service..."
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #E2E8F0', fontSize: '.875rem', outline: 'none', maxWidth: 360 }}
        />
        <button type="submit" style={{ padding: '8px 16px', background: '#0F2557', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '.875rem', fontWeight: 600 }}>
          Search
        </button>
      </form>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Name', 'Contact', 'Service Interest', 'Source', 'Status', 'Date', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => {
              const sc = statusColors[lead.status as Status];
              return (
                <tr key={lead.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={tdStyle}>
                    <Link href={`/admin/leads/${lead.id}`} style={{ color: '#0F2557', fontWeight: 600, textDecoration: 'none', fontSize: '.875rem' }}>
                      {lead.name}
                    </Link>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: '.8rem', color: '#64748B' }}>{lead.email || '—'}</div>
                    <div style={{ fontSize: '.8rem', color: '#94A3B8' }}>{lead.phone || ''}</div>
                  </td>
                  <td style={tdStyle}><span style={{ fontSize: '.8rem', color: '#64748B' }}>{lead.serviceInterest || '—'}</span></td>
                  <td style={tdStyle}><span style={{ fontSize: '.8rem', color: '#94A3B8' }}>{lead.sourcePage || '—'} {lead.sourceLocale ? `(${lead.sourceLocale})` : ''}</span></td>
                  <td style={tdStyle}>
                    <span style={{ display: 'inline-block', padding: '2px 10px', fontSize: '.72rem', fontWeight: 700, background: sc.bg, color: sc.text, borderRadius: 4 }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={tdStyle}><span style={{ fontSize: '.78rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>{new Date(lead.createdAt).toLocaleDateString('en-HK')}</span></td>
                  <td style={tdStyle}>
                    <Link href={`/admin/leads/${lead.id}`} style={{ fontSize: '.78rem', color: '#EF4444', fontWeight: 600, textDecoration: 'none' }}>Edit →</Link>
                  </td>
                </tr>
              );
            })}
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: '#94A3B8', fontSize: '.875rem' }}>
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link
              key={p}
              href={`/admin/leads?page=${p}${status ? `&status=${status}` : ''}${q ? `&q=${q}` : ''}`}
              style={{
                padding: '6px 12px', fontSize: '.85rem', fontWeight: 600,
                background: p === page ? '#0F2557' : '#fff',
                color: p === page ? '#fff' : '#64748B',
                border: '1px solid #E2E8F0', textDecoration: 'none',
              }}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const tdStyle: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'top' };
