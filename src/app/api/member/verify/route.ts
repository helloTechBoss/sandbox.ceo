import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { memberId, code } = await req.json();
  if (!memberId || !code) {
    return NextResponse.json({ error: 'Missing memberId or code' }, { status: 400 });
  }

  const otp = await prisma.memberOtp.findFirst({
    where: {
      memberId,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
    include: { member: true },
  });

  if (!otp) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
  }

  // Mark OTP used + mark member verified
  await Promise.all([
    prisma.memberOtp.update({ where: { id: otp.id }, data: { used: true } }),
    prisma.member.update({ where: { id: memberId }, data: { emailVerified: true } }),
  ]);

  return NextResponse.json({
    ok: true,
    member: {
      id: otp.member.id,
      name: otp.member.name,
      email: otp.member.email,
      phone: otp.member.phone,
    },
  });
}
