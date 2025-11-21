import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    console.log('Cleaning database before migration...');
    
    // Delete all generations (since we're adding a required userId field)
    const deletedGenerations = await prisma.generation.deleteMany({});
    console.log(`✓ Deleted ${deletedGenerations.count} generation(s)`);
    
    console.log('\n✅ Database cleaned successfully!');
    console.log('You can now run: npx prisma migrate dev --name add_user_authentication');
    
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
