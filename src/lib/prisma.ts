import { PrismaClient } from "@prisma/client";

const createPrismaClient = () => new PrismaClient();

declare global {
  var prismaGlobal: ReturnType<typeof createPrismaClient> | undefined;
}

export const db = globalThis.prismaGlobal || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}
