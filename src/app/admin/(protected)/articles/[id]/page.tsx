export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import DeleteButton from '@/app/admin/components/DeleteButton';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  async function updateArticle(data: FormData) {
    'use server';
    await prisma.article.update({
      where: { id },
      data: {
        slug: data.get('slug') as string,
        title: { tc: data.get('title_tc') as string, en: data.get('title_en') as string, sc: data.get('title_sc') as string },
        category: { tc: data.get('category_tc') as string, en: data.get('category_en') as string, sc: data.get('category_sc') as string },
        categoryColor: data.get('categoryColor') as string,
        excerpt: { tc: data.get('excerpt_tc') as string, en: data.get('excerpt_en') as string, sc: data.get('excerpt_sc') as string },
        body: { tc: data.get('body_tc') as string, en: data.get('body_en') as string, sc: data.get('body_sc') as string },
        ctaLabel: { tc: data.get('ctaLabel_tc') as string, en: data.get('ctaLabel_en') as string, sc: data.get('ctaLabel_sc') as string },
        ctaWhatsappMessage: data.get('ctaWhatsappMessage') as string,
        order: parseInt(data.get('order') as string) || 0,
        published: data.get('published') === 'on',
        publishedAt: data.get('publishedAt') ? new Date(data.get('publishedAt') as string) : null,
      },
    });
    redirect('/admin/articles');
  }

  async function deleteArticle() {
    'use server';
    await prisma.article.delete({ where: { id } });
    redirect('/admin/articles');
  }

  const t = (field: keyof typeof article, locale: string) => ((article[field] as Record<string, string>)?.[locale] ?? '');

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', fontSize: '.875rem', color: '#334155', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#334155', marginBottom: 6 };

  function TrilingualSection({ label, fieldName, type, rows, values }: {
    label: string; fieldName: string; type: 'input' | 'textarea'; rows?: number;
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
              <textarea name={`${fieldName}_${locale}`} rows={rows ?? 4} defaultValue={values[locale]} style={{ ...inputStyle, resize: 'vertical' }} />
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
      <Link href="/admin/articles" style={{ fontSize: '.85rem', color: '#64748B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>← Back</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557' }}>Edit Article</h1>
        <DeleteButton action={deleteArticle} />
      </div>

      <form action={updateArticle}>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Slug</label>
          <input name="slug" required defaultValue={article.slug} style={inputStyle} />
        </div>

        <TrilingualSection label="Title" fieldName="title" type="input" values={{ tc: t('title', 'tc'), en: t('title', 'en'), sc: t('title', 'sc') }} />
        <TrilingualSection label="Category" fieldName="category" type="input" values={{ tc: t('category', 'tc'), en: t('category', 'en'), sc: t('category', 'sc') }} />

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Category Color</label>
          <input name="categoryColor" defaultValue={article.categoryColor ?? '#0F2557'} style={inputStyle} />
        </div>

        <TrilingualSection label="Excerpt" fieldName="excerpt" type="textarea" rows={4} values={{ tc: t('excerpt', 'tc'), en: t('excerpt', 'en'), sc: t('excerpt', 'sc') }} />
        <TrilingualSection label="Body" fieldName="body" type="textarea" rows={12} values={{ tc: t('body', 'tc'), en: t('body', 'en'), sc: t('body', 'sc') }} />
        <TrilingualSection label="CTA Label" fieldName="ctaLabel" type="input" values={{ tc: t('ctaLabel', 'tc'), en: t('ctaLabel', 'en'), sc: t('ctaLabel', 'sc') }} />

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>CTA WhatsApp Message</label>
          <input name="ctaWhatsappMessage" defaultValue={article.ctaWhatsappMessage ?? ''} style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={labelStyle}>Order</label>
            <input name="order" type="number" defaultValue={article.order} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Published At</label>
            <input name="publishedAt" type="date" defaultValue={article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 10) : ''} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 28 }}>
            <input name="published" type="checkbox" id="published" defaultChecked={article.published} style={{ width: 16, height: 16 }} />
            <label htmlFor="published" style={{ fontSize: '.875rem', fontWeight: 600, color: '#334155' }}>Published</label>
          </div>
        </div>

        <button type="submit" style={{ background: '#0F2557', color: '#fff', padding: '12px 28px', fontFamily: "'Montserrat',sans-serif", fontSize: '.9rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Save</button>
      </form>
    </div>
  );
}
