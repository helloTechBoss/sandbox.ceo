import { MetadataRoute } from 'next';

const BASE = 'https://www.sandbox.ceo';
const locales = ['zh-Hant', 'en', 'zh-Hans'] as const;
const pages = ['', '/about', '/mso', '/licensing', '/compliance', '/corporate', '/tech', '/insights', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const page of pages) {
    for (const locale of locales) {
      const prefix = locale === 'zh-Hant' ? '' : `/${locale}`;
      entries.push({
        url: `${BASE}${prefix}${page}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, `${BASE}${l === 'zh-Hant' ? '' : `/${l}`}${page}`])
          ),
        },
      });
    }
  }
  return entries;
}
