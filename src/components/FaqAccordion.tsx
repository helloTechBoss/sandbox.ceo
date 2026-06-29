'use client';

import { useState } from 'react';

export interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      {faqs.map((faq, i) => (
        <div key={i} style={{ borderBottom: '1px solid #E2E8F0' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', padding: '14px 20px', background: 'none', border: 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
              fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.85rem',
              color: '#0F2557', cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span>{faq.question}</span>
            <span style={{ fontSize: '.8rem', color: open === i ? '#EF4444' : '#94A3B8', transition: 'transform .2s', transform: open === i ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▾</span>
          </button>
          {open === i && (
            <div style={{ padding: '0 20px 14px', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: '#64748B', lineHeight: 1.8 }}>
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
