import { prisma } from '@/lib/prisma';
import codeArticles from '@/content/insights-articles.json';

type Tri = Record<string, string>;

export type SiteArticle = {
  id: string;
  slug: string;
  category: Tri;
  categoryColor: string | null;
  title: Tri;
  excerpt: Tri;
  body: Tri | null;
  ctaLabel: Tri;
  ctaWhatsappMessage: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  order: number;
};

// Articles maintained in code (src/content/insights-articles.json). A database
// article with the same slug, created in /admin, takes precedence.
const CODE_ARTICLES: SiteArticle[] = codeArticles.map(a => ({
  id: `code-${a.slug}`,
  slug: a.slug,
  category: a.category,
  categoryColor: a.categoryColor,
  title: a.title,
  excerpt: a.excerpt,
  body: a.body,
  ctaLabel: a.ctaLabel,
  ctaWhatsappMessage: a.ctaWhatsappMessage,
  publishedAt: new Date(`${a.publishedAt}T09:00:00+08:00`),
  updatedAt: new Date('2026-10-28T09:00:00+08:00'),
  order: 0,
}));

// Corrects a known factual error in a legacy database article: Hong Kong Customs is
// the Customs and Excise Department (C&ED), not "關稅及邊境保護局 (CSTB)".
const CORRECTIONS: [RegExp, string][] = [
  [/(香港海關|香港海关)\s*[（(]\s*CSTB\s*[)）]/g, '$1 (C&ED)'],
  [/關稅及邊境保護局\s*[（(]\s*CSTB\s*[)）]/g, '香港海關 (C&ED)'],
  [/关税及边境保护局\s*[（(]\s*CSTB\s*[)）]/g, '香港海关 (C&ED)'],
  [/關稅及邊境保護局/g, '香港海關'],
  [/关税及边境保护局/g, '香港海关'],
  [/Customs\s+and\s+Border\s+Protection\s+(Bureau|Agency)/gi, 'Customs and Excise Department'],
  [/\bCSTB\b/g, 'C&ED'],
];

function correct(text: string): string {
  return CORRECTIONS.reduce((s, [re, to]) => s.replace(re, to), text);
}

function correctTri(t: unknown): Tri {
  const src = (t ?? {}) as Tri;
  return Object.fromEntries(Object.entries(src).map(([k, v]) => [k, typeof v === 'string' ? correct(v) : v]));
}

type DbArticle = Awaited<ReturnType<typeof prisma.article.findMany>>[number];

function fromDb(a: DbArticle): SiteArticle {
  return {
    id: a.id,
    slug: a.slug,
    category: correctTri(a.category),
    categoryColor: a.categoryColor,
    title: correctTri(a.title),
    excerpt: correctTri(a.excerpt),
    body: a.body ? correctTri(a.body) : null,
    ctaLabel: correctTri(a.ctaLabel),
    ctaWhatsappMessage: a.ctaWhatsappMessage,
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt,
    order: a.order,
  };
}

function byOrderThenDate(a: SiteArticle, b: SiteArticle) {
  if (a.order !== b.order) return a.order - b.order;
  return (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0);
}

export async function getPublishedArticles(take?: number): Promise<SiteArticle[]> {
  const db = await prisma.article.findMany({ where: { published: true } }).catch(() => []);
  const dbSlugs = new Set(db.map(a => a.slug));
  const all = [...db.map(fromDb), ...CODE_ARTICLES.filter(a => !dbSlugs.has(a.slug))].sort(byOrderThenDate);
  return take ? all.slice(0, take) : all;
}

export async function getArticleBySlug(slug: string): Promise<SiteArticle | null> {
  const db = await prisma.article.findUnique({ where: { slug } }).catch(() => null);
  if (db) return db.published ? fromDb(db) : null;
  return CODE_ARTICLES.find(a => a.slug === slug) ?? null;
}
