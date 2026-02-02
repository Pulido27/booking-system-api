import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from 'pg';
import { env } from "../config/env.js"

const pool = new Pool({
    connectionString: env.DATABASE_URL!,
    max: 20,
    min: 0,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
}

export const prisma = 
    globalForPrisma.prisma ??
    new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['query','error','warn'] : ['error'],
  });

  if (env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }

  export default prisma;

