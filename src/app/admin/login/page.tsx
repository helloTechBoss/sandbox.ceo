'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError('Invalid email or password.');
    } else {
      router.push('/admin');
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: 24 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#0F2557', marginBottom: 4 }}>
            SANDBOX <span style={{ color: '#EF4444' }}>GROUP</span>
          </div>
          <div style={{ fontSize: '.85rem', color: '#64748B' }}>Admin Panel</div>
        </div>

        <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #E2E8F0', padding: 32 }}>
          <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#0F2557', marginBottom: 24 }}>
            Sign In
          </h1>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input name="email" type="email" required autoComplete="username" style={inputStyle} placeholder="admin@sandbox.ceo" />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Password</label>
            <input name="password" type="password" required autoComplete="current-password" style={inputStyle} placeholder="••••••••" />
          </div>
          {error && <p style={{ color: '#EF4444', fontSize: '.85rem', marginBottom: 16 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{
            width: '100%', background: '#0F2557', color: '#fff', padding: '12px 24px',
            fontFamily: "'Montserrat',sans-serif", fontSize: '.9rem', fontWeight: 700,
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1,
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#334155', marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0',
  outline: 'none', fontSize: '.9rem', color: '#334155',
  fontFamily: 'Inter,system-ui,sans-serif',
};
