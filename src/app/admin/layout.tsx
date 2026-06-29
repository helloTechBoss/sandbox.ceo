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
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'Inter',system-ui,sans-serif", background: '#F8FAFC' }}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800&display=swap" rel="stylesheet" />
        {children}
      </body>
    </html>
  );
}
