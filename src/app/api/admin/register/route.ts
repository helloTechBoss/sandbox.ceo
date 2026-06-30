import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, email, password } = await req.json();
  if (!name || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: 'Password too short' }, { status: 400 });

  const normalEmail = (email as string).toLowerCase().trim();
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await (prisma as any).adminUser.upsert({
      where: { email: normalEmail },
      create: { email: normalEmail, name, passwordHash, role: 'admin' },
      update: { name, passwordHash },
    });
    return NextResponse.json({ ok: true, email: user.email });
  } catch {
    return NextResponse.json({ error: 'Email already exists or DB error' }, { status: 409 });
  }
}
