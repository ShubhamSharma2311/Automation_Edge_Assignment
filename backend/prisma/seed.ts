import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Languages to seed
  const languages = [
    { name: 'Python', slug: 'python' },
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'Java', slug: 'java' },
    { name: 'C++', slug: 'cpp' },
    { name: 'C#', slug: 'csharp' },
    { name: 'Go', slug: 'go' },
    { name: 'Rust', slug: 'rust' },
  ];

  // Use upsert to avoid duplicates
  for (const language of languages) {
    await prisma.language.upsert({
      where: { slug: language.slug },
      update: {},
      create: language,
    });
    console.log(`✓ Created/Updated language: ${language.name}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
