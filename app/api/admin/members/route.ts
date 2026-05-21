import { NextResponse } from "next/server";

import { normalizeCommitteeEmail } from "@/lib/committee-access";
import { prisma } from "@/lib/prisma";
import { requireCommitteeAdmin } from "@/lib/require-committee";

type AdminMemberAccessStatus = "active" | "inactive" | "none";

export async function GET() {
  const r = await requireCommitteeAdmin();
  if (!r.ok) return r.response;

  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        company: true,
        position: true,
        email: true,
        whatsapp: true,
        department: true,
        municipality: true,
        linkedin: true,
        website: true,
        expertiseAreas: true,
        contributionTypes: true,
        professionalSummary: true,
        committeeContribution: true,
        committeeExpectation: true,
        consent: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const emails = [
      ...new Set(
        members.map((m) => normalizeCommitteeEmail(m.email)).filter((x): x is string => Boolean(x)),
      ),
    ];

    const allowedUsers =
      emails.length > 0
        ? await prisma.allowedUser.findMany({
            where: { email: { in: emails } },
            select: { id: true, email: true, isActive: true },
          })
        : [];

    const byEmail = new Map(allowedUsers.map((u) => [u.email.toLowerCase(), u]));

    const enriched = members.map((m) => {
      const norm = normalizeCommitteeEmail(m.email);
      const au = norm ? byEmail.get(norm) : undefined;
      let accessStatus: AdminMemberAccessStatus = "none";
      if (au) {
        accessStatus = au.isActive ? "active" : "inactive";
      }
      return {
        ...m,
        accessStatus,
        allowedUserId: au?.id ?? null,
      };
    });

    return NextResponse.json(
      { members: enriched },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "No se pudo cargar la lista." }, { status: 500 });
  }
}
