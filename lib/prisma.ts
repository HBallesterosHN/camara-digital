import { PrismaClient } from "@prisma/client";

import { getPrismaDatasourceOverrideUrl } from "@/lib/prisma-runtime-url";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const datasourceOverrideUrl = getPrismaDatasourceOverrideUrl();

if (
  process.env.NODE_ENV === "development" &&
  process.env.DATABASE_URL?.trim()?.startsWith("prisma+") &&
  !process.env.DATABASE_URL_DIRECT?.trim()
) {
  console.warn(
    "[camara-digital] DATABASE_URL usa Prisma Accelerate. Si ve el error P5010 en local, defina DATABASE_URL_DIRECT con una URL postgresql:// al mismo origen (véase README).",
  );
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    datasourceOverrideUrl ? { datasources: { db: { url: datasourceOverrideUrl } } } : undefined,
  );

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
