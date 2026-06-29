import Link from 'next/link';

interface Props {
  locale?: string;
  waNumber?: string;
}

export default function SiteFooter({ locale = 'zh-Hant', waNumber = '+85292318254' }: Props) {
  const isEn = locale === 'en';
  const isSc = locale === 'zh-Hans';
  const waHref = `https://wa.me/${waNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi，我想查詢合規及牌照服務')}`;

  return (
    <footer style={{ background: '#091A3E', color: '#fff', paddingTop: 60 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#fff', letterSpacing: '.05em', marginBottom: 12 }}>
              SANDBOX<span style={{ color: '#EF4444' }}>.</span>CEO
            </div>
            <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.84rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.85, marginBottom: 20 }}>
              {isEn ? 'Making compliance & growth simpler.' : isSc ? '让合规与增长更简单。' : '讓合規與增長更簡單。'}
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#EF4444', color: '#fff', padding: '10px 18px',
                fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.84rem',
                fontWeight: 700, textDecoration: 'none', transition: 'background .2s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.72rem', letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 20 }}>
              {isEn ? 'Core Services' : isSc ? '核心服务' : '核心服務'}
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { href: '/mso', label: isEn ? 'MSO Licensing' : 'MSO 牌照' },
                { href: '/licensing', label: isEn ? 'SFC Licensing' : 'SFC 牌照' },
                { href: '/compliance', label: isEn ? 'AML Compliance' : isSc ? 'AML 合规' : 'AML 合規' },
                { href: '/corporate', label: isEn ? 'Corporate Services' : isSc ? '企业服务' : '企業服務' },
                { href: '/tech', label: 'RegTech' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: 'rgba(255,255,255,.55)', textDecoration: 'none', transition: 'color .2s' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.72rem', letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 20 }}>
              {isEn ? 'Quick Links' : isSc ? '快速链接' : '快速連結'}
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { href: '/about', label: isEn ? 'About Us' : isSc ? '关于我们' : '關於我們' },
                { href: '/insights', label: isEn ? 'Insights' : isSc ? '行业洞察' : '行業洞察' },
                { href: '/contact', label: isEn ? 'Contact' : isSc ? '联络我们' : '聯絡我們' },
                { href: '/terms', label: isEn ? 'Terms of Service' : isSc ? '服务条款' : '服務條款' },
                { href: '/privacy', label: isEn ? 'Privacy Policy' : isSc ? '隐私政策' : '私隱政策' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: 'rgba(255,255,255,.55)', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '.72rem', letterSpacing: '.15em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: 20 }}>
              {isEn ? 'Contact' : isSc ? '联络' : '聯絡'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.6 }}>
                <div style={{ color: 'rgba(255,255,255,.8)', fontWeight: 500, marginBottom: 2 }}>
                  {isEn ? 'Hong Kong Office' : isSc ? '香港办公室' : '香港辦公室'}
                </div>
                {isEn ? 'Kowloon Bay, Hong Kong' : isSc ? '香港九龙湾' : '香港九龍灣'}
              </div>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: 'rgba(255,255,255,.55)' }}>
                <div style={{ color: 'rgba(255,255,255,.8)', fontWeight: 500, marginBottom: 2 }}>WhatsApp</div>
                <a href={waHref} target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C', textDecoration: 'none' }}>
                  {waNumber}
                </a>
              </div>
              <div style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.83rem', color: 'rgba(255,255,255,.55)' }}>
                <div style={{ color: 'rgba(255,255,255,.8)', fontWeight: 500, marginBottom: 2 }}>
                  {isEn ? 'Office Hours' : isSc ? '办公时间' : '辦公時間'}
                </div>
                {isEn ? 'Mon–Fri: 09:00 – 18:00' : isSc ? '周一至周五：09:00 – 18:00' : '週一至週五：09:00 – 18:00'}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontFamily: "'Noto Sans TC',sans-serif", fontSize: '.78rem', color: 'rgba(255,255,255,.35)' }}>
            © {new Date().getFullYear()} Sandbox Group / Tech Boss Limited. {isEn ? 'All rights reserved.' : isSc ? '版权所有。' : '版權所有。'}
          </p>
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: '.72rem', color: 'rgba(255,255,255,.25)', letterSpacing: '.05em' }}>
            SANDBOX.CEO
          </p>
        </div>
      </div>
    </footer>
  );
}
