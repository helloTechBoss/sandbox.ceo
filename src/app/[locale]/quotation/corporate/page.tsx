import { prisma } from '@/lib/prisma';
import { getSeoMeta } from '@/lib/getSeoMeta';
import CorporateCalculator from '@/components/CorporateCalculator';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const dynamic = 'force-dynamic';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';
type LK = 'tc' | 'en' | 'sc';

function lkOf(locale: Locale): LK {
  return locale === 'en' ? 'en' : locale === 'zh-Hans' ? 'sc' : 'tc';
}

async function getSetting(key: string): Promise<string> {
  try {
    const row = await prisma.setting.findUnique({ where: { key } });
    return (row?.value as string) || '';
  } catch {
    return '';
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const lk = lkOf(locale);
  const seo = await getSeoMeta('quotation-corporate', lk, {
    title: lk === 'en'
      ? 'Corporate Services Fee Calculator — Sandbox Corporate Hong Kong'
      : lk === 'sc'
      ? '企业服务报价计算器 — Sandbox Corporate 香港'
      : '企業服務報價計算器 — Sandbox Corporate 香港',
    description: lk === 'en'
      ? 'Instant accounting, audit and tax fee estimate for Hong Kong companies. Company formation, company secretary, bookkeeping, audit and tax filing — transparent pricing.'
      : lk === 'sc'
      ? '香港公司会计、审计及税务费用即时估算。公司成立、公司秘书、记账、审计及报税，费用透明，一站式企业服务。'
      : '香港公司會計、審計及稅務費用即時估算。公司成立、公司秘書、簿記、審計及報稅，費用透明，一站式企業服務。',
  });
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default async function CorporateQuotationPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  const [waNumber, defaultWaMsg, dbServices] = await Promise.all([
    getSetting('whatsapp_number').then(v => v || '+85292318254'),
    getSetting('corporate_default_wa_message'),
    prisma.package.findMany({
      where: { group: { in: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] } },
      orderBy: [{ group: 'asc' }, { order: 'asc' }],
      select: {
        id: true,
        group: true,
        name: true,
        price: true,
        featured: true,
        ctaWhatsappMessage: true,
        order: true,
      },
    }).catch(() => []),
  ]);

  return (
    <>
      <SiteHeader locale={locale} waNumber={waNumber} />
      <CorporateCalculator
        locale={locale}
        waNumber={waNumber}
        dbServices={dbServices}
        defaultWaMsg={defaultWaMsg}
      />
      <SiteFooter locale={locale} waNumber={waNumber} />
    </>
  );
}
