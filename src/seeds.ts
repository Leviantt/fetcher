import { PrismaClient } from '@prisma/client';
import { PROXIES_AMOUNT } from './constants';

const prisma = new PrismaClient();

async function loadTestData(): Promise<void> {
  await prisma.proxy.createMany({
    data: Array.from({ length: PROXIES_AMOUNT }, (_, i) => ({
      ip: `proxy${i + 1}.example.com`,
      port: 8080,
      password: `password${i + 1}`,
      login: `login${i + 1}`,
    })),
  });

  console.log('Test data loaded successfully.');
}

loadTestData()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
