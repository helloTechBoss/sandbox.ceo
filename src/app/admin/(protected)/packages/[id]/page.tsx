export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const FEATURE_SLOTS = 10;

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: { features: { orderBy: { order: 'asc' } } },
  });

  if (!pkg) {
    return (
      <div style={{ padding: 32 }}>
        <Link href="/admin/packages" style={{ fontSize: '.85rem', color: '#64748B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>← Back</Link>
        <p style={{ color: '#EF4444', fontWeight: 600 }}>Package not found.</p>
      </div>
    );
  }

  async function updatePackage(formData: FormData) {
    'use server';
    await prisma.package.update({
      where: { id },
      data: {
        group: formData.get('group') as string,
        tierLabel: formData.get('tierLabel') as string,
        name: { tc: formData.get('name_tc') as string, en: formData.get('name_en') as string, sc: formData.get('name_sc') as string },
        price: formData.get('price') as string,
        stripeAmount: formData.get('stripeAmount') ? parseInt(formData.get('stripeAmount') as string) : null,
        priceNote: { tc: formData.get('priceNote_tc') as string || '', en: formData.get('priceNote_en') as string || '', sc: formData.get('priceNote_sc') as string || '' },
        badgeLabel: { tc: formData.get('badgeLabel_tc') as string || '', en: formData.get('badgeLabel_en') as string || '', sc: formData.get('badgeLabel_sc') as string || '' },
        featured: formData.get('featured') === 'on',
        ctaWhatsappMessage: (formData.get('ctaWhatsappMessage') as string) || null,
        order: parseInt(formData.get('order') as string) || 0,
      },
    });
    // Delete all features and recreate
    await prisma.packageFeature.deleteMany({ where: { packageId: id } });
    const featureData = Array.from({ length: FEATURE_SLOTS }, (_, i) => {
      const tc = formData.get(`feature_tc_${i}`) as string;
      if (!tc) return null;
      return {
        id: crypto.randomUUID(),
        packageId: id,
        label: { tc, en: formData.get(`feature_en_${i}`) as string || '', sc: formData.get(`feature_sc_${i}`) as string || '' },
        enabled: formData.get(`feature_enabled_${i}`) === 'on',
        order: i,
      };
    }).filter(Boolean) as { id: string; packageId: string; label: object; enabled: boolean; order: number }[];
    if (featureData.length > 0) {
      await prisma.packageFeature.createMany({ data: featureData });
    }
    redirect('/admin/packages');
  }

  async function deletePackage() {
    'use server';
    await prisma.package.delete({ where: { id } });
    redirect('/admin/packages');
  }

  const g = (field: keyof typeof pkg, locale: string) => ((pkg[field] as Record<string, string>)?.[locale] ?? '');

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', fontSize: '.875rem', color: '#334155', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#334155', marginBottom: 6 };

  function TrilingualSection({ label, fieldName, values }: { label: string; fieldName: string; values: { tc: string; en: string; sc: string } }) {
    return (
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '20px 24px', marginBottom: 16 }}>
        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 14 }}>
          {label} — Traditional Chinese / English / Simplified Chinese
        </div>
        {(['tc', 'en', 'sc'] as const).map((locale, i) => (
          <div key={locale} style={{ marginBottom: i === 2 ? 0 : 12 }}>
            <label style={labelStyle}>{locale.toUpperCase()}</label>
            <input name={`${fieldName}_${locale}`} defaultValue={values[locale]} style={inputStyle} />
          </div>
        ))}
      </div>
    );
  }

  // Pad features to FEATURE_SLOTS
  const featureSlots = Array.from({ length: FEATURE_SLOTS }, (_, i) => pkg.features[i] ?? null);

  return (
    <div style={{ padding: 32, maxWidth: 860 }}>
      <Link href="/admin/packages" style={{ fontSize: '.85rem', color: '#64748B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>← Back to Packages</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557' }}>Edit Package</h1>
        <form action={deletePackage}>
          <button type="submit" style={{ background: '#EF4444', color: '#fff', padding: '10px 20px', fontFamily: "'Montserrat',sans-serif", fontSize: '.85rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            Delete Package
          </button>
        </form>
      </div>

      <form action={updatePackage}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Group</label>
            <select name="group" required defaultValue={pkg.group} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32 }}>
              <option value="">— Select group —</option>
              <optgroup label="Quotation Page Services (A–H)">
                <option value="A">A — 公司成立 / Company Formation</option>
                <option value="B">B — 公司秘書 / Company Secretary</option>
                <option value="C">C — 會計 / Accounting</option>
                <option value="D">D — 審計 / Audit</option>
                <option value="E">E — 稅務 / Tax Advisory</option>
                <option value="F">F — 商務中心 / Business Centre</option>
                <option value="G">G — 企業服務 / Other Corp Services</option>
                <option value="H">H — 簽證及移民 / Visa &amp; Immigration</option>
              </optgroup>
              <optgroup label="Pricing Plan Cards">
                <option value="mso">mso</option>
                <option value="incorporation">incorporation</option>
                <option value="comsec">comsec</option>
              </optgroup>
            </select>
            <p style={{ fontSize: '.72rem', color: '#94A3B8', marginTop: 4 }}>Groups A–H appear as service cards on the Corporate Quotation page. Other groups are used for pricing plan tables.</p>
          </div>
          <div>
            <label style={labelStyle}>Tier Label</label>
            <input name="tierLabel" required defaultValue={pkg.tierLabel} style={inputStyle} />
          </div>
        </div>

        <TrilingualSection label="Name" fieldName="name" values={{ tc: g('name', 'tc'), en: g('name', 'en'), sc: g('name', 'sc') }} />
        <TrilingualSection label="Price Note (optional)" fieldName="priceNote" values={{ tc: g('priceNote', 'tc'), en: g('priceNote', 'en'), sc: g('priceNote', 'sc') }} />
        <TrilingualSection label="Badge Label (optional)" fieldName="badgeLabel" values={{ tc: g('badgeLabel', 'tc'), en: g('badgeLabel', 'en'), sc: g('badgeLabel', 'sc') }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Display Price</label>
            <input name="price" required defaultValue={pkg.price} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Online Purchase Price (HKD) — blank = enquiry only</label>
            <input name="stripeAmount" type="number" min="0" defaultValue={pkg.stripeAmount ?? ''} style={inputStyle} placeholder="e.g. 1800" />
          </div>
          <div>
            <label style={labelStyle}>Order</label>
            <input name="order" type="number" defaultValue={pkg.order} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 28 }}>
            <input name="featured" type="checkbox" id="featured" defaultChecked={pkg.featured} style={{ width: 16, height: 16 }} />
            <label htmlFor="featured" style={{ fontSize: '.875rem', fontWeight: 600, color: '#334155' }}>Featured</label>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>CTA WhatsApp Message (optional)</label>
          <input name="ctaWhatsappMessage" defaultValue={pkg.ctaWhatsappMessage ?? ''} style={inputStyle} placeholder="Hi Sandbox Corporate，我想查詢：[服務名稱]..." />
          <p style={{ fontSize: '.72rem', color: '#94A3B8', marginTop: 4 }}>For quotation page services (groups A–H): custom WhatsApp message when visitor clicks "Enquire". If blank, an auto-generated message with the service name and price is used.</p>
        </div>

        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 16 }}>
            Features (up to {FEATURE_SLOTS})
          </div>
          {featureSlots.map((feature, i) => {
            const fl = (locale: string) => ((feature?.label as Record<string, string>)?.[locale] ?? '');
            return (
              <div key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '14px 16px', marginBottom: 10 }}>
                <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Feature {i + 1}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'flex-end' }}>
                  {(['tc', 'en', 'sc'] as const).map(locale => (
                    <div key={locale}>
                      <label style={{ ...labelStyle, fontSize: '.75rem' }}>{locale.toUpperCase()}</label>
                      <input name={`feature_${locale}_${i}`} defaultValue={fl(locale)} style={{ ...inputStyle, fontSize: '.8rem' }} placeholder={locale === 'tc' ? 'Feature label...' : ''} />
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 2 }}>
                    <input name={`feature_enabled_${i}`} type="checkbox" id={`fe_${i}`} defaultChecked={feature?.enabled ?? true} style={{ width: 14, height: 14 }} />
                    <label htmlFor={`fe_${i}`} style={{ fontSize: '.75rem', fontWeight: 600, color: '#334155' }}>On</label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button type="submit" style={{ background: '#0F2557', color: '#fff', padding: '12px 28px', fontFamily: "'Montserrat',sans-serif", fontSize: '.9rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          Save Package
        </button>
      </form>
    </div>
  );
}
