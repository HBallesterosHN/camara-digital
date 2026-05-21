import { Prisma } from "@prisma/client";

const KNOWN_REQUEST_CODES = new Set(["P5010", "P1001", "P1002", "P1003", "P6001"]);

/**
 * Errores típicos cuando la base no está alcanzable o Accelerate no responde.
 */
export function isPrismaDbUnreachable(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError && KNOWN_REQUEST_CODES.has(error.code)) {
    return true;
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    const msg = error.message.toLowerCase();
    if (msg.includes("fetch failed") || msg.includes("network") || msg.includes("econnrefused")) {
      return true;
    }
  }
  return false;
}
