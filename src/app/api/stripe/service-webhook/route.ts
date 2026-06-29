import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const rawMeta = session.metadata?.itemMeta;
    if (!rawMeta) return NextResponse.json({ ok: true });

    const itemMeta: { type: string; id: string; name: Record<string, string>; amount: number }[] = JSON.parse(rawMeta);
    const total = itemMeta.reduce((sum, i) => sum + i.amount, 0);

    await prisma.serviceOrder.upsert({
      where: { stripeSessionId: session.id },
      create: {
        stripeSessionId: session.id,
        totalAmount: total,
        status: 'pending_onboarding',
        items: {
          create: itemMeta.map(i => ({
            itemType: i.type,
            itemId: i.id,
            name: i.name,
            amount: i.amount,
          })),
        },
      },
      update: {},
    });
  }

  return NextResponse.json({ ok: true });
}
