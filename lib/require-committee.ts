import type { AllowedUser } from "@prisma/client";
import type { Session } from "next-auth";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { findActiveAllowedUser, normalizeCommitteeEmail } from "@/lib/committee-access";

type ErrorResult = { ok: false; response: NextResponse };
type MemberOk = { ok: true; session: Session; allowedUser: AllowedUser };

export async function requireCommitteeMember(): Promise<MemberOk | ErrorResult> {
  const session = await auth();
  const email = normalizeCommitteeEmail(session?.user?.email ?? null);
  if (!email || !session) {
    return { ok: false, response: NextResponse.json({ error: "No autenticado" }, { status: 401 }) };
  }
  const allowedUser = await findActiveAllowedUser(email);
  if (!allowedUser) {
    return { ok: false, response: NextResponse.json({ error: "No autorizado" }, { status: 403 }) };
  }
  return { ok: true, session, allowedUser };
}

export async function requireCommitteeAdmin(): Promise<MemberOk | ErrorResult> {
  const r = await requireCommitteeMember();
  if (!r.ok) return r;
  if (r.allowedUser.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Se requiere rol de administrador" }, { status: 403 }),
    };
  }
  return r;
}
