import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Basic Plan
  await prisma.plan.create({
    data: {
      slug: 'basic',
      name: 'Basic Plan',
      pricePerMonth: 10,
      qrLimit: 5,
      description: 'Basic subscription plan',
    },
  });

  // Create Pro Plan
  await prisma.plan.create({
    data: {
      slug: 'pro',
      name: 'Pro Plan',
      pricePerMonth: 25,
      qrLimit: 20,
      description: 'Professional subscription plan',
    },
  });

  console.log('Seeded database with 2 plans');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
