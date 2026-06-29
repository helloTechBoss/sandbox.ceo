export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

const pageSlugs = ['home', 'about', 'mso', 'licensing', 'compliance', 'corporate', 'tech', 'insights', 'contact'];

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await prisma.faq.findUnique({ where: { id } });
  if (!faq) notFound();

  async function updateFaq(data: FormData) {
    'use server';
    await prisma.faq.update({
      where: { id },
      data: {
        pageSlug: data.get('pageSlug') as string,
        subTab: (data.get('subTab') as string) || null,
        question: { tc: data.get('question_tc') as string, en: data.get('question_en') as string, sc: data.get('question_sc') as string },
        answer: { tc: data.get('answer_tc') as string, en: data.get('answer_en') as string, sc: data.get('answer_sc') as string },
        order: parseInt(data.get('order') as string) || 0,
      },
    });
    redirect('/admin/faqs');
  }

  async function deleteFaq() {
    'use server';
    await prisma.faq.delete({ where: { id } });
    redirect('/admin/faqs');
  }

  const t = (field: 'question' | 'answer', locale: string) => ((faq[field] as Record<string, string>)?.[locale] ?? '');

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
      <Link href="/admin/faqs" style={{ fontSize: '.85rem', color: '#64748B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>← Back</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557' }}>Edit FAQ</h1>
        <form action={deleteFaq}>
          <button type="submit" style={{ background: '#EF4444', color: '#fff', padding: '10px 20px', fontFamily: "'Montserrat',sans-serif", fontSize: '.85rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Delete</button>
        </form>
      </div>

      <form action={updateFaq}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Page</label>
            <select name="pageSlug" defaultValue={faq.pageSlug} style={inputStyle}>
              {pageSlugs.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Sub-tab (optional)</label>
            <input name="subTab" defaultValue={faq.subTab ?? ''} style={inputStyle} placeholder="e.g. general" />
          </div>
        </div>

        <TriSection label="Question" fieldName="question" type="input" values={{ tc: t('question', 'tc'), en: t('question', 'en'), sc: t('question', 'sc') }} />
        <TriSection label="Answer" fieldName="answer" type="textarea" values={{ tc: t('answer', 'tc'), en: t('answer', 'en'), sc: t('answer', 'sc') }} />

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={faq.order} style={{ ...inputStyle, width: 120 }} />
        </div>

        <button type="submit" style={{ background: '#0F2557', color: '#fff', padding: '12px 28px', fontFamily: "'Montserrat',sans-serif", fontSize: '.9rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Save</button>
      </form>
    </div>
  );
}
