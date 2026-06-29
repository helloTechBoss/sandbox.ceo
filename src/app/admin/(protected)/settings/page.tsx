export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

const SETTING_FIELDS = [
  { key: 'whatsapp_number', label: 'WhatsApp Number', placeholder: '+85292318254', hint: 'Include country code. Used for all CTA links site-wide.' },
  { key: 'contact_email', label: 'Contact Email', placeholder: 'info@sandbox.ceo', hint: 'Optional.' },
  { key: 'ga_id', label: 'Google Analytics ID', placeholder: 'G-XXXXXXXXXX', hint: 'GA4 measurement ID.' },
  { key: 'social_linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/...', hint: 'Optional.' },
  { key: 'social_facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/...', hint: 'Optional.' },
  { key: 'og_image', label: 'Default OG Image URL', placeholder: 'https://www.sandbox.ceo/og-image.jpg', hint: 'Used for social sharing by default.' },
];

export default async function SettingsPage() {
  const settings = await prisma.setting.findMany();
  const map = Object.fromEntries(settings.map(s => [s.key, s.value]));

  async function updateSettings(data: FormData) {
    'use server';
    const updates = SETTING_FIELDS.map(f => ({
      key: f.key,
      value: (data.get(f.key) as string) ?? '',
    }));
    for (const u of updates) {
      await prisma.setting.upsert({
        where: { key: u.key },
        create: { key: u.key, value: u.value },
        update: { value: u.value },
      });
    }
    redirect('/admin/settings?saved=1');
  }

  return (
    <div style={{ padding: 32, maxWidth: 640 }}>
      <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 24 }}>Settings</h1>

      <form action={updateSettings} style={{ background: '#fff', border: '1px solid #E2E8F0', padding: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {SETTING_FIELDS.map(f => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input name={f.key} defaultValue={map[f.key] ?? ''} placeholder={f.placeholder} style={inputStyle} />
              {f.hint && <p style={{ fontSize: '.75rem', color: '#94A3B8', marginTop: 4 }}>{f.hint}</p>}
            </div>
          ))}
        </div>
        <button type="submit" style={{
          marginTop: 32, background: '#0F2557', color: '#fff', padding: '12px 28px',
          fontFamily: "'Montserrat',sans-serif", fontSize: '.9rem', fontWeight: 700,
          border: 'none', cursor: 'pointer',
        }}>
          Save Settings
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#334155', marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', fontSize: '.875rem', color: '#334155', outline: 'none', background: '#F8FAFC' };
