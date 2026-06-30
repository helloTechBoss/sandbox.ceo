import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  const { name, email, phone } = await req.json();
  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  const normalEmail = email.trim().toLowerCase();

  // Upsert member
  const member = await prisma.member.upsert({
    where: { email: normalEmail },
    update: { name: name.trim(), phone: phone?.trim() || null },
    create: { email: normalEmail, name: name.trim(), phone: phone?.trim() || null },
  });

  // Invalidate old OTPs
  await prisma.memberOtp.updateMany({
    where: { memberId: member.id, used: false },
    data: { used: true },
  });

  const code = genOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await prisma.memberOtp.create({
    data: { memberId: member.id, code, expiresAt },
  });

  await sendOtpEmail(normalEmail, member.name, code);

  return NextResponse.json({ ok: true, memberId: member.id });
}
