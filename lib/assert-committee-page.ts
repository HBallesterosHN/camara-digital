import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { findActiveAllowedUser, normalizeCommitteeEmail } from "@/lib/committee-access";
import type { AllowedUser } from "@prisma/client";
import type { Session } from "next-auth";

export type CommitteePageContext = { session: Session; allowedUser: AllowedUser };

export async function assertActiveCommitteeMember(callbackUrl: string): Promise<CommitteePageContext> {
  const session = await auth();
  const email = normalizeCommitteeEmail(session?.user?.email ?? null);
  if (!email || !session) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  const allowedUser = await findActiveAllowedUser(email);
  if (!allowedUser) {
    redirect("/unauthorized");
  }
  return { session, allowedUser };
}

export async function assertActiveCommitteeAdmin(callbackUrl: string): Promise<CommitteePageContext> {
  const ctx = await assertActiveCommitteeMember(callbackUrl);
  if (ctx.allowedUser.role !== "admin") {
    redirect("/unauthorized");
  }
  return ctx;
}
