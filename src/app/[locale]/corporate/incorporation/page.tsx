import { redirect } from 'next/navigation';

export default async function IncorporationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/corporate?tab=incorporation`);
}
