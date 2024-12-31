import { PrismaClient } from "@prisma/client";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

declare global {
  var prismaGlobal: ReturnType<typeof createPrismaClient> | undefined;
}

export const db = globalThis.prismaGlobal || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}
