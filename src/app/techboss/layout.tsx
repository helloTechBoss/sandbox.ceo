import type { Metadata } from 'next';
import RootDocument from '@/components/RootDocument';
import { siteMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = {
  ...siteMetadata,
  title: 'Tech Boss Education | 學習新科技，掌握新未來 | Learn the Future. Be the Future.',
  description: 'Tech Boss — AI創業支援、AI個人成長、AI內容變現。一個結合AI企業支援、AI個人成長與AI創意孵化的AI平台，專為創業者與創作者而設。',
};

export default function TechBossLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootDocument lang="zh-Hant">
      <div style={{ fontFamily: "'Noto Sans TC', 'Helvetica Neue', Arial, sans-serif", background: '#000', color: '#fff', minHeight: '100vh' }}>
        {children}
      </div>
    </RootDocument>
  );
}
