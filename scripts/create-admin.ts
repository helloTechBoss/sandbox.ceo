import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
config({ path: '.env.local' });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const passwordHash = await bcrypt.hash('Sandbox2026!', 12);
  const user = await (prisma as any).adminUser.upsert({
    where: { email: 'hello@techboss.app' },
    create: { email: 'hello@techboss.app', name: 'Admin', passwordHash, role: 'admin' },
    update: { passwordHash, role: 'admin' },
  });
  console.log('Admin user ready:', user.email);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
