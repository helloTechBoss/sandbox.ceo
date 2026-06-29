import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CptForm from '../CptForm';

async function createCourse(formData: FormData) {
  'use server';
  const g = (k: string) => formData.get(k) as string | null;
  await prisma.cptCourse.create({
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

export default function NewCptPage() {
  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.3rem', color: '#0F2557', marginBottom: 28 }}>New CPT Course</h1>
      <CptForm action={createCourse} />
    </div>
  );
}
