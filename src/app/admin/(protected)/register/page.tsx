'use client';
import { useState } from 'react';

export default function AdminRegisterPage() {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(''); setSuccess('');
    const form = new FormData(e.currentTarget);
    const password = form.get('password') as string;
    const confirm = form.get('confirm') as string;
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.get('name'), email: form.get('email'), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSuccess(`Admin account created for ${data.email}`);
      (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 32, maxWidth: 560 }}>
      <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#0F2557', marginBottom: 4 }}>
        Create Admin Account
      </h1>
      <p style={{ fontSize: '.875rem', color: '#64748B', marginBottom: 32 }}>
        Add a new administrator who can log in to this panel.
      </p>

      <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #E2E8F0', padding: 32 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Full Name</label>
          <input name="name" type="text" required style={inputStyle} placeholder="Jane Doe" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email</label>
          <input name="email" type="email" required style={inputStyle} placeholder="jane@sandbox.ceo" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Password</label>
          <input name="password" type="password" required style={inputStyle} placeholder="Min. 8 characters" />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Confirm Password</label>
          <input name="confirm" type="password" required style={inputStyle} placeholder="Repeat password" />
        </div>

        {error && <p style={{ fontSize: '.85rem', color: '#EF4444', marginBottom: 16 }}>{error}</p>}
        {success && <p style={{ fontSize: '.85rem', color: '#065F46', background: '#D1FAE5', padding: '10px 14px', marginBottom: 16 }}>{success}</p>}

        <button type="submit" disabled={loading} style={{
          background: '#0F2557', color: '#fff', padding: '12px 24px',
          fontFamily: "'Montserrat',sans-serif", fontSize: '.9rem', fontWeight: 700,
          border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1,
        }}>
          {loading ? 'Creating…' : 'Create Admin Account'}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#334155', marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0',
  outline: 'none', fontSize: '.9rem', color: '#334155',
  fontFamily: 'Inter,system-ui,sans-serif', boxSizing: 'border-box',
};
