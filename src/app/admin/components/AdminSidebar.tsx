'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/leads', label: 'Leads', icon: '📋' },
  { href: '/admin/articles', label: 'Insights / Articles', icon: '📰' },
  { href: '/admin/packages', label: 'Packages & Plans', icon: '📦' },
  { href: '/admin/quotation', label: 'Corporate Quotation', icon: '🧮' },
  { href: '/admin/cpt', label: 'CPT Marketplace', icon: '🎓' },
  { href: '/admin/orders', label: 'Orders & CRM', icon: '📑' },
  { href: '/admin/faqs', label: 'FAQs', icon: '❓' },
  { href: '/admin/sections', label: 'Pages & Sections', icon: '📄' },
  { href: '/admin/team', label: 'Team Members', icon: '👥' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 240, flexShrink: 0, background: '#0F2557', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
        <Link href="/" target="_blank" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: '.05em' }}>
            SANDBOX <span style={{ color: '#EF4444' }}>GROUP</span>
          </div>
          <div style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.4)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 2 }}>
            Admin Panel
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {nav.map(item => {
          const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 20px', fontSize: '.875rem', fontWeight: 500,
                color: active ? '#fff' : 'rgba(255,255,255,.55)',
                background: active ? 'rgba(239,68,68,.2)' : 'transparent',
                borderLeft: active ? '3px solid #EF4444' : '3px solid transparent',
                textDecoration: 'none', transition: 'all .15s',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Signout */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          style={{
            width: '100%', background: 'rgba(255,255,255,.08)', border: 'none',
            color: 'rgba(255,255,255,.55)', padding: '10px 16px', fontSize: '.875rem',
            cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
