'use client';
import { useState } from 'react';

interface Props {
  courseId: string;
  locale: string;
  price: number;
  label: string;
}

export default function BuyButton({ courseId, locale, price, label }: Props) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function handleBuy() {
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('/api/stripe/cpt-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, locale }),
      });
      if (!res.ok) throw new Error('Checkout failed');
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setErr('Payment unavailable. Please try again or contact us via WhatsApp.');
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        style={{
          width: '100%', background: loading ? '#94A3B8' : '#EF4444', color: '#fff',
          padding: '15px 24px', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '1rem',
          fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'background .2s',
        }}
      >
        {loading ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
            </svg>
            Redirecting to payment…
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            {label} — HK${price.toLocaleString()}
          </>
        )}
      </button>
      {err && <p style={{ marginTop: 10, fontSize: '.82rem', color: '#EF4444' }}>{err}</p>}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
