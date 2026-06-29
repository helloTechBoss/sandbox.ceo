import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const pageSlugs = ['home', 'about', 'mso', 'licensing', 'compliance', 'corporate', 'tech', 'insights', 'contact'];

export default function NewFaqPage() {
  async function createFaq(data: FormData) {
    'use server';
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    await prisma.faq.create({
      data: {
        id,
        pageSlug: data.get('pageSlug') as string,
        subTab: (data.get('subTab') as string) || null,
        question: { tc: data.get('question_tc') as string, en: data.get('question_en') as string, sc: data.get('question_sc') as string },
        answer: { tc: data.get('answer_tc') as string, en: data.get('answer_en') as string, sc: data.get('answer_sc') as string },
        order: parseInt(data.get('order') as string) || 0,
      },
    });
    redirect('/admin/faqs');
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', fontSize: '.875rem', color: '#334155', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#334155', marginBottom: 6 };

  return (
    <div style={{ padding: 32, maxWidth: 860 }}>
      <Link href="/admin/faqs" style={{ fontSize: '.85rem', color: '#64748B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>← Back</Link>
      <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 24 }}>New FAQ</h1>
      <form action={createFaq}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Page</label>
            <select name="pageSlug" style={inputStyle}>
              {pageSlugs.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Sub-tab (optional)</label>
            <input name="subTab" style={inputStyle} placeholder="e.g. general" />
          </div>
        </div>

        <FaqTrilingualSection label="Question" fieldName="question" type="input" values={{ tc: '', en: '', sc: '' }} />
        <FaqTrilingualSection label="Answer" fieldName="answer" type="textarea" values={{ tc: '', en: '', sc: '' }} />

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Order</label>
          <input name="order" type="number" defaultValue={0} style={{ ...inputStyle, width: 120 }} />
        </div>

        <button type="submit" style={{ background: '#0F2557', color: '#fff', padding: '12px 28px', fontFamily: "'Montserrat',sans-serif", fontSize: '.9rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Save</button>
      </form>
    </div>
  );
}

function FaqTrilingualSection({ label, fieldName, type, values }: {
  label: string; fieldName: string; type: 'input' | 'textarea';
  values: { tc: string; en: string; sc: string };
}) {
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', fontSize: '.875rem', color: '#334155', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#334155', marginBottom: 6 };

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
