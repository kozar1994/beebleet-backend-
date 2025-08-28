import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const plans = [
    {
      slug: 'basic',
      name: 'Basic Plan',
      pricePerMonth: 10,
      qrLimit: 5,
      description: 'Basic subscription plan',
    },
    {
      slug: 'pro',
      name: 'Pro Plan',
      pricePerMonth: 25,
      qrLimit: 20,
      description: 'Professional subscription plan',
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: { ...plan },
      create: { ...plan },
    });
  }

  console.log(`Seeded database with ${plans.length} plans`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
