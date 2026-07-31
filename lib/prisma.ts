import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  localPrisma: PrismaClient | undefined;
  cloudPrisma: PrismaClient | undefined;
};

// 1. Local MySQL Client Instance
export const localPrisma =
  globalForPrisma.localPrisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.LOCAL_DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

// 2. TiDB Cloud MySQL Client Instance
export const cloudPrisma =
  globalForPrisma.cloudPrisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.CLOUD_DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

// Development mode එකේදී Next.js Hot Reloading නිසා duplicate connections නොහැදීමට
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.localPrisma = localPrisma;
  globalForPrisma.cloudPrisma = cloudPrisma;
}