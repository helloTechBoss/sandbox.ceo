import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CptForm from '../CptForm';

export const dynamic = 'force-dynamic';

async function updateCourse(id: string, formData: FormData) {
  'use server';
  const g = (k: string) => formData.get(k) as string | null;
  await prisma.cptCourse.update({
    where: { id },
    data: {
      name: { tc: g('nameTc') || '', en: g('nameEn') || '', sc: g('nameSc') || '' },
      description: { tc: g('descTc') || '', en: g('descEn') || '', sc: g('descSc') || '' },
      price: parseInt(g('price') || '0', 10),
      videoUrl: g('videoUrl') || null,
      thumbnailUrl: g('thumbnailUrl') || null,
      published: formData.get('published') === '1',
      featured: formData.get('featured') === '1',
      order: parseInt(g('order') || '0', 10),
    },
  });
  redirect('/admin/cpt');
}

export default async function EditCptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await prisma.cptCourse.findUnique({ where: { id } });
  if (!c) notFound();

  const n = c.name as Record<string, string>;
  const d = c.description as Record<string, string>;
  const action = updateCourse.bind(null, id);

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.3rem', color: '#0F2557', marginBottom: 28 }}>Edit: {n.tc}</h1>
      <CptForm action={action} defaults={{
        nameTc: n.tc, nameEn: n.en, nameSc: n.sc,
        descTc: d.tc, descEn: d.en, descSc: d.sc,
        price: c.price,
        videoUrl: c.videoUrl ?? '',
        thumbnailUrl: c.thumbnailUrl ?? '',
        published: c.published,
        featured: c.featured,
        order: c.order,
      }} />
    </div>
  );
}
