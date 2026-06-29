export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function FaqsPage() {
  const faqs = await prisma.faq.findMany({ orderBy: [{ pageSlug: 'asc' }, { order: 'asc' }] });

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 4 }}>FAQs</h1>
          <p style={{ fontSize: '.875rem', color: '#64748B' }}>{faqs.length} FAQs</p>
        </div>
        <Link href="/admin/faqs/new" style={{ background: '#EF4444', color: '#fff', padding: '10px 20px', fontSize: '.875rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          + New FAQ
        </Link>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Page', 'Sub-tab', 'Question (TC)', 'Order', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {faqs.map(faq => {
              const question = (faq.question as Record<string, string>)?.tc ?? '';
              return (
                <tr key={faq.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', fontSize: '.875rem', color: '#0F2557', fontWeight: 600 }}>{faq.pageSlug}</td>
                  <td style={{ padding: '12px 16px', fontSize: '.8rem', color: '#64748B' }}>{faq.subTab ?? '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '.875rem', color: '#334155' }}>{question}</td>
                  <td style={{ padding: '12px 16px', fontSize: '.8rem', color: '#94A3B8' }}>{faq.order}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/admin/faqs/${faq.id}`} style={{ fontSize: '.78rem', color: '#EF4444', fontWeight: 600, textDecoration: 'none' }}>Edit →</Link>
                  </td>
                </tr>
              );
            })}
            {faqs.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '40px 16px', textAlign: 'center', color: '#94A3B8', fontSize: '.875rem' }}>No FAQs yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
