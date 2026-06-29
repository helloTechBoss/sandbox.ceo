export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function EditSectionPage({ params }: { params: Promise<{ slug: string; sectionId: string }> }) {
  const { slug, sectionId } = await params;
  const section = await prisma.section.findUnique({ where: { id: sectionId } });

  if (!section) {
    return (
      <div style={{ padding: 32 }}>
        <Link href={`/admin/sections/${slug}`} style={{ fontSize: '.85rem', color: '#64748B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>← Back</Link>
        <p style={{ color: '#EF4444', fontWeight: 600 }}>Section not found.</p>
      </div>
    );
  }

  async function updateSection(formData: FormData) {
    'use server';
    await prisma.section.update({
      where: { id: sectionId },
      data: {
        subTab: (formData.get('subTab') as string) || null,
        order: parseInt(formData.get('order') as string) || 0,
        translations: {
          tc: formData.get('tc') as string,
          en: formData.get('en') as string,
          sc: formData.get('sc') as string,
        },
      },
    });
    redirect(`/admin/sections/${slug}`);
  }

  const t = (locale: string) => ((section.translations as Record<string, string>)?.[locale] ?? '');
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', fontSize: '.875rem', color: '#334155', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#334155', marginBottom: 6 };
  const textareaStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical', fontFamily: "'Noto Sans TC', sans-serif" };

  return (
    <div style={{ padding: 32, maxWidth: 860 }}>
      <Link href={`/admin/sections/${slug}`} style={{ fontSize: '.85rem', color: '#64748B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>← Back to {slug}</Link>
      <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 24 }}>Edit Section</h1>

      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '16px 24px', marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Key</div>
          <div style={{ fontSize: '.9rem', fontWeight: 600, color: '#0F2557' }}>{section.key}</div>
        </div>
        <div>
          <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Page ID</div>
          <div style={{ fontSize: '.9rem', color: '#64748B' }}>{section.pageId}</div>
        </div>
      </div>

      <form action={updateSection}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Sub-tab <span style={{ fontWeight: 400, color: '#94A3B8' }}>(optional)</span></label>
            <input name="subTab" defaultValue={section.subTab ?? ''} style={inputStyle} placeholder="e.g. company-secretary" />
          </div>
          <div>
            <label style={labelStyle}>Order</label>
            <input name="order" type="number" defaultValue={section.order} style={inputStyle} />
          </div>
        </div>

        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 14 }}>
            Translations — Traditional Chinese / English / Simplified Chinese
          </div>
          {(['tc', 'en', 'sc'] as const).map((locale, i) => (
            <div key={locale} style={{ marginBottom: i === 2 ? 0 : 16 }}>
              <label style={labelStyle}>{locale.toUpperCase()}</label>
              <textarea name={locale} rows={6} defaultValue={t(locale)} style={textareaStyle} />
            </div>
          ))}
        </div>

        <button type="submit" style={{ background: '#0F2557', color: '#fff', padding: '12px 28px', fontFamily: "'Montserrat',sans-serif", fontSize: '.9rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          Save Section
        </button>
      </form>
    </div>
  );
}
