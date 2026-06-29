import { prisma } from '@/lib/prisma';
import { getSeoMeta } from '@/lib/getSeoMeta';

async function getSetting(key: string): Promise<string> {
  try {
    const row = await prisma.setting.findUnique({ where: { key } });
    return (row?.value as string) || '';
  } catch {
    return '';
  }
}
import CorporateCalculator from '@/components/CorporateCalculator';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const dynamic = 'force-dynamic';

type Locale = 'zh-Hant' | 'en' | 'zh-Hans';
type LK = 'tc' | 'en' | 'sc';

function lkOf(locale: Locale): LK {
  return locale === 'en' ? 'en' : locale === 'zh-Hans' ? 'sc' : 'tc';
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
  const waNumber = (await getSetting('whatsapp_number')) || '+85292318254';

  return (
    <>
      <SiteHeader locale={locale} waNumber={waNumber} />
      <CorporateCalculator locale={locale} waNumber={waNumber} />
      <SiteFooter locale={locale} waNumber={waNumber} />
    </>
  );
}
