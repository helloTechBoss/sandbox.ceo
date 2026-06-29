'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  serviceInterest: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  locale?: string;
  sourcePage?: string;
  waNumber?: string;
}

const services = {
  'zh-Hant': [
    'MSO 新牌照申請', 'MSO 續期', 'SFC 牌照', '美國 MSB/MTL', '持續合規服務',
    'AML 審計', '公司註冊', '公司秘書', '會計及稅務', 'AML 合規系統', '其他',
  ],
  en: [
    'MSO New Application', 'MSO Renewal', 'SFC Licence', 'US MSB/MTL',
    'Ongoing Compliance', 'AML Audit', 'Incorporation', 'Company Secretary',
    'Accounting & Tax', 'AML Compliance System', 'Other',
  ],
  'zh-Hans': [
    'MSO 新牌照申请', 'MSO 续期', 'SFC 牌照', '美国 MSB/MTL', '持续合规服务',
    'AML 审计', '公司注册', '公司秘书', '会计及税务', 'AML 合规系统', '其他',
  ],
};

export default function InquiryForm({ locale = 'zh-Hant', sourcePage = 'home', waNumber = '+85292318254' }: Props) {
  const isEn = locale === 'en';
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const serviceList = services[locale as keyof typeof services] ?? services['zh-Hant'];

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, sourcePage, sourceLocale: locale === 'zh-Hant' ? 'tc' : locale === 'zh-Hans' ? 'sc' : 'en' }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
    } catch {
      setError(isEn ? 'Submission failed. Please try WhatsApp instead.' : '提交失敗，請使用 WhatsApp 聯絡我們。');
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', border: '1px solid #E2E8F0' }}>
        <div style={{ width: 56, height: 56, background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', borderRadius: '50%' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#0F2557', marginBottom: 8 }}>
          {isEn ? 'Enquiry Received!' : '查詢已收到！'}
        </h3>
        <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', color: '#64748B' }}>
          {isEn ? 'Our team will respond within 1 business day.' : '我們的團隊將在 1 個工作天內回覆。'}
        </p>
        <a
          href={`https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi，我剛提交了查詢表格，希望盡快跟進')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20, background: '#EF4444', color: '#fff', padding: '12px 24px', fontWeight: 700, fontSize: '.9rem', textDecoration: 'none' }}
        >
          {isEn ? 'Also WhatsApp Us' : '也可 WhatsApp 我們'}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ background: '#fff', padding: '36px', border: '1px solid #E2E8F0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>{isEn ? 'Name *' : '姓名 *'}</label>
          <input {...register('name')} style={{ ...inputStyle, borderColor: errors.name ? '#EF4444' : '#E2E8F0' }} placeholder={isEn ? 'Your name' : '您的姓名'} />
          {errors.name && <span style={errorStyle}>{isEn ? 'Required' : '必填'}</span>}
        </div>
        <div>
          <label style={labelStyle}>{isEn ? 'Phone / WhatsApp' : '電話 / WhatsApp'}</label>
          <input {...register('phone')} style={inputStyle} placeholder="+852 xxxx xxxx" />
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>{isEn ? 'Email' : '電郵'}</label>
        <input {...register('email')} type="email" style={{ ...inputStyle, borderColor: errors.email ? '#EF4444' : '#E2E8F0' }} placeholder={isEn ? 'your@email.com' : '您的電郵'} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>{isEn ? 'Service Interest' : '查詢服務'}</label>
        <select {...register('serviceInterest')} style={inputStyle}>
          <option value="">{isEn ? '— Select a service —' : '— 選擇服務 —'}</option>
          {serviceList.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>{isEn ? 'Message' : '查詢詳情'}</label>
        <textarea {...register('message')} rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder={isEn ? 'Briefly describe your needs...' : '簡述您的需求...'} />
      </div>
      {error && <p style={{ ...errorStyle, marginBottom: 16, fontSize: '.85rem' }}>{error}</p>}
      <button type="submit" disabled={isSubmitting} style={{
        width: '100%', background: '#EF4444', color: '#fff', padding: '14px 24px',
        fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.95rem', fontWeight: 700,
        border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
        opacity: isSubmitting ? .7 : 1, transition: 'all .2s',
      }}>
        {isSubmitting ? (isEn ? 'Sending...' : '發送中...') : (isEn ? 'Submit Enquiry' : '提交查詢')}
      </button>
      <p style={{ textAlign: 'center', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.8rem', color: '#94A3B8', marginTop: 16 }}>
        {isEn
          ? 'Or WhatsApp us directly: '
          : '或直接 WhatsApp：'}
        <a href={`https://wa.me/${waNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#EF4444', fontWeight: 700 }}>
          {waNumber}
        </a>
      </p>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: "'Noto Sans TC',sans-serif",
  fontSize: '.85rem', fontWeight: 700, color: '#334155', marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  border: '1px solid #E2E8F0', outline: 'none',
  fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', color: '#334155',
  background: '#F8FAFC', transition: 'border-color .2s',
};
const errorStyle: React.CSSProperties = {
  color: '#EF4444', fontSize: '.75rem', marginTop: 4,
};
