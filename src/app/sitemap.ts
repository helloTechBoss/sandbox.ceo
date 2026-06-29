import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE = 'https://www.sandbox.ceo';
const locales = ['zh-Hant', 'en', 'zh-Hans'] as const;
const pages = [
  '',
  '/about',
  '/mso',
  '/mso/new-application',
  '/mso/renewal',
  '/licensing',
  '/compliance',
  '/corporate',
  '/tech',
  '/insights',
  '/contact',
  '/quotation/corporate',
];

function altLanguages(path: string) {
  return Object.fromEntries(
    locales.map(l => [l, `${BASE}${l === 'zh-Hant' ? '' : `/${l}`}${path}`])
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      const prefix = locale === 'zh-Hant' ? '' : `/${locale}`;
      entries.push({
        url: `${BASE}${prefix}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : page === '/insights' ? 0.8 : 0.7,
        alternates: { languages: altLanguages(page) },
      });
    }
  }

  // Article pages
  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  }).catch(() => []);

  for (const art of articles) {
    for (const locale of locales) {
      const prefix = locale === 'zh-Hant' ? '' : `/${locale}`;
      entries.push({
        url: `${BASE}${prefix}/insights/${art.slug}`,
        lastModified: art.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages: altLanguages(`/insights/${art.slug}`) },
      });
    }
  }

  return entries;
}
