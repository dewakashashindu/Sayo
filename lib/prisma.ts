import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  localPrisma: PrismaClient | undefined;
  cloudPrisma: PrismaClient | undefined;
};


const cloudUrl =
  process.env.CLOUD_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "";


const localUrl =
  process.env.LOCAL_DATABASE_URL ||
  cloudUrl;

// 1. Local MySQL Client Instance
export const localPrisma =
  globalForPrisma.localPrisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: localUrl,
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
        url: cloudUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.localPrisma = localPrisma;
  globalForPrisma.cloudPrisma = cloudPrisma;
}