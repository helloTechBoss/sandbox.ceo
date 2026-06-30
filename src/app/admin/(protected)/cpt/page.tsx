export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function deleteCourse(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.cptPurchase.deleteMany({ where: { courseId: id } });
  await prisma.cptCourse.delete({ where: { id } });
  redirect('/admin/cpt');
}

async function togglePublish(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const current = formData.get('published') === 'true';
  await prisma.cptCourse.update({ where: { id }, data: { published: !current } });
  redirect('/admin/cpt');
}

export default async function CptAdminPage() {
  const courses = await prisma.cptCourse.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    include: { _count: { select: { purchases: true } } },
  });

  return (
    <div style={{ padding: 32, maxWidth: 1000 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 4 }}>CPT Marketplace</h1>
          <p style={{ fontSize: '.875rem', color: '#64748B' }}>
            Manage CPT courses for sale — <a href="/zh-Hant/compliance/cpt-marketplace" target="_blank" style={{ color: '#EF4444', textDecoration: 'none' }}>view marketplace ↗</a>
          </p>
        </div>
        <Link href="/admin/cpt/new" style={{ background: '#EF4444', color: '#fff', padding: '10px 20px', fontSize: '.875rem', fontWeight: 700, textDecoration: 'none' }}>
          + Add Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>🎓</div>
          <p style={{ fontSize: '.9rem', color: '#94A3B8' }}>No courses yet — click "+ Add Course" to create your first CPT lesson.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Course Name', 'Price (HKD)', 'Sales', 'Status', 'Order', ''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.map(c => {
                const name = (c.name as Record<string, string>)?.tc ?? '';
                return (
                  <tr key={c.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: '.875rem', color: '#0F2557' }}>{name}</div>
                      {c.featured && <span style={{ background: '#C9A84C', color: '#fff', fontSize: '.6rem', fontWeight: 700, padding: '1px 6px', marginTop: 4, display: 'inline-block' }}>精選</span>}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '.875rem', fontWeight: 700, color: '#EF4444' }}>HK${c.price.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontSize: '.875rem', color: '#334155' }}>{c._count.purchases} sold</td>
                    <td style={{ padding: '12px 16px' }}>
                      <form action={togglePublish} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="published" value={String(c.published)} />
                        <button type="submit" style={{ background: c.published ? '#D1FAE5' : '#FEE2E2', color: c.published ? '#065F46' : '#991B1B', border: 'none', padding: '4px 10px', fontSize: '.75rem', fontWeight: 700, cursor: 'pointer' }}>
                          {c.published ? '● Live' : '○ Draft'}
                        </button>
                      </form>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '.78rem', color: '#94A3B8' }}>{c.order}</td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <Link href={`/admin/cpt/${c.id}`} style={{ fontSize: '.78rem', color: '#0F2557', fontWeight: 600, textDecoration: 'none', marginRight: 14 }}>Edit</Link>
                      <form action={deleteCourse} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" style={{ fontSize: '.78rem', color: '#EF4444', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Purchase log */}
      {courses.some(c => c._count.purchases > 0) && (
        <div style={{ marginTop: 40 }}>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #0F2557' }}>
            Purchase Log
          </div>
          <PurchaseLog />
        </div>
      )}
    </div>
  );
}

async function PurchaseLog() {
  const purchases = await prisma.cptPurchase.findMany({
    orderBy: { paidAt: 'desc' },
    take: 50,
    include: { course: { select: { name: true } } },
  });
  if (purchases.length === 0) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F8FAFC' }}>
            {['Date', 'Course', 'Buyer Email', 'Name', 'HKD'].map(h => (
              <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: '.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {purchases.map(p => (
            <tr key={p.id} style={{ borderTop: '1px solid #F1F5F9' }}>
              <td style={{ padding: '10px 14px', fontSize: '.78rem', color: '#64748B', whiteSpace: 'nowrap' }}>{new Date(p.paidAt).toLocaleDateString('zh-HK')}</td>
              <td style={{ padding: '10px 14px', fontSize: '.8rem', color: '#0F2557', fontWeight: 600 }}>{(p.course.name as Record<string,string>)?.tc}</td>
              <td style={{ padding: '10px 14px', fontSize: '.8rem', color: '#334155' }}>{p.email}</td>
              <td style={{ padding: '10px 14px', fontSize: '.8rem', color: '#334155' }}>{p.name || '—'}</td>
              <td style={{ padding: '10px 14px', fontSize: '.8rem', fontWeight: 700, color: '#EF4444' }}>HK${p.amountPaid.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
