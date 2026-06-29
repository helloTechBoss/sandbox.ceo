import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { stripeSessionId, fullName, email, phone, companyName, companyBrNo, hkidNo, notes, docs } = body;

    if (!stripeSessionId || !fullName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upsert the order record (webhook may have already created it)
    await prisma.serviceOrder.upsert({
      where: { stripeSessionId },
      create: { stripeSessionId, totalAmount: 0, status: 'onboarding_complete' },
      update: { status: 'onboarding_complete' },
    });

    const order = await prisma.serviceOrder.findUnique({ where: { stripeSessionId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    await prisma.clientOnboarding.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        fullName, email, phone: phone || null,
        companyName: companyName || null,
        companyBrNo: companyBrNo || null,
        hkidNo: hkidNo || null,
        notes: notes || null,
        docs: docs?.length
          ? { create: docs.map((d: { docType: string; label: string; url: string }) => ({ docType: d.docType, label: d.label, url: d.url })) }
          : undefined,
      },
      update: {
        fullName, email, phone: phone || null,
        companyName: companyName || null,
        companyBrNo: companyBrNo || null,
        hkidNo: hkidNo || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Onboarding submit error:', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
