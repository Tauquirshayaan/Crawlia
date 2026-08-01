import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * Prisma singleton — prevents connection pool exhaustion in development (hot-reload)
 * and serverless environments (cold starts).
 *
 * Pattern: store on the `global` object in dev so the module cache is bypassed
 * while still sharing the same client across all requests. In production,
 * module-level instantiation is fine because the process doesn't restart.
 */

const globalForPrisma = globalThis as unknown as {
  _prismaPool: Pool | undefined;
  _prismaClient: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/crawlia';

  const pool =
    globalForPrisma._prismaPool ??
    new Pool({
      connectionString,
      max: 10,             // cap concurrent connections
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });

  globalForPrisma._prismaPool = pool;

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma._prismaClient ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma._prismaClient = prisma;
}
