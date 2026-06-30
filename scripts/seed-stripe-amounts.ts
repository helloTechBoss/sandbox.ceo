import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma';
import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// Extract HKD amount from price string. Returns null for 詢價 / monthly / ambiguous.
function parseAmount(price: string): number | null {
  // Skip enquiry-only
  if (price.includes('詢價') || price.includes('询价')) return null;
  // Extract first number sequence
  const m = price.match(/[\d,]+/);
  if (!m) return null;
  const num = parseInt(m[0].replace(/,/g, ''));
  return isNaN(num) ? null : num;
}

async function main() {
  const pkgs = await (prisma as any).package.findMany({
    where: { group: { in: ['A','B','C','D','E','F','G','H'] } },
  });

  console.log(`Found ${pkgs.length} A-H packages`);
  let updated = 0;

  for (const pkg of pkgs) {
    const amount = parseAmount(pkg.price);
    if (pkg.stripeAmount === amount) continue; // already correct
    await (prisma as any).package.update({
      where: { id: pkg.id },
      data: { stripeAmount: amount },
    });
    const name = (pkg.name as Record<string,string>).tc ?? pkg.id;
    console.log(`  ${name}: ${pkg.price} → stripeAmount=${amount}`);
    updated++;
  }

  console.log(`\nUpdated ${updated} packages.`);
}

main().catch(console.error).finally(() => pool.end());
