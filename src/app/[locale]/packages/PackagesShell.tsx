'use client';
import { useState, useCallback, useEffect } from 'react';
import MemberModal, { MemberInfo } from './MemberModal';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';
type LK = 'tc' | 'en' | 'sc';

function lk(locale: Locale): LK { return locale === 'en' ? 'en' : locale === 'zh-Hans' ? 'sc' : 'tc'; }
function t(locale: Locale, tc: string, en: string, sc: string) { return locale === 'en' ? en : locale === 'zh-Hans' ? sc : tc; }

export interface PkgItem {
  id: string; group: string; tierLabel: string;
  name: { tc: string; en: string; sc: string };
  price: string; stripeAmount: number | null; featured: boolean;
  features: { label: { tc: string; en: string; sc: string }; enabled: boolean }[];
}

export interface CptItem {
  id: string; name: { tc: string; en: string; sc: string };
  price: number; description: { tc: string; en: string; sc: string };
  thumbnailUrl: string | null; featured: boolean;
}

interface CartEntry { type: 'package' | 'cpt'; id: string; name: string; amount: number }

const GROUP_LABELS: Record<string, { tc: string; en: string; sc: string; icon: string }> = {
  A: { tc: '公司成立', en: 'Company Formation',      sc: '公司成立',   icon: '🏢' },
  B: { tc: '公司秘書', en: 'Company Secretary',       sc: '公司秘书',   icon: '📋' },
  C: { tc: '會計',     en: 'Accounting',              sc: '会计',       icon: '📊' },
  D: { tc: '審計',     en: 'Audit',                   sc: '审计',       icon: '🔍' },
  E: { tc: '稅務',     en: 'Tax Advisory',            sc: '税务',       icon: '💰' },
  F: { tc: '商務中心', en: 'Business Centre',         sc: '商务中心',   icon: '🏙️' },
  G: { tc: '企業服務', en: 'Other Corp Services',     sc: '企业服务',   icon: '⚙️' },
  H: { tc: '簽證及移民', en: 'Visa & Immigration',   sc: '签证及移民', icon: '✈️' },
  mso:           { tc: 'MSO 牌照服務',    en: 'MSO Licensing',          sc: 'MSO 牌照服务',   icon: '🪪' },
  incorporation: { tc: '公司成立套餐',   en: 'Incorporation Packages',  sc: '公司成立套餐',  icon: '🏢' },
  comsec:        { tc: '公司秘書套餐',   en: 'Company Secretary',       sc: '公司秘书套餐',  icon: '📋' },
  accounting:    { tc: '會計及稅務',     en: 'Accounting & Tax',        sc: '会计及税务',    icon: '📊' },
  audit:         { tc: '審計',           en: 'Audit',                   sc: '审计',          icon: '🔍' },
  compliance:    { tc: '持續合規',       en: 'Compliance',              sc: '持续合规',      icon: '✅' },
  licensing:     { tc: '牌照服務',       en: 'Licensing',               sc: '牌照服务',      icon: '🪪' },
  tech:          { tc: '合規科技',       en: 'RegTech',                 sc: '合规科技',      icon: '💻' },
};

const TABS_DEF = [
  { key: 'services', tc: '企業服務', en: 'Corporate Services', sc: '企业服务' },
  { key: 'training', tc: 'CPT 培訓課程', en: 'CPT Training', sc: 'CPT 培训课程' },
];

export default function PackagesShell({ locale, waNumber, packageGroups, cptCourses }: {
  locale: Locale; waNumber: string;
  packageGroups: { group: string; items: PkgItem[] }[];
  cptCourses: CptItem[];
}) {
  const k = lk(locale);
  const [tab, setTab] = useState('services');
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [member, setMember] = useState<MemberInfo | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sbx_member');
      if (stored) setMember(JSON.parse(stored));
    } catch {}
  }, []);

  const inCart = useCallback((id: string) => cart.some(c => c.id === id), [cart]);
  const toggle = useCallback((entry: CartEntry) => {
    setCart(prev => prev.some(c => c.id === entry.id) ? prev.filter(c => c.id !== entry.id) : [...prev, entry]);
  }, []);
  const total = cart.reduce((s, c) => s + c.amount, 0);

  async function handleCheckout() {
    if (!cart.length) return;
    if (!member) { setShowMemberModal(true); return; }
    setLoading(true); setErr('');
    try {
      const res = await fetch('/api/stripe/service-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.map(c => ({ type: c.type, id: c.id })), locale, memberId: member.id }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Checkout failed'); }
      const { url } = await res.json();
      window.location.href = url;
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Checkout failed');
      setLoading(false);
    }
  }

  const waBase = `https://wa.me/${waNumber.replace(/\D/g, '')}`;

  return (
    <>
      {showMemberModal && (
        <MemberModal locale={locale} onVerified={m => { setMember(m); setShowMemberModal(false); }} onClose={() => setShowMemberModal(false)} />
      )}

      {/* ── STICKY TAB + MEMBER BAR ── */}
      <div style={{ position: 'sticky', top: 68, zIndex: 100, background: '#fff', borderBottom: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', flexShrink: 0 }}>
            {TABS_DEF.map(tb => {
              const label = k === 'en' ? tb.en : k === 'sc' ? tb.sc : tb.tc;
              const active = tab === tb.key;
              return (
                <button key={tb.key} onClick={() => setTab(tb.key)} style={{
                  padding: '14px 20px', background: 'none', border: 'none',
                  borderBottom: active ? '3px solid #EF4444' : '3px solid transparent',
                  fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.85rem',
                  fontWeight: active ? 700 : 500, color: active ? '#0F2557' : '#64748B',
                  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
                }}>
                  {label}
                </button>
              );
            })}
          </div>

          {/* Member + Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {member ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#F0FDF4', border: '1px solid #86EFAC' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
                <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.78rem', color: '#166534', fontWeight: 600 }}>{member.name}</span>
                <button onClick={() => { setMember(null); localStorage.removeItem('sbx_member'); }}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '.7rem', padding: 0 }}>
                  {t(locale, '登出', 'Sign out', '登出')}
                </button>
              </div>
            ) : (
              <button onClick={() => setShowMemberModal(true)} style={{
                padding: '7px 16px', background: 'none', border: '1.5px solid #0F2557',
                color: '#0F2557', fontFamily: "'Montserrat',sans-serif", fontSize: '.75rem', fontWeight: 700, cursor: 'pointer',
              }}>
                {t(locale, '登記 / 登入', 'Register / Sign In', '登记 / 登入')}
              </button>
            )}
            {cart.length > 0 && (
              <button onClick={() => setCartOpen(o => !o)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#EF4444', color: '#fff', padding: '8px 16px',
                fontFamily: "'Montserrat',sans-serif", fontSize: '.8rem', fontWeight: 700,
                border: 'none', cursor: 'pointer',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                {cart.length} {t(locale, '項', 'item(s)', '项')} · HK${total.toLocaleString()}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── CART PANEL ── */}
      {cartOpen && (
        <div style={{ position: 'fixed', bottom: 80, right: 24, zIndex: 9991, width: 360, background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>
          <div style={{ background: '#0F2557', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.62rem', letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 2 }}>SANDBOX MARKETPLACE</div>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.85rem', color: '#fff' }}>
                {t(locale, '已選服務', 'Selected Services', '已选服务')} ({cart.length})
              </span>
            </div>
            <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: '1.3rem', padding: 0 }}>×</button>
          </div>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <div style={{ padding: '32px 18px', textAlign: 'center', fontSize: '.83rem', color: '#94A3B8', fontFamily: "'Noto Sans TC',sans-serif" }}>
                {t(locale, '尚未選擇任何服務', 'No services selected', '尚未选择任何服务')}
              </div>
            ) : cart.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 18px', borderBottom: '1px solid #F1F5F9', gap: 8 }}>
                <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#334155', flex: 1, lineHeight: 1.4 }}>{c.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.82rem', fontWeight: 700, color: '#EF4444' }}>HK${c.amount.toLocaleString()}</span>
                  <button onClick={() => toggle(c)} style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', fontSize: '1rem', padding: 0 }}>×</button>
                </div>
              </div>
            ))}
          </div>
          {cart.length > 0 && (
            <div style={{ padding: '16px 18px', borderTop: '2px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.88rem', color: '#334155', fontWeight: 600 }}>{t(locale, '合計', 'Total', '合计')}</span>
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.15rem', color: '#0F2557' }}>HK${total.toLocaleString()}</span>
              </div>
              {!member && (
                <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', padding: '10px 12px', marginBottom: 12, fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.78rem', color: '#9A3412' }}>
                  {t(locale, '請先登記 / 登入會員才可付款', 'Please register or sign in to proceed', '请先登记 / 登入会员才可付款')}
                </div>
              )}
              {err && <p style={{ fontSize: '.75rem', color: '#EF4444', marginBottom: 8 }}>{err}</p>}
              <button onClick={handleCheckout} disabled={loading} style={{
                width: '100%', background: loading ? '#94A3B8' : '#EF4444', color: '#fff', padding: '13px',
                fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.88rem',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              }}>
                {loading ? t(locale, '處理中…', 'Processing…', '处理中…') : t(locale, '前往付款 →', 'Proceed to Payment →', '前往付款 →')}
              </button>
              <p style={{ fontSize: '.7rem', color: '#94A3B8', textAlign: 'center', marginTop: 8, fontFamily: "'Montserrat',sans-serif" }}>
                {t(locale, '由 Stripe 安全加密處理', 'Secured by Stripe', '由 Stripe 安全加密处理')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Floating cart FAB */}
      {cart.length > 0 && (
        <button onClick={() => setCartOpen(o => !o)} style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9990,
          background: '#EF4444', color: '#fff', border: 'none', borderRadius: '50%',
          width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(239,68,68,.4)',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span style={{ position: 'absolute', top: 6, right: 6, background: '#0F2557', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: '.62rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {cart.length}
          </span>
        </button>
      )}

      {/* ── CONTENT ── */}
      <div style={{ background: '#F8FAFC', padding: '56px 0 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

          {/* ── CORPORATE SERVICES ── */}
          {tab === 'services' && (
            <div>
              {packageGroups.map(({ group, items }) => {
                const meta = GROUP_LABELS[group];
                const label = meta ? (k === 'en' ? meta.en : k === 'sc' ? meta.sc : meta.tc) : group;
                const icon = meta?.icon ?? '📦';
                const purchasable = items.filter(i => i.stripeAmount !== null).length;

                return (
                  <div key={group} style={{ marginBottom: 52 }}>
                    {/* Section header — homepage style */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, background: '#0F2557', flexShrink: 0 }}>
                        <span style={{ fontSize: '1.3rem' }}>{icon}</span>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.62rem', fontWeight: 700, letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 2 }}>
                          SANDBOX CORPORATE
                        </div>
                        <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#0F2557', margin: 0 }}>
                          {label}
                        </h2>
                      </div>
                      <div style={{ flex: 1, height: 1, background: '#E2E8F0', marginLeft: 8 }} />
                      {purchasable > 0 && (
                        <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.68rem', fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>
                          {purchasable} {t(locale, '項可直接購買', 'purchasable', '项可直接购买')}
                        </span>
                      )}
                    </div>

                    {/* Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 2 }}>
                      {items.map(pkg => {
                        const name = pkg.name[k] || pkg.name.tc;
                        const canBuy = pkg.stripeAmount !== null;
                        const selected = inCart(pkg.id);
                        const waMsg = encodeURIComponent(t(locale, `Hi Sandbox Corporate，我想查詢：${name}（${pkg.price}）`, `Hi Sandbox, I'd like to enquire about: ${name} (${pkg.price})`, `Hi Sandbox，我想查询：${name}（${pkg.price}）`));

                        return (
                          <div key={pkg.id} style={{
                            background: selected ? '#FFF5F5' : '#fff',
                            border: `2px solid ${selected ? '#EF4444' : '#E2E8F0'}`,
                            position: 'relative', transition: 'all .15s',
                            boxShadow: selected ? '0 0 0 3px rgba(239,68,68,.1)' : 'none',
                          }}>
                            {/* Popular stripe */}
                            {pkg.featured && (
                              <div style={{ background: '#C9A84C', height: 3 }} />
                            )}
                            <div style={{ padding: '20px 22px' }}>
                              {pkg.featured && (
                                <span style={{ display: 'inline-block', fontFamily: "'Montserrat',sans-serif", fontSize: '.6rem', fontWeight: 700, letterSpacing: '.1em', color: '#92400E', background: '#FEF3C7', padding: '2px 8px', textTransform: 'uppercase', marginBottom: 8 }}>
                                  {t(locale, '熱門推介', 'POPULAR', '热门推介')}
                                </span>
                              )}
                              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 6 }}>
                                {pkg.tierLabel}
                              </div>
                              <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '.93rem', color: '#0F2557', lineHeight: 1.5, marginBottom: 14, minHeight: 44 }}>
                                {name}
                              </h3>

                              {pkg.features.length > 0 && (
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                                  {pkg.features.filter(f => f.enabled).slice(0, 3).map((f, i) => (
                                    <li key={i} style={{ display: 'flex', gap: 8, fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.76rem', color: '#64748B', lineHeight: 1.45 }}>
                                      <span style={{ color: '#C9A84C', fontWeight: 700, flexShrink: 0 }}>✓</span>
                                      {f.label[k] || f.label.tc}
                                    </li>
                                  ))}
                                </ul>
                              )}

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #F1F5F9', marginTop: 'auto' }}>
                                <div>
                                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.05rem', color: canBuy ? '#EF4444' : '#C9A84C' }}>
                                    {pkg.price}
                                  </div>
                                  {canBuy && (
                                    <div style={{ fontSize: '.67rem', color: '#94A3B8', fontFamily: "'Montserrat',sans-serif" }}>
                                      {t(locale, '線上支付', 'Pay online', '线上支付')} HK${pkg.stripeAmount?.toLocaleString()}
                                    </div>
                                  )}
                                </div>
                                {canBuy ? (
                                  <button
                                    onClick={() => toggle({ type: 'package', id: pkg.id, name, amount: pkg.stripeAmount! })}
                                    style={{
                                      background: selected ? '#EF4444' : '#0F2557', color: '#fff',
                                      padding: '9px 16px', fontFamily: "'Montserrat',sans-serif",
                                      fontSize: '.75rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                                      transition: 'background .15s', whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {selected ? t(locale, '✓ 已選', '✓ Added', '✓ 已选') : t(locale, '加入購物車', 'Add to Cart', '加入购物车')}
                                  </button>
                                ) : (
                                  <a href={`${waBase}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#25D366', color: '#fff', padding: '9px 14px', fontFamily: "'Montserrat',sans-serif", fontSize: '.75rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M11.999 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.86 1.428 5.492L2 22l4.641-1.395C8.26 21.468 10.093 22 12 22c5.523 0 10-4.483 10-10.003C22 6.484 17.523 2 12 2z"/></svg>
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

          {/* ── CPT TRAINING ── */}
          {tab === 'training' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                <div style={{ width: 32, height: 2, background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.7rem', fontWeight: 700, letterSpacing: '.15em', color: '#64748B', textTransform: 'uppercase' }}>
                  {t(locale, '持續專業培訓', 'Continuing Professional Training', '持续专业培训')}
                </span>
              </div>

              {cptCourses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 24px', background: '#fff', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎓</div>
                  <p style={{ fontFamily: "'Noto Sans TC',sans-serif", color: '#94A3B8', margin: 0 }}>
                    {t(locale, '課程即將推出', 'Courses coming soon', '课程即将推出')}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
                  {cptCourses.map(c => {
                    const name = c.name[k] || c.name.tc;
                    const desc = c.description[k] || '';
                    const selected = inCart(c.id);
                    return (
                      <div key={c.id} style={{
                        background: '#fff', border: `2px solid ${selected ? '#EF4444' : '#E2E8F0'}`,
                        boxShadow: selected ? '0 0 0 3px rgba(239,68,68,.1)' : '0 2px 12px rgba(0,0,0,.04)',
                        transition: 'all .15s', overflow: 'hidden',
                      }}>
                        {/* Thumbnail */}
                        <div style={{ background: '#0F2557', aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
                          {c.thumbnailUrl
                            ? <img src={c.thumbnailUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0F2557,#1a3a7c)' }}>
                                <svg width="44" height="44" viewBox="0 0 24 24" fill="rgba(255,255,255,.15)"><path d="M8 5v14l11-7z"/></svg>
                              </div>
                            )
                          }
                          {c.featured && (
                            <span style={{ position: 'absolute', top: 12, left: 12, background: '#C9A84C', color: '#fff', fontFamily: "'Montserrat',sans-serif", fontSize: '.6rem', fontWeight: 700, padding: '4px 10px', letterSpacing: '.08em' }}>
                              {t(locale, '精選', 'FEATURED', '精选')}
                            </span>
                          )}
                        </div>
                        <div style={{ padding: '22px 24px' }}>
                          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 8 }}>
                            CPT · SANDBOX COMPLIANCE
                          </div>
                          <h3 style={{ fontFamily: "'Noto Sans TC',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#0F2557', lineHeight: 1.4, marginBottom: 10 }}>{name}</h3>
                          {desc && (
                            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.82rem', color: '#64748B', lineHeight: 1.7, marginBottom: 18, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {desc}
                            </p>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
                            <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.15rem', color: '#EF4444' }}>
                              HK${c.price.toLocaleString()}
                            </span>
                            <button
                              onClick={() => toggle({ type: 'cpt', id: c.id, name, amount: c.price })}
                              style={{
                                background: selected ? '#EF4444' : '#0F2557', color: '#fff',
                                padding: '9px 18px', fontFamily: "'Montserrat',sans-serif",
                                fontSize: '.78rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                                transition: 'background .15s',
                              }}
                            >
                              {selected ? t(locale, '✓ 已選', '✓ Added', '✓ 已选') : t(locale, '加入購物車', 'Add to Cart', '加入购物车')}
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
