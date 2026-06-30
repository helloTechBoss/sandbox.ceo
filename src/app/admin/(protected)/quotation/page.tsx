export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const PILLAR_LABELS: Record<string, string> = {
  A: 'A — 公司成立 / Company Formation',
  B: 'B — 公司秘書 / Company Secretary',
  C: 'C — 會計 / Accounting',
  D: 'D — 審計 / Audit',
  E: 'E — 稅務 / Tax Advisory',
  F: 'F — 商務中心 / Business Centre',
  G: 'G — 企業服務 / Other Corp Services',
  H: 'H — 簽證及移民 / Visa & Immigration',
};

async function deleteService(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await prisma.packageFeature.deleteMany({ where: { packageId: id } });
  await prisma.package.delete({ where: { id } });
  redirect('/admin/quotation');
}

async function saveDefaultWaMsg(formData: FormData) {
  'use server';
  const value = (formData.get('corporate_default_wa_message') as string) ?? '';
  await prisma.setting.upsert({
    where: { key: 'corporate_default_wa_message' },
    create: { key: 'corporate_default_wa_message', value },
    update: { value },
  });
  redirect('/admin/quotation?saved=1');
}

export default async function QuotationAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const sp = await searchParams;

  const [services, waRow] = await Promise.all([
    prisma.package.findMany({
      where: { group: { in: Object.keys(PILLAR_LABELS) } },
      orderBy: [{ group: 'asc' }, { order: 'asc' }],
    }),
    prisma.setting.findUnique({ where: { key: 'corporate_default_wa_message' } }),
  ]);

  const defaultWaMsg = (waRow?.value as string) ?? '';

  const byPillar = Object.keys(PILLAR_LABELS).map(p => ({
    key: p,
    label: PILLAR_LABELS[p],
    items: services.filter(s => s.group === p),
  }));

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', fontSize: '.875rem', color: '#334155', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#334155', marginBottom: 6 };

  return (
    <div style={{ padding: 32, maxWidth: 1000 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 4 }}>Corporate Quotation</h1>
          <p style={{ fontSize: '.875rem', color: '#64748B', marginBottom: 0 }}>
            Manage services shown on <a href="/zh-Hant/quotation/corporate" target="_blank" style={{ color: '#EF4444', textDecoration: 'none' }}>the quotation page ↗</a>
          </p>
        </div>
        <Link
          href="/admin/packages/new"
          style={{ background: '#EF4444', color: '#fff', padding: '10px 20px', fontSize: '.875rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          + Add Service
        </Link>
      </div>

      {sp.saved && (
        <div style={{ background: '#D1FAE5', border: '1px solid #A7F3D0', padding: '12px 16px', marginBottom: 24, fontSize: '.875rem', color: '#065F46', fontWeight: 600 }}>
          ✓ Settings saved successfully.
        </div>
      )}

      {/* ── SECTION 1: 服務一覽 ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #0F2557' }}>
          <span style={{ background: '#0F2557', color: '#fff', fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.75rem', padding: '4px 10px', letterSpacing: '.08em' }}>TAB 1</span>
          <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557' }}>服務一覽 — Service List</span>
          <span style={{ fontSize: '.8rem', color: '#94A3B8' }}>{services.length} services across {byPillar.filter(p => p.items.length > 0).length} pillars</span>
        </div>

        {byPillar.map(({ key, label, items }) => (
          <div key={key} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, background: '#0F2557', color: '#fff', fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '.7rem' }}>{key}</span>
              <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.875rem', color: '#0F2557' }}>{label.split(' — ')[1]}</span>
              <span style={{ fontSize: '.75rem', color: '#94A3B8' }}>{items.length} service{items.length !== 1 ? 's' : ''}</span>
              <Link
                href={`/admin/packages/new`}
                style={{ marginLeft: 'auto', fontSize: '.75rem', color: '#EF4444', fontWeight: 600, textDecoration: 'none', border: '1px solid #EF4444', padding: '3px 10px' }}
              >
                + Add to {key}
              </Link>
            </div>

            {items.length === 0 ? (
              <div style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1', padding: '16px 20px', fontSize: '.8rem', color: '#94A3B8', textAlign: 'center' }}>
                No services yet — click "+ Add to {key}" to add one
              </div>
            ) : (
              <div style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC' }}>
                      {['Service Name (TC)', 'Price', 'Popular', 'Custom WA', 'Order', ''].map(h => (
                        <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: '.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(svc => {
                      const name = (svc.name as Record<string, string>)?.tc ?? '';
                      return (
                        <tr key={svc.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '10px 14px', fontSize: '.875rem', fontWeight: 600, color: '#0F2557' }}>{name}</td>
                          <td style={{ padding: '10px 14px', fontSize: '.875rem', color: '#EF4444', fontWeight: 700, whiteSpace: 'nowrap' }}>{svc.price}</td>
                          <td style={{ padding: '10px 14px' }}>
                            {svc.featured && <span style={{ background: '#C9A84C', color: '#fff', fontSize: '.65rem', fontWeight: 700, padding: '2px 6px' }}>熱門</span>}
                          </td>
                          <td style={{ padding: '10px 14px', fontSize: '.78rem', color: '#64748B', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {svc.ctaWhatsappMessage ? <span title={svc.ctaWhatsappMessage ?? ''}>✓ Custom</span> : <span style={{ color: '#CBD5E1' }}>Auto-generated</span>}
                          </td>
                          <td style={{ padding: '10px 14px', fontSize: '.78rem', color: '#94A3B8' }}>{svc.order}</td>
                          <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                            <Link href={`/admin/packages/${svc.id}`} style={{ fontSize: '.78rem', color: '#0F2557', fontWeight: 600, textDecoration: 'none', marginRight: 12 }}>Edit</Link>
                            <form action={deleteService} style={{ display: 'inline' }}>
                              <input type="hidden" name="id" value={svc.id} />
                              <button
                                type="submit"
                                style={{ fontSize: '.78rem', color: '#EF4444', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                              >
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
          </div>
        ))}
      </div>

      {/* ── SECTION 2: 報價計算器 ───────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #0F2557' }}>
          <span style={{ background: '#EF4444', color: '#fff', fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.75rem', padding: '4px 10px', letterSpacing: '.08em' }}>TAB 2</span>
          <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557' }}>報價計算器 — Quote Calculator</span>
        </div>

        {/* Default WA message */}
        <form action={saveDefaultWaMsg} style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '24px', marginBottom: 24 }}>
          <label style={labelStyle}>Default WhatsApp Message — "Get Accurate Quote" button</label>
          <textarea
            name="corporate_default_wa_message"
            defaultValue={defaultWaMsg}
            rows={4}
            placeholder="Hi Sandbox Corporate，我想查詢企業服務報價，請提供更多資訊。"
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
          />
          <p style={{ fontSize: '.75rem', color: '#94A3B8', marginTop: 6, marginBottom: 16 }}>
            When a visitor fills in the calculator and clicks "WhatsApp 獲取準確報價", this is the message sent. Leave blank → automatically generates a summary of the visitor's selections (revenue, transactions, bank accounts, complexity items, total fee).
          </p>
          <button type="submit" style={{ background: '#0F2557', color: '#fff', padding: '10px 24px', fontFamily: "'Montserrat',sans-serif", fontSize: '.875rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            Save Message
          </button>
        </form>

        {/* Pricing reference table */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '20px 24px' }}>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 12 }}>
            Accounting & Audit Base Fee Reference (HKD/year)
          </div>
          <p style={{ fontSize: '.8rem', color: '#64748B', marginBottom: 14 }}>
            These fees are displayed in the calculator. Each extra bank account adds HKD 500. Each complexity item adds HKD 500.
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.8rem' }}>
            <thead>
              <tr style={{ background: '#E2E8F0' }}>
                {['Annual Revenue', '≤200 txn', '201–500 txn', '501–800 txn', '801–1,000 txn'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '.72rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['No Operation (≤5 yrs)', '2,960', '—', '—', '—'],
                ['Zero Filing (Dormant)', '2,520', '—', '—', '—'],
                ['HKD 1M – 2M', '3,980', '4,200', '4,530', '4,750'],
                ['HKD 2M – 5M', '4,310', '4,530', '4,860', '5,080'],
                ['HKD 5M – 10M', '4,750', '4,970', '5,300', '5,520'],
                ['HKD 10M – 20M', '5,410', '5,630', '5,960', '6,180'],
                ['HKD 20M – 50M', '5,850', '6,400', '7,170', '7,950'],
                ['HKD 50M – 100M', '10,470', '—', '—', '—'],
                ['HKD 100M – 200M', 'Negotiable', '—', '—', '—'],
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid #E2E8F0', background: i % 2 === 0 ? '#fff' : '#F8FAFC' }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '8px 12px', color: j === 0 ? '#334155' : cell === '—' ? '#CBD5E1' : '#0F2557', fontWeight: j === 0 ? 500 : cell === '—' ? 400 : 600 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: '.72rem', color: '#94A3B8', marginTop: 12 }}>
            To change these fee amounts, contact your developer to update <code>CorporateCalculator.tsx</code> → <code>C_BASE</code>.
          </p>
        </div>
      </div>

    </div>
  );
}
