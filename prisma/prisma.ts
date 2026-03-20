import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Create a singleton Prisma Client instance
const prismaClientSingleton = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaMariaDb(databaseUrl);
  return new PrismaClient({ adapter });
};

// Extend the globalThis object to include the Prisma Client instance
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// Use the existing Prisma Client instance if it exists, otherwise create a new one
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Export the Prisma Client instance for use in the application
export default prisma;

// Assign the Prisma Client instance to globalThis in development mode to prevent multiple instances
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
