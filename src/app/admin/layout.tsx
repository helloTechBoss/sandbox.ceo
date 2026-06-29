import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from './components/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const pathname = '';

  if (!session?.user) {
    // Login page is excluded via nested route — don't redirect from it
  }

  return (
    <div style={{ margin: 0, fontFamily: "'Inter',system-ui,sans-serif", background: '#F8FAFC', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
