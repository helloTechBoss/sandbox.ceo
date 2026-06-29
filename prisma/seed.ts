import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import content from "../scripts/extracted-content.json";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const PAGES = [
  "home",
  "about",
  "mso",
  "licensing",
  "compliance",
  "corporate",
  "tech",
  "insights",
  "terms",
  "privacy",
  "contact",
];

const SEO_PLACEHOLDER = {
  title: { tc: "", en: "", sc: "" },
  description: { tc: "", en: "", sc: "" },
  keywords: { tc: "", en: "", sc: "" },
};

async function main() {
  // Upsert pages
  for (const slug of PAGES) {
    await prisma.page.upsert({
      where: { slug },
      create: { slug },
      update: {},
    });
  }

  // Upsert sections
  const pageMap = new Map<string, string>();
  const pages = await prisma.page.findMany();
  for (const p of pages) {
    pageMap.set(p.slug, p.id);
  }

  let order = 0;
  for (const s of content.sections) {
    if (!s.pageSlug) continue;
    const pageId = pageMap.get(s.pageSlug);
    if (!pageId) continue;

    await prisma.section.upsert({
      where: { pageId_key: { pageId, key: s.key } },
      create: {
        pageId,
        key: s.key,
        translations: { tc: s.tc, en: s.en, sc: s.sc },
        order: order++,
      },
      update: {
        translations: { tc: s.tc, en: s.en, sc: s.sc },
      },
    });
  }

  // Upsert settings
  const defaultSettings = [
    { key: "whatsapp_number", value: "+85292318254" },
    { key: "contact_email", value: "" },
    { key: "ga_id", value: "G-L0G2K4FMY2" },
  ];
  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      create: setting,
      update: {},
    });
  }

  // Upsert SeoMeta for each page
  for (const slug of PAGES) {
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page) continue;

    await prisma.seoMeta.upsert({
      where: { pageId: page.id },
      create: {
        pageId: page.id,
        ...SEO_PLACEHOLDER,
      },
      update: {},
    });
  }

  console.log(`Seeded ${PAGES.length} pages, ${order} sections, ${defaultSettings.length} settings, ${PAGES.length} SeoMeta records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
