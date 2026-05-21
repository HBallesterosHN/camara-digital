import { prisma } from "@/lib/prisma";

/** Normaliza correo para coincidir con filas únicas en AllowedUser. */
export function normalizeCommitteeEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const n = email.trim().toLowerCase();
  return n.length > 0 ? n : null;
}

export async function findActiveAllowedUser(email: string | null | undefined) {
  const norm = normalizeCommitteeEmail(email);
  if (!norm) return null;
  const row = await prisma.allowedUser.findUnique({ where: { email: norm } });
  if (!row?.isActive) return null;
  return row;
}

export async function findAllowedUserRecord(email: string | null | undefined) {
  const norm = normalizeCommitteeEmail(email);
  if (!norm) return null;
  return prisma.allowedUser.findUnique({ where: { email: norm } });
}
