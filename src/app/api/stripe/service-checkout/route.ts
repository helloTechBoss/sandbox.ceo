import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

interface CartItem {
  type: 'package' | 'cpt';
  id: string;
}

export async function POST(req: NextRequest) {
  try {
    const { items, locale }: { items: CartItem[]; locale: string } = await req.json();
    if (!items?.length) return NextResponse.json({ error: 'Empty cart' }, { status: 400 });

    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.sandbox.ceo';
    const prefix = locale === 'zh-Hant' ? '' : `/${locale}`;

    // Resolve items from DB
    const pkgIds = items.filter(i => i.type === 'package').map(i => i.id);
    const cptIds = items.filter(i => i.type === 'cpt').map(i => i.id);

    const [packages, courses] = await Promise.all([
      pkgIds.length > 0
        ? prisma.package.findMany({ where: { id: { in: pkgIds }, stripeAmount: { not: null } } })
        : Promise.resolve([]),
      cptIds.length > 0
        ? prisma.cptCourse.findMany({ where: { id: { in: cptIds }, published: true } })
        : Promise.resolve([]),
    ]);

    const lineItems: {
      quantity: number;
      price_data: { currency: string; unit_amount: number; product_data: { name: string; description?: string } };
    }[] = [];

    const itemMeta: { type: string; id: string; name: Record<string, string>; amount: number }[] = [];

    for (const pkg of packages) {
      const amount = pkg.stripeAmount!;
      const name = pkg.name as Record<string, string>;
      lineItems.push({ quantity: 1, price_data: { currency: 'hkd', unit_amount: amount * 100, product_data: { name: name.tc || name.en, description: pkg.tierLabel || undefined } } });
      itemMeta.push({ type: 'package', id: pkg.id, name, amount });
    }

    for (const cpt of courses) {
      const name = cpt.name as Record<string, string>;
      lineItems.push({ quantity: 1, price_data: { currency: 'hkd', unit_amount: cpt.price * 100, product_data: { name: name.tc || name.en } } });
      itemMeta.push({ type: 'cpt', id: cpt.id, name, amount: cpt.price });
    }

    if (!lineItems.length) return NextResponse.json({ error: 'No purchasable items' }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      metadata: { itemMeta: JSON.stringify(itemMeta), locale },
      success_url: `${baseUrl}${prefix}/packages/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${prefix}/packages`,
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Service checkout error:', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
