'use client';
import { useState, useCallback } from 'react';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';
type LK = 'tc' | 'en' | 'sc';

function lk(locale: Locale): LK { return locale === 'en' ? 'en' : locale === 'zh-Hans' ? 'sc' : 'tc'; }
function t(locale: Locale, tc: string, en: string, sc: string) { return locale === 'en' ? en : locale === 'zh-Hans' ? sc : tc; }

export interface PkgItem {
  id: string;
  group: string;
  tierLabel: string;
  name: { tc: string; en: string; sc: string };
  price: string;
  stripeAmount: number | null;
  featured: boolean;
  features: { label: { tc: string; en: string; sc: string }; enabled: boolean }[];
}

export interface CptItem {
  id: string;
  name: { tc: string; en: string; sc: string };
  price: number;
  description: { tc: string; en: string; sc: string };
  thumbnailUrl: string | null;
  featured: boolean;
}

interface CartEntry { type: 'package' | 'cpt'; id: string; name: string; amount: number }

const GROUP_LABELS: Record<string, { tc: string; en: string; sc: string }> = {
  mso:           { tc: 'MSO 牌照服務',      en: 'MSO Licensing',         sc: 'MSO 牌照服务' },
  incorporation: { tc: '公司成立',           en: 'Company Formation',     sc: '公司成立' },
  comsec:        { tc: '公司秘書',           en: 'Company Secretary',     sc: '公司秘书' },
  accounting:    { tc: '會計及稅務',         en: 'Accounting & Tax',      sc: '会计及税务' },
  audit:         { tc: '審計',              en: 'Audit',                 sc: '审计' },
  compliance:    { tc: '持續合規',           en: 'Compliance',            sc: '持续合规' },
  licensing:     { tc: '牌照服務',           en: 'Licensing',             sc: '牌照服务' },
  tech:          { tc: '合規科技',           en: 'RegTech',               sc: '合规科技' },
};

function groupLabel(group: string, k: LK): string {
  return GROUP_LABELS[group]?.[k] ?? group;
}

const TABS_DEF = [
  { key: 'services', tcLabel: '企業服務套餐',  enLabel: 'Service Packages',  scLabel: '企业服务套餐' },
  { key: 'training', tcLabel: 'CPT 培訓課程', enLabel: 'CPT Training',       scLabel: 'CPT 培训课程' },
];

export default function PackagesShell({
  locale,
  waNumber,
  packageGroups,
  cptCourses,
}: {
  locale: Locale;
  waNumber: string;
  packageGroups: { group: string; items: PkgItem[] }[];
  cptCourses: CptItem[];
}) {
  const k = lk(locale);
  const [tab, setTab] = useState('services');
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const inCart = useCallback((id: string) => cart.some(c => c.id === id), [cart]);

  const toggle = useCallback((entry: CartEntry) => {
    setCart(prev =>
      prev.some(c => c.id === entry.id)
        ? prev.filter(c => c.id !== entry.id)
        : [...prev, entry]
    );
  }, []);

  const total = cart.reduce((s, c) => s + c.amount, 0);

  async function handleCheckout() {
    if (!cart.length) return;
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('/api/stripe/service-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(c => ({ type: c.type, id: c.id })),
          locale,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || 'Checkout failed');
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Checkout failed');
      setLoading(false);
    }
  }

  const cartBtn = (
    <button
      onClick={() => setCartOpen(o => !o)}
      style={{
        position: 'fixed', bottom: 88, right: 24, zIndex: 9990,
        background: cart.length ? '#EF4444' : '#94A3B8',
        color: '#fff', border: 'none', borderRadius: '50%',
        width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,.25)',
        transition: 'background .2s',
      }}
      aria-label="Cart"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      {cart.length > 0 && (
        <span style={{ position: 'absolute', top: 6, right: 6, background: '#0F2557', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: '.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {cart.length}
        </span>
      )}
    </button>
  );

  /* Cart panel */
  const cartPanel = cartOpen && (
    <div style={{ position: 'fixed', bottom: 156, right: 24, zIndex: 9991, width: 340, background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 16px 40px rgba(0,0,0,.18)' }}>
      <div style={{ background: '#0F2557', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>
          {t(locale, '已選服務', 'Selected Services', '已选服务')} ({cart.length})
        </span>
        <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontSize: '1.2rem', padding: 0 }}>×</button>
      </div>

      <div style={{ maxHeight: 280, overflowY: 'auto' }}>
        {cart.length === 0 ? (
          <div style={{ padding: '24px 18px', textAlign: 'center', fontSize: '.83rem', color: '#94A3B8' }}>
            {t(locale, '尚未選擇任何服務', 'No services selected yet', '尚未选择任何服务')}
          </div>
        ) : cart.map(c => (
          <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 18px', borderBottom: '1px solid #F1F5F9', gap: 8 }}>
            <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#334155', flex: 1, lineHeight: 1.4 }}>{c.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.82rem', fontWeight: 700, color: '#EF4444' }}>HK${c.amount.toLocaleString()}</span>
              <button onClick={() => toggle(c)} style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', fontSize: '1rem', padding: 0, lineHeight: 1 }}>×</button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div style={{ padding: '14px 18px', borderTop: '2px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', fontWeight: 600 }}>
              {t(locale, '合計', 'Total', '合计')}
            </span>
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#0F2557' }}>HK${total.toLocaleString()}</span>
          </div>
          {err && <p style={{ fontSize: '.75rem', color: '#EF4444', marginBottom: 8 }}>{err}</p>}
          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{ width: '100%', background: loading ? '#94A3B8' : '#EF4444', color: '#fff', padding: '12px', fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.9rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? t(locale, '處理中…', 'Processing…', '处理中…') : t(locale, '前往付款 →', 'Proceed to Payment →', '前往付款 →')}
          </button>
          <p style={{ fontSize: '.7rem', color: '#94A3B8', textAlign: 'center', marginTop: 8 }}>
            {t(locale, '由 Stripe 安全付款處理', 'Secured by Stripe', '由 Stripe 安全付款处理')}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {cartBtn}
      {cartPanel}

      {/* ── Tab Nav ─────────────────────────────────────────── */}
      <div style={{ position: 'sticky', top: 68, zIndex: 100, background: '#fff', borderBottom: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            {TABS_DEF.map(tb => {
              const label = k === 'en' ? tb.enLabel : k === 'sc' ? tb.scLabel : tb.tcLabel;
              const active = tab === tb.key;
              return (
                <button key={tb.key} onClick={() => setTab(tb.key)} style={{ padding: '14px 16px', background: 'none', border: 'none', borderBottom: active ? '3px solid #EF4444' : '3px solid transparent', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem', fontWeight: active ? 700 : 500, color: active ? '#0F2557' : '#64748B', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s' }}>
                  {label}
                </button>
              );
            })}
          </div>
          {cart.length > 0 && (
            <button onClick={() => setCartOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#EF4444', color: '#fff', padding: '7px 16px', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {cart.length} {t(locale, '項', 'item(s)', '项')} · HK${total.toLocaleString()}
            </button>
          )}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div style={{ background: '#F8FAFC', padding: '40px 0 72px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

          {/* ── SERVICE PACKAGES TAB ── */}
          {tab === 'services' && (
            <div>
              {packageGroups.map(({ group, items }) => {
                const purchasable = items.filter(i => i.stripeAmount !== null);
                const enquiryOnly = items.filter(i => i.stripeAmount === null);
                return (
                  <div key={group} style={{ marginBottom: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '.7rem', letterSpacing: '.14em', color: '#C9A84C', textTransform: 'uppercase' }}>
                        {groupLabel(group, k)}
                      </div>
                      <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                      {purchasable.length > 0 && (
                        <span style={{ fontSize: '.7rem', color: '#94A3B8' }}>{purchasable.length} {t(locale, '可直接購買', 'purchasable', '可直接购买')}</span>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
                      {items.map(pkg => {
                        const name = pkg.name[k] || pkg.name.tc;
                        const canBuy = pkg.stripeAmount !== null;
                        const selected = inCart(pkg.id);
                        return (
                          <div key={pkg.id} style={{ background: '#fff', border: `2px solid ${selected ? '#EF4444' : '#E2E8F0'}`, position: 'relative', transition: 'border-color .15s, box-shadow .15s', boxShadow: selected ? '0 0 0 3px rgba(239,68,68,.12)' : 'none' }}>
                            {pkg.featured && (
                              <div style={{ background: '#C9A84C', color: '#fff', fontFamily: "'Montserrat',sans-serif", fontSize: '.6rem', fontWeight: 700, padding: '4px 12px', textAlign: 'center', letterSpacing: '.08em' }}>
                                {t(locale, '熱門推介', 'POPULAR', '热门推介')}
                              </div>
                            )}
                            <div style={{ padding: '20px' }}>
                              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 6 }}>
                                {pkg.tierLabel}
                              </div>
                              <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.95rem', color: '#0F2557', lineHeight: 1.4, marginBottom: 12 }}>{name}</h3>

                              {pkg.features.length > 0 && (
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                  {pkg.features.filter(f => f.enabled).slice(0, 4).map((f, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.78rem', color: '#475569', lineHeight: 1.45 }}>
                                      <span style={{ color: '#C9A84C', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                                      {f.label[k] || f.label.tc}
                                    </li>
                                  ))}
                                </ul>
                              )}

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                                <div>
                                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.05rem', color: canBuy ? '#EF4444' : '#C9A84C' }}>
                                    {pkg.price}
                                  </div>
                                  {canBuy && String(pkg.stripeAmount) !== pkg.price.replace(/[^0-9]/g, '') && (
                                    <div style={{ fontSize: '.68rem', color: '#94A3B8' }}>{t(locale, '線上付款', 'Pay online', '线上付款')} HK${pkg.stripeAmount?.toLocaleString()}</div>
                                  )}
                                </div>
                                {canBuy ? (
                                  <button
                                    onClick={() => toggle({ type: 'package', id: pkg.id, name, amount: pkg.stripeAmount! })}
                                    style={{ background: selected ? '#EF4444' : '#0F2557', color: '#fff', padding: '8px 14px', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.78rem', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'background .15s', whiteSpace: 'nowrap' }}
                                  >
                                    {selected ? t(locale, '✓ 已選', '✓ Added', '✓ 已选') : t(locale, '加入', 'Add', '加入')}
                                  </button>
                                ) : (
                                  <a
                                    href={`https://wa.me/${waNumber.replace(/\D/g,'')}?text=${encodeURIComponent(t(locale,`Hi Sandbox，我想查詢 ${name} 的報價。`,`Hi Sandbox, I'd like to enquire about ${name}.`,`Hi Sandbox，我想查询 ${name} 的报价。`))}`}
                                    target="_blank" rel="noopener noreferrer"
                                    style={{ background: '#F1F5F9', color: '#475569', padding: '8px 14px', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.78rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
                                  >
                                    {t(locale, '查詢', 'Enquire', '查询')}
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── CPT TRAINING TAB ── */}
          {tab === 'training' && (
            <div>
              {cptCourses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎓</div>
                  <p style={{ color: '#94A3B8' }}>{t(locale, '課程即將推出。', 'Courses coming soon.', '课程即将推出。')}</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
                  {cptCourses.map(c => {
                    const name = c.name[k] || c.name.tc;
                    const desc = c.description[k] || '';
                    const selected = inCart(c.id);
                    return (
                      <div key={c.id} style={{ background: '#fff', border: `2px solid ${selected ? '#EF4444' : '#E2E8F0'}`, boxShadow: selected ? '0 0 0 3px rgba(239,68,68,.12)' : 'none', transition: 'border-color .15s' }}>
                        <div style={{ background: '#0F2557', aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
                          {c.thumbnailUrl
                            ? <img src={c.thumbnailUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="40" height="40" viewBox="0 0 24 24" fill="rgba(255,255,255,.2)"><path d="M8 5v14l11-7z"/></svg></div>
                          }
                          {c.featured && <span style={{ position: 'absolute', top: 8, left: 8, background: '#C9A84C', color: '#fff', fontFamily: "'Montserrat',sans-serif", fontSize: '.6rem', fontWeight: 700, padding: '3px 8px' }}>{t(locale,'精選','FEATURED','精选')}</span>}
                        </div>
                        <div style={{ padding: '18px' }}>
                          <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.93rem', color: '#0F2557', lineHeight: 1.4, marginBottom: 8 }}>{name}</h3>
                          {desc && <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.8rem', color: '#64748B', lineHeight: 1.65, marginBottom: 14 }}>{desc.length > 90 ? desc.slice(0,90)+'…' : desc}</p>}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                            <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#EF4444' }}>HK${c.price.toLocaleString()}</span>
                            <button
                              onClick={() => toggle({ type: 'cpt', id: c.id, name, amount: c.price })}
                              style={{ background: selected ? '#EF4444' : '#0F2557', color: '#fff', padding: '8px 14px', fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.78rem', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'background .15s' }}
                            >
                              {selected ? t(locale,'✓ 已選','✓ Added','✓ 已选') : t(locale,'加入','Add','加入')}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
