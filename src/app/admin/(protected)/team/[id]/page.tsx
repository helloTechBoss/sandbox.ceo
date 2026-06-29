export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) notFound();

  async function updateMember(data: FormData) {
    'use server';
    await prisma.teamMember.update({
      where: { id },
      data: {
        name: { tc: data.get('name_tc') as string, en: data.get('name_en') as string, sc: data.get('name_sc') as string },
        title: { tc: data.get('title_tc') as string, en: data.get('title_en') as string, sc: data.get('title_sc') as string },
        bio: { tc: data.get('bio_tc') as string, en: data.get('bio_en') as string, sc: data.get('bio_sc') as string },
        photoUrl: (data.get('photoUrl') as string) || null,
        order: parseInt(data.get('order') as string) || 0,
        active: data.get('active') === 'on',
      },
    });
    redirect('/admin/team');
  }

  async function deleteMember() {
    'use server';
    await prisma.teamMember.delete({ where: { id } });
    redirect('/admin/team');
  }

  const t = (field: 'name' | 'title' | 'bio', locale: string) => ((member[field] as Record<string, string>)?.[locale] ?? '');

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', fontSize: '.875rem', color: '#334155', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#334155', marginBottom: 6 };

  function TriSection({ label, fieldName, type, values }: {
    label: string; fieldName: string; type: 'input' | 'textarea';
    values: { tc: string; en: string; sc: string };
  }) {
    return (
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '20px 24px', marginBottom: 16 }}>
        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 14 }}>
          {label} — Traditional Chinese / English / Simplified Chinese
        </div>
        {(['tc', 'en', 'sc'] as const).map(locale => (
          <div key={locale} style={{ marginBottom: locale === 'sc' ? 0 : 12 }}>
            <label style={labelStyle}>{locale.toUpperCase()}</label>
            {type === 'textarea' ? (
              <textarea name={`${fieldName}_${locale}`} rows={4} defaultValue={values[locale]} style={{ ...inputStyle, resize: 'vertical' }} />
            ) : (
              <input name={`${fieldName}_${locale}`} defaultValue={values[locale]} style={inputStyle} />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: 32, maxWidth: 860 }}>
      <Link href="/admin/team" style={{ fontSize: '.85rem', color: '#64748B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>← Back</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557' }}>Edit Team Member</h1>
        <form action={deleteMember}>
          <button type="submit" style={{ background: '#EF4444', color: '#fff', padding: '10px 20px', fontFamily: "'Montserrat',sans-serif", fontSize: '.85rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Delete</button>
        </form>
      </div>

      <form action={updateMember}>
        <TriSection label="Name" fieldName="name" type="input" values={{ tc: t('name', 'tc'), en: t('name', 'en'), sc: t('name', 'sc') }} />
        <TriSection label="Title" fieldName="title" type="input" values={{ tc: t('title', 'tc'), en: t('title', 'en'), sc: t('title', 'sc') }} />
        <TriSection label="Bio" fieldName="bio" type="textarea" values={{ tc: t('bio', 'tc'), en: t('bio', 'en'), sc: t('bio', 'sc') }} />

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Photo URL</label>
          <input name="photoUrl" defaultValue={member.photoUrl ?? ''} style={inputStyle} placeholder="https://..." />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={labelStyle}>Order</label>
            <input name="order" type="number" defaultValue={member.order} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 28 }}>
            <input name="active" type="checkbox" id="active" defaultChecked={member.active} style={{ width: 16, height: 16 }} />
            <label htmlFor="active" style={{ fontSize: '.875rem', fontWeight: 600, color: '#334155' }}>Active</label>
          </div>
        </div>

        <button type="submit" style={{ background: '#0F2557', color: '#fff', padding: '12px 28px', fontFamily: "'Montserrat',sans-serif", fontSize: '.9rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Save</button>
      </form>
    </div>
  );
}
