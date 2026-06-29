import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#0F2557',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          position: 'relative',
        }}
      >
        {/* Red top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: '#EF4444', borderRadius: '4px 4px 0 0', display: 'flex',
        }} />
        <span style={{
          fontSize: 16,
          fontWeight: 900,
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
          letterSpacing: '-0.5px',
          lineHeight: 1,
        }}>
          SG
        </span>
      </div>
    ),
    { ...size }
  );
}
