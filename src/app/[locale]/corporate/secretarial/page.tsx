import { redirect } from 'next/navigation';

export default async function SecretarialPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/corporate?tab=comsec`);
}
