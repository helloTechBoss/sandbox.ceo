import { MetadataRoute } from 'next';
import { getPublishedArticles } from '@/lib/articles';

export const revalidate = 3600;

const BASE = 'https://www.sandbox.ceo';
const locales = ['zh-Hant', 'en', 'zh-Hans'] as const;
// lastModified = date the page's own content last changed. Update the date when
// you change a page; null = content comes from the database, so no date is given.
const pages: Record<string, string | null> = {
  '': '2026-10-28',
  '/about': '2026-10-28',
  '/mso': '2026-10-28',
  '/mso/new-application': '2026-10-28',
  '/mso/renewal': '2026-10-28',
  '/licensing': '2026-10-28',
  '/compliance': '2026-10-28',
  '/corporate': '2026-10-28',
  '/tech': '2026-10-28',
  '/insights': '2026-10-28',
  '/contact': '2026-10-28',
  '/quotation/corporate': '2026-10-28',
  '/packages': null,
  '/compliance/cpt-marketplace': null,
  '/privacy': '2026-06-29',
  '/terms': '2026-06-29',
};

function altLanguages(path: string) {
  return Object.fromEntries(
    locales.map(l => [l, `${BASE}${l === 'zh-Hant' ? '' : `/${l}`}${path}`])
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  const articles = await getPublishedArticles();
  const latestArticle = articles.reduce<Date | null>(
    (max, a) => (!max || a.updatedAt > max ? a.updatedAt : max),
    null,
  );

  for (const [page, date] of Object.entries(pages)) {
    let lastModified = date ? new Date(date) : undefined;
    if (lastModified && latestArticle && (page === '' || page === '/insights') && latestArticle > lastModified) {
      lastModified = latestArticle;
    }
    for (const locale of locales) {
      const prefix = locale === 'zh-Hant' ? '' : `/${locale}`;
      entries.push({
        url: `${BASE}${prefix}${page}`,
        ...(lastModified && { lastModified }),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : page === '/insights' ? 0.8 : page === '/privacy' || page === '/terms' ? 0.3 : 0.7,
        alternates: { languages: altLanguages(page) },
      });
    }
  }

  // Article pages
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
