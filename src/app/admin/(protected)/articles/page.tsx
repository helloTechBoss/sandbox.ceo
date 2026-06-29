export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 4 }}>Insights / Articles</h1>
          <p style={{ fontSize: '.875rem', color: '#64748B' }}>{articles.length} articles</p>
        </div>
        <Link href="/admin/articles/new" style={{ background: '#EF4444', color: '#fff', padding: '10px 20px', fontSize: '.875rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          + New Article
        </Link>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Title (TC)', 'Category', 'Status', 'Date', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {articles.map(art => {
              const title = (art.title as Record<string, string>)?.tc ?? '';
              const cat = (art.category as Record<string, string>)?.tc ?? '';
              return (
                <tr key={art.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/admin/articles/${art.id}`} style={{ color: '#0F2557', fontWeight: 600, fontSize: '.875rem', textDecoration: 'none' }}>{title}</Link>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '.8rem', color: '#64748B' }}>{cat}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '2px 10px', fontSize: '.72rem', fontWeight: 700, background: art.published ? '#F0FDF4' : '#F8FAFC', color: art.published ? '#16A34A' : '#94A3B8', borderRadius: 4 }}>
                      {art.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '.78rem', color: '#94A3B8' }}>
                    {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString('en-HK') : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/admin/articles/${art.id}`} style={{ fontSize: '.78rem', color: '#EF4444', fontWeight: 600, textDecoration: 'none' }}>Edit →</Link>
                  </td>
                </tr>
              );
            })}
            {articles.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '40px 16px', textAlign: 'center', color: '#94A3B8', fontSize: '.875rem' }}>No articles yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
