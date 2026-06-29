import { redirect } from 'next/navigation';

export default async function AccountingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/corporate?tab=accounting`);
}
