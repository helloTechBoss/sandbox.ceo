import { ImageResponse } from 'next/og';

export const alt = 'Sandbox Group — 香港企業合規與牌照申請專家';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#091A3E',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Red top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: '#EF4444', display: 'flex' }} />

        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(15,37,87,0.9) 0%, transparent 65%)',
          display: 'flex',
        }} />

        {/* Gold left accent bar */}
        <div style={{ position: 'absolute', left: 72, top: 180, width: 4, height: 270, background: '#C9A84C', display: 'flex' }} />

        {/* Content */}
        <div style={{ paddingLeft: 108, paddingRight: 80, display: 'flex', flexDirection: 'column' }}>

          {/* Gold eyebrow line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <div style={{ width: 40, height: 2, background: '#C9A84C', display: 'flex' }} />
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.2em', color: '#C9A84C', textTransform: 'uppercase' }}>
              Hong Kong · Compliance &amp; Licensing Specialists
            </span>
          </div>

          {/* Logo wordmark */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
            <span style={{ fontSize: 88, fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.04em', lineHeight: 1 }}>
              SANDBOX
            </span>
            <span style={{ fontSize: 88, fontWeight: 900, color: '#EF4444', letterSpacing: '0.04em', lineHeight: 1 }}>
              GROUP
            </span>
          </div>

          {/* Chinese tagline */}
          <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.75)', marginBottom: 12, fontWeight: 400 }}>
            您的合規與業務增長夥伴
          </div>

          {/* Service pills */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            {['MSO 牌照', 'SFC 牌照', 'AML 合規', '企業服務', 'RegTech'].map(s => (
              <div key={s} style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(201,168,76,0.4)',
                color: '#E8D28A',
                fontSize: 18,
                fontWeight: 600,
                padding: '8px 20px',
                display: 'flex',
              }}>
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom accent */}
        <div style={{ position: 'absolute', bottom: 48, left: 108, width: 280, height: 3, background: '#EF4444', display: 'flex' }} />

        {/* Domain watermark */}
        <div style={{
          position: 'absolute', bottom: 44, right: 80,
          fontSize: 16, color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.08em', fontWeight: 600, display: 'flex',
        }}>
          www.sandbox.ceo
        </div>
      </div>
    ),
    { ...size }
  );
}
