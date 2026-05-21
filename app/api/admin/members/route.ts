import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireCommitteeAdmin } from "@/lib/require-committee";

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
    return NextResponse.json(
      { members },
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
