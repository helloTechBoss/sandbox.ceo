import { prisma } from '@/lib/prisma';

type Lk = 'tc' | 'en' | 'sc';

export async function getSeoMeta(
  slug: string,
  lk: Lk,
  defaults: { title: string; description: string; keywords?: string[] },
) {
  try {
    const seo = await prisma.seoMeta.findFirst({ where: { page: { slug } } });
    const storedDescription = (seo?.description as Record<string, string> | null)?.[lk];
    const hasUnsupportedMsoClaim = slug.startsWith('mso') && /Customs[- ]approved|fast approval|海[關关][認认]可|快速[審审]批|CSTB/i.test(storedDescription || '');
    return {
      title: (seo?.title as Record<string, string> | null)?.[lk] || defaults.title,
      description: hasUnsupportedMsoClaim ? defaults.description : storedDescription || defaults.description,
      keywords: (seo?.keywords as string[] | null) || defaults.keywords || [],
    };
  } catch {
    return { title: defaults.title, description: defaults.description, keywords: defaults.keywords || [] };
  }
}
