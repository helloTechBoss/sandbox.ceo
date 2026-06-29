import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function NewTeamMemberPage() {
  async function createMember(data: FormData) {
    'use server';
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    await prisma.teamMember.create({
      data: {
        id,
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
      <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 24 }}>New Team Member</h1>
      <form action={createMember}>
        <TriSection label="Name" fieldName="name" type="input" values={{ tc: '', en: '', sc: '' }} />
        <TriSection label="Title" fieldName="title" type="input" values={{ tc: '', en: '', sc: '' }} />
        <TriSection label="Bio" fieldName="bio" type="textarea" values={{ tc: '', en: '', sc: '' }} />

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Photo URL</label>
          <input name="photoUrl" style={inputStyle} placeholder="https://..." />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={labelStyle}>Order</label>
            <input name="order" type="number" defaultValue={0} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 28 }}>
            <input name="active" type="checkbox" id="active" defaultChecked={true} style={{ width: 16, height: 16 }} />
            <label htmlFor="active" style={{ fontSize: '.875rem', fontWeight: 600, color: '#334155' }}>Active</label>
          </div>
        </div>

        <button type="submit" style={{ background: '#0F2557', color: '#fff', padding: '12px 28px', fontFamily: "'Montserrat',sans-serif", fontSize: '.9rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Save</button>
      </form>
    </div>
  );
}
