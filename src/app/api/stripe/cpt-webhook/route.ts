import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_CPT_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature error:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const courseId = session.metadata?.courseId;
    if (!courseId) return NextResponse.json({ ok: true });

    await prisma.cptPurchase.upsert({
      where: { stripeSessionId: session.id },
      create: {
        stripeSessionId: session.id,
        courseId,
        email: session.customer_details?.email || '',
        name: session.customer_details?.name || null,
        amountPaid: (session.amount_total ?? 0) / 100,
      },
      update: {},
    });
  }

  return NextResponse.json({ ok: true });
}
