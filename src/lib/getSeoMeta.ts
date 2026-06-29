import { prisma } from '@/lib/prisma';

type Lk = 'tc' | 'en' | 'sc';

export async function getSeoMeta(
  slug: string,
  lk: Lk,
  defaults: { title: string; description: string; keywords?: string[] },
) {
  try {
    const seo = await prisma.seoMeta.findFirst({ where: { page: { slug } } });
    return {
      title: (seo?.title as Record<string, string> | null)?.[lk] || defaults.title,
      description: (seo?.description as Record<string, string> | null)?.[lk] || defaults.description,
      keywords: (seo?.keywords as string[] | null) || defaults.keywords || [],
    };
  } catch {
    return { title: defaults.title, description: defaults.description, keywords: defaults.keywords || [] };
  }
}
