import type { Metadata } from 'next';
import RootDocument from '@/components/RootDocument';

export const metadata: Metadata = {
  title: '404 | Sandbox Group',
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <RootDocument lang="zh-Hant">
      <main style={{ maxWidth: 640, margin: '0 auto', padding: '96px 24px', textAlign: 'center' }}>
        <h1>404</h1>
        <p>找不到此頁面 · Page not found</p>
        <p><a href="/">返回主頁 · Back to home</a></p>
      </main>
    </RootDocument>
  );
}
