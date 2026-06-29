import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  serviceInterest: z.string().max(200).optional(),
  message: z.string().max(2000).optional(),
  sourcePage: z.string().max(100).optional(),
  sourceLocale: z.enum(['tc', 'en', 'sc']).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        serviceInterest: data.serviceInterest || null,
        message: data.message || null,
        sourcePage: data.sourcePage || null,
        sourceLocale: data.sourceLocale || null,
      },
    });
    return NextResponse.json({ id: lead.id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    console.error('Lead creation error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
