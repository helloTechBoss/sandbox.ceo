import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma';
import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const existing = await (prisma as any).cptCourse.findFirst({
    where: { featured: true, published: true },
  });
  if (existing) { console.log('Course already exists:', existing.id); return; }

  const course = await (prisma as any).cptCourse.create({
    data: {
      name: {
        tc: 'AML 合規培訓 — 基礎模組',
        en: 'AML Compliance Training — Module 1',
        sc: 'AML 合规培训 — 基础模组',
      },
      description: {
        tc: '本課程涵蓋反洗錢（AML）基礎知識，包括洗錢定義、KYC 盡職調查要求、可疑交易匯報義務及香港 HKMA / SFC 合規標準。適合 MSO、財務機構、合規人員及企業管理人員。',
        en: 'This module covers AML fundamentals including money laundering definitions, KYC due diligence, suspicious transaction reporting, and HKMA / SFC compliance standards. Ideal for MSOs, financial institutions and compliance officers.',
        sc: '本课程涵盖反洗钱（AML）基础知识，包括洗钱定义、KYC 尽职调查要求、可疑交易汇报义务及香港 HKMA / SFC 合规标准。',
      },
      price: 980,
      videoUrl: 'https://whe51ihljalous35.public.blob.vercel-storage.com/aml_training_sample.mp4',
      published: true,
      featured: true,
      order: 1,
    },
  });
  console.log('Created:', course.id);
}

main().catch(console.error).finally(() => pool.end());
