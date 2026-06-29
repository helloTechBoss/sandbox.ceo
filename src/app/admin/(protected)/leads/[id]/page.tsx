export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'CLOSED'] as const;

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) notFound();

  async function updateLead(data: FormData) {
    'use server';
    const status = data.get('status') as string;
    const notes = data.get('notes') as string;
    await prisma.lead.update({
      where: { id },
      data: { status: status as typeof statuses[number], notes },
    });
    redirect(`/admin/leads/${id}`);
  }

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <Link href="/admin/leads" style={{ fontSize: '.85rem', color: '#64748B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
        ← Back to Leads
      </Link>

      <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 24 }}>
        {lead.name}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Lead details */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', padding: 24 }}>
          <h2 style={sectionHead}>Lead Details</h2>
          <dl style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Name', value: lead.name },
              { label: 'Email', value: lead.email || '—' },
              { label: 'Phone', value: lead.phone || '—' },
              { label: 'Service Interest', value: lead.serviceInterest || '—' },
              { label: 'Source Page', value: lead.sourcePage || '—' },
              { label: 'Language', value: lead.sourceLocale || '—' },
              { label: 'Submitted', value: new Date(lead.createdAt).toLocaleString('en-HK') },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt style={{ fontSize: '.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{label}</dt>
                <dd style={{ fontSize: '.9rem', color: '#334155' }}>{value}</dd>
              </div>
            ))}
          </dl>
          {lead.message && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Message</div>
              <p style={{ fontSize: '.875rem', color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{lead.message}</p>
            </div>
          )}
        </div>

        {/* Status & Notes */}
        <form action={updateLead} style={{ background: '#fff', border: '1px solid #E2E8F0', padding: 24 }}>
          <h2 style={sectionHead}>Status & Notes</h2>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Status</label>
            <select name="status" defaultValue={lead.status} style={inputStyle}>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Internal Notes</label>
            <textarea name="notes" rows={8} defaultValue={lead.notes ?? ''} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Add internal notes here..." />
          </div>
          <button type="submit" style={{
            width: '100%', background: '#0F2557', color: '#fff', padding: '11px 20px',
            fontFamily: "'Montserrat',sans-serif", fontSize: '.875rem', fontWeight: 700,
            border: 'none', cursor: 'pointer',
          }}>
            Save Changes
          </button>

          {/* WhatsApp quick action */}
          {lead.phone && (
            <a
              href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Hi，感謝您聯絡 Sandbox Group！')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: 12, background: '#25D366', color: '#fff', padding: '10px 20px',
                fontSize: '.875rem', fontWeight: 700, textDecoration: 'none',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp {lead.phone}
            </a>
          )}
        </form>
      </div>
    </div>
  );
}

const sectionHead: React.CSSProperties = { fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.9rem', color: '#0F2557', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #F1F5F9' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '.8rem', fontWeight: 600, color: '#64748B', marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', fontSize: '.875rem', color: '#334155', outline: 'none', background: '#F8FAFC' };
