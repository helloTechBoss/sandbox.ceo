export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function SectionsPage() {
  const pages = await prisma.page.findMany({
    include: { _count: { select: { sections: true } } },
    orderBy: { slug: 'asc' },
  });

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 4 }}>Pages &amp; Sections</h1>
        <p style={{ fontSize: '.875rem', color: '#64748B' }}>Click a page to browse and edit its content sections</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {pages.map(page => (
          <div key={page.id} style={{ background: '#fff', border: '1px solid #E2E8F0', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                {page.slug}
              </div>
              <span style={{ background: '#F1F5F9', color: '#64748B', fontSize: '.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 2 }}>
                {page._count.sections} sections
              </span>
            </div>
            <Link
              href={`/admin/sections/${page.slug}`}
              style={{ fontSize: '.85rem', color: '#EF4444', fontWeight: 600, textDecoration: 'none' }}
            >
              Edit Sections →
            </Link>
          </div>
        ))}
        {pages.length === 0 && (
          <p style={{ color: '#94A3B8', fontSize: '.875rem' }}>No pages found.</p>
        )}
      </div>
    </div>
  );
}
