'use client';
import { useState } from 'react';

export interface MemberInfo {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface Props {
  locale: string;
  onVerified: (member: MemberInfo) => void;
  onClose: () => void;
}

function t(locale: string, tc: string, en: string, sc: string) {
  return locale === 'en' ? en : locale === 'zh-Hans' ? sc : tc;
}

type Step = 'register' | 'otp';

export default function MemberModal({ locale, onVerified, onClose }: Props) {
  const [step, setStep] = useState<Step>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [memberId, setMemberId] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('/api/member/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setMemberId(data.memberId);
      setStep('otp');
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('/api/member/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid code');
      // Store in localStorage for session
      localStorage.setItem('sbx_member', JSON.stringify(data.member));
      onVerified(data.member);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', border: '1px solid #E2E8F0',
    fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', color: '#334155',
    outline: 'none', background: '#F8FAFC', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '.8rem', fontWeight: 600, color: '#475569', marginBottom: 6,
  };
  const btnStyle: React.CSSProperties = {
    width: '100%', background: '#0F2557', color: '#fff', padding: '13px',
    fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.9rem',
    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1, marginTop: 8,
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(15,37,87,.65)', backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#fff', width: '100%', maxWidth: 440, position: 'relative' }}>
        {/* Header */}
        <div style={{ background: '#0F2557', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '.75rem', letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 4 }}>
              SANDBOX GROUP
            </div>
            <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
              {step === 'register'
                ? t(locale, '會員登記 / 登入', 'Register / Sign In', '会员登记 / 登入')
                : t(locale, '輸入驗證碼', 'Enter Verification Code', '输入验证码')}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontSize: '1.4rem', padding: 0, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: '28px 24px' }}>

          {step === 'register' && (
            <>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', color: '#64748B', lineHeight: 1.7, margin: '0 0 24px' }}>
                {t(locale,
                  '請提供您的基本資料，我們將發送驗證碼至您的電郵以確認身份。',
                  'Please provide your details. We will send a verification code to your email to confirm your identity.',
                  '请提供您的基本资料，我们将发送验证码至您的电邮以确认身份。'
                )}
              </p>
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>{t(locale, '姓名 *', 'Full Name *', '姓名 *')}</label>
                  <input value={name} onChange={e => setName(e.target.value)} required style={inputStyle}
                    placeholder={t(locale, '您的全名', 'Your full name', '您的全名')} />
                </div>
                <div>
                  <label style={labelStyle}>{t(locale, '電郵地址 *', 'Email Address *', '电邮地址 *')}</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle}
                    placeholder="you@example.com" />
                </div>
                <div>
                  <label style={labelStyle}>{t(locale, '電話號碼（選填）', 'Phone Number (optional)', '电话号码（选填）')}</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle}
                    placeholder="+852 9xxx xxxx" />
                </div>
                {err && <p style={{ color: '#EF4444', fontSize: '.82rem', margin: 0 }}>{err}</p>}
                <button type="submit" disabled={loading} style={btnStyle}>
                  {loading
                    ? t(locale, '發送驗證碼…', 'Sending code…', '发送验证码…')
                    : t(locale, '發送驗證碼', 'Send Verification Code', '发送验证码')}
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', color: '#64748B', lineHeight: 1.7, margin: '0 0 8px' }}>
                {t(locale,
                  `驗證碼已發送至`,
                  `A 6-digit code was sent to`,
                  `验证码已发送至`
                )}
              </p>
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.9rem', color: '#0F2557', margin: '0 0 24px' }}>{email}</p>
              <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>{t(locale, '6 位數驗證碼', '6-digit Code', '6 位数验证码')}</label>
                  <input
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required maxLength={6}
                    style={{ ...inputStyle, fontSize: '1.6rem', letterSpacing: '.3em', textAlign: 'center', fontFamily: "'Montserrat',sans-serif", fontWeight: 700 }}
                    placeholder="000000"
                    autoFocus
                  />
                </div>
                {err && <p style={{ color: '#EF4444', fontSize: '.82rem', margin: 0 }}>{err}</p>}
                <button type="submit" disabled={loading || code.length !== 6} style={{ ...btnStyle, background: code.length === 6 ? '#EF4444' : '#94A3B8' }}>
                  {loading
                    ? t(locale, '驗證中…', 'Verifying…', '验证中…')
                    : t(locale, '確認身份', 'Verify Identity', '确认身份')}
                </button>
                <button type="button" onClick={() => { setStep('register'); setCode(''); setErr(''); }}
                  style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '.82rem', cursor: 'pointer', textDecoration: 'underline', padding: 0, textAlign: 'left' }}>
                  {t(locale, '← 重新填寫資料', '← Re-enter details', '← 重新填写资料')}
                </button>
              </form>
            </>
          )}

          <div style={{ marginTop: 20, padding: '14px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.75rem', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
              {t(locale,
                '您的資料僅用於服務交付及帳戶管理，不會出售予第三方。',
                'Your information is used solely for service delivery and account management, and will not be sold to third parties.',
                '您的资料仅用于服务交付及账户管理，不会出售予第三方。'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
