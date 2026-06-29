'use client';
import { useState, useRef } from 'react';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';
function t(locale: Locale, tc: string, en: string, sc: string) { return locale === 'en' ? en : locale === 'zh-Hans' ? sc : tc; }

interface Doc { docType: string; label: string; url: string }

interface Props {
  locale: Locale;
  sessionId: string;
  items: { name: string; amount: number }[];
  total: number;
  customerEmail?: string;
  customerName?: string;
}

const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', fontSize: '.875rem', color: '#334155', background: '#fff', boxSizing: 'border-box', fontFamily: 'inherit' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '.82rem', fontWeight: 600, color: '#334155', marginBottom: 6 };
const card: React.CSSProperties = { background: '#fff', border: '1px solid #E2E8F0', padding: '24px', marginBottom: 20 };
const sec: React.CSSProperties = { fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #F1F5F9' };

const DOC_TYPES = [
  { value: 'hkid',          label: { tc: '香港身份證 (HKID)',           en: 'HKID Card',                sc: '香港身份证 (HKID)' } },
  { value: 'passport',      label: { tc: '護照',                        en: 'Passport',                 sc: '护照' } },
  { value: 'br',            label: { tc: '商業登記證 (BR)',              en: 'Business Registration (BR)',sc: '商业登记证 (BR)' } },
  { value: 'bank_statement',label: { tc: '銀行月結單',                  en: 'Bank Statement',           sc: '银行月结单' } },
  { value: 'address_proof', label: { tc: '地址證明',                    en: 'Proof of Address',         sc: '地址证明' } },
  { value: 'other',         label: { tc: '其他文件',                    en: 'Other Document',           sc: '其他文件' } },
];

export default function OnboardingForm({ locale, sessionId, items, total, customerEmail = '', customerName = '' }: Props) {
  const [step, setStep] = useState<'form' | 'done'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [docs, setDocs] = useState<Doc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('hkid');
  const fileRef = useRef<HTMLInputElement>(null);

  const k = locale === 'en' ? 'en' : locale === 'zh-Hans' ? 'sc' : 'tc';

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('docType', selectedDocType);
      const res = await fetch('/api/onboarding/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const { url, label } = await res.json();
      setDocs(prev => [...prev, { docType: selectedDocType, label, url }]);
      if (fileRef.current) fileRef.current.value = '';
    } catch {
      setUploadErr(t(locale, '上傳失敗，請重試。', 'Upload failed, please try again.', '上传失败，请重试。'));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true); setError('');
    const fd = new FormData(e.currentTarget);
    const body = {
      stripeSessionId: sessionId,
      fullName: fd.get('fullName'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      companyName: fd.get('companyName'),
      companyBrNo: fd.get('companyBrNo'),
      hkidNo: fd.get('hkidNo'),
      notes: fd.get('notes'),
      docs,
    };
    try {
      const res = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Submission failed');
      setStep('done');
    } catch {
      setError(t(locale, '提交失敗，請重試或 WhatsApp 我們。', 'Submission failed. Please retry or WhatsApp us.', '提交失败，请重试或 WhatsApp 我们。'));
      setSubmitting(false);
    }
  }

  if (step === 'done') {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#0F2557', marginBottom: 12 }}>
          {t(locale, '資料已提交！', 'Details submitted!', '资料已提交！')}
        </h2>
        <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.93rem', color: '#475569', lineHeight: 1.8, maxWidth: 480, margin: '0 auto' }}>
          {t(locale,
            '我們的團隊將在一個工作天內與您聯絡，確認服務詳情並開始處理。感謝您選擇 Sandbox Group。',
            'Our team will contact you within one business day to confirm service details and begin processing. Thank you for choosing Sandbox Group.',
            '我们的团队将在一个工作天内与您联络，确认服务详情并开始处理。感谢您选择 Sandbox Group。'
          )}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* Order summary */}
      <div style={card}>
        <div style={sec}>{t(locale, '您的訂單', 'Your Order', '您的订单')}</div>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', color: '#334155' }}>{item.name}</span>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, color: '#EF4444', fontSize: '.85rem' }}>HK${item.amount.toLocaleString()}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, marginTop: 4 }}>
          <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.9rem', fontWeight: 700, color: '#0F2557' }}>{t(locale,'合計','Total','合计')}</span>
          <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0F2557' }}>HK${total.toLocaleString()}</span>
        </div>
      </div>

      {/* Contact info */}
      <div style={card}>
        <div style={sec}>{t(locale, '聯絡資料', 'Contact Details', '联络资料')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="ob-grid">
          <div>
            <label style={lbl}>{t(locale,'全名 *','Full Name *','全名 *')}</label>
            <input name="fullName" required defaultValue={customerName} style={inp} placeholder={t(locale,'陳大文','Chan Tai Man','陈大文')} />
          </div>
          <div>
            <label style={lbl}>{t(locale,'電郵 *','Email *','电邮 *')}</label>
            <input name="email" type="email" required defaultValue={customerEmail} style={inp} placeholder="name@example.com" />
          </div>
          <div>
            <label style={lbl}>{t(locale,'電話','Phone','电话')}</label>
            <input name="phone" style={inp} placeholder="+852 9XXX XXXX" />
          </div>
        </div>
      </div>

      {/* Company info */}
      <div style={card}>
        <div style={sec}>{t(locale, '公司資料（如適用）', 'Company Details (if applicable)', '公司资料（如适用）')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="ob-grid">
          <div>
            <label style={lbl}>{t(locale,'公司名稱','Company Name','公司名称')}</label>
            <input name="companyName" style={inp} placeholder="ABC Company Limited" />
          </div>
          <div>
            <label style={lbl}>{t(locale,'商業登記號碼 (BR)','Business Registration No.','商业登记号码 (BR)')}</label>
            <input name="companyBrNo" style={inp} placeholder="e.g. 12345678" />
          </div>
          <div>
            <label style={lbl}>{t(locale,'香港身份證號碼 (如適用)','HKID No. (if applicable)','香港身份证号码（如适用）')}</label>
            <input name="hkidNo" style={inp} placeholder="e.g. A123456(7)" />
          </div>
        </div>
      </div>

      {/* Document upload */}
      <div style={card}>
        <div style={sec}>{t(locale, '上傳所需文件', 'Upload Required Documents', '上传所需文件')}</div>
        <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#64748B', lineHeight: 1.7, marginBottom: 18 }}>
          {t(locale,
            '請上傳所需文件（如 HKID、護照、BR 等）。您亦可在服務開始後補交。',
            'Please upload required documents (HKID, passport, BR, etc.). You may also submit them after the service begins.',
            '请上传所需文件（如 HKID、护照、BR 等）。您也可在服务开始后补交。'
          )}
        </p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 16 }}>
          <div style={{ flex: '0 0 200px' }}>
            <label style={lbl}>{t(locale,'文件類型','Document Type','文件类型')}</label>
            <select value={selectedDocType} onChange={e => setSelectedDocType(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
              {DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label[k]}</option>)}
            </select>
          </div>
          <div>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.heic" onChange={handleFileUpload} style={{ fontSize: '.82rem' }} />
          </div>
        </div>
        {uploading && <p style={{ fontSize: '.8rem', color: '#C9A84C' }}>⏳ {t(locale,'上傳中…','Uploading…','上传中…')}</p>}
        {uploadErr && <p style={{ fontSize: '.8rem', color: '#EF4444' }}>{uploadErr}</p>}
        {docs.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {docs.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '8px 12px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontSize: '.8rem', color: '#065F46', flex: 1 }}>{DOC_TYPES.find(dt => dt.value === d.docType)?.label[k]} — {d.label}</span>
                <button type="button" onClick={() => setDocs(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '.9rem', padding: 0 }}>×</button>
              </div>
            ))}
          </div>
        )}
        <p style={{ fontSize: '.7rem', color: '#94A3B8', marginTop: 10 }}>
          {t(locale,'接受格式：PDF、JPG、PNG、HEIC。最大 10MB。','Accepted: PDF, JPG, PNG, HEIC. Max 10MB.','接受格式：PDF、JPG、PNG、HEIC。最大 10MB。')}
        </p>
      </div>

      {/* Notes */}
      <div style={card}>
        <div style={sec}>{t(locale,'備註','Additional Notes','备注')}</div>
        <textarea name="notes" rows={3} style={{ ...inp, resize: 'vertical', lineHeight: 1.65 }} placeholder={t(locale,'如有任何特別要求或資料，請在此說明。','Any special requirements or additional information.','如有任何特别要求或资料，请在此说明。')} />
      </div>

      {error && <p style={{ color: '#EF4444', fontSize: '.85rem', marginBottom: 16 }}>{error}</p>}

      <button type="submit" disabled={submitting} style={{ width: '100%', background: submitting ? '#94A3B8' : '#0F2557', color: '#fff', padding: '15px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1rem', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer' }}>
        {submitting ? t(locale,'提交中…','Submitting…','提交中…') : t(locale,'提交資料 →','Submit Details →','提交资料 →')}
      </button>

      <style>{`@media(max-width:640px){.ob-grid{grid-template-columns:1fr!important}}`}</style>
    </form>
  );
}
