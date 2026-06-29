import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { courseId, locale } = await req.json();

    const course = await prisma.cptCourse.findUnique({ where: { id: courseId } });
    if (!course || !course.published) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const name = (course.name as Record<string, string>);
    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.sandbox.ceo';
    const prefix = locale === 'zh-Hant' ? '' : `/${locale}`;
    const successUrl = `${baseUrl}${prefix}/compliance/cpt-marketplace/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}${prefix}/compliance/cpt-marketplace/${courseId}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'hkd',
            unit_amount: course.price * 100, // Stripe uses cents
            product_data: {
              name: name.tc || name.en || 'CPT Course',
              description: (course.description as Record<string, string>)?.tc || undefined,
              images: course.thumbnailUrl ? [course.thumbnailUrl] : [],
            },
          },
        },
      ],
      metadata: { courseId, locale },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
