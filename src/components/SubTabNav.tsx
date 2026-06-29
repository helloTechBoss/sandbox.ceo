'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export interface Tab {
  key: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  activeTab: string;
}

export default function SubTabNav({ tabs, activeTab }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const setTab = useCallback((key: string) => {
    const params = new URLSearchParams();
    if (key !== tabs[0].key) params.set('tab', key);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [pathname, router, tabs]);

  return (
    <>
      <div style={{
        position: 'sticky', top: 68, zIndex: 100,
        background: '#fff', borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,.04)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', overflowX: 'auto', gap: 0 }}>
          {tabs.map(tab => {
            const active = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => setTab(tab.key)}
                style={{
                  padding: '14px 20px', background: 'none', border: 'none',
                  borderBottom: active ? '3px solid #EF4444' : '3px solid transparent',
                  fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem',
                  fontWeight: active ? 700 : 500, color: active ? '#0F2557' : '#64748B',
                  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
                  letterSpacing: '.01em',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){
          /* hide scrollbar on subnav */
          div::-webkit-scrollbar{height:3px}
        }
      `}</style>
    </>
  );
}
