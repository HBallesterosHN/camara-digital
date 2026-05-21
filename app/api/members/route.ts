import { NextResponse } from "next/server";

import { validateCreateMemberBody } from "@/lib/api-validation";
import { normalizeCommitteeEmail } from "@/lib/committee-access";
import { prisma } from "@/lib/prisma";
import { toPublicMember } from "@/lib/member-mapper";
import { requireCommitteeMember } from "@/lib/require-committee";

export async function GET() {
  const r = await requireCommitteeMember();
  if (!r.ok) return r.response;

  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(
      { members: members.map(toPublicMember) },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "No se pudo cargar el directorio." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const r = await requireCommitteeMember();
  if (!r.ok) return r.response;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = validateCreateMemberBody(json);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const d = parsed.data;
  const emailKey = normalizeCommitteeEmail(d.email);
  if (!emailKey) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  }

  const existing = await prisma.member.findUnique({ where: { email: emailKey } });
  if (existing) {
    return NextResponse.json(
      {
        error:
          "Ya existe un perfil con este correo. Si es su cuenta, actualícelo desde Mi perfil; si registra a otra persona, use un correo distinto.",
      },
      { status: 409 },
    );
  }

  try {
    const member = await prisma.member.create({
      data: {
        fullName: d.fullName,
        company: d.company,
        position: d.position,
        email: emailKey,
        whatsapp: d.whatsapp,
        department: d.department,
        municipality: d.municipality,
        linkedin: d.linkedin,
        website: d.website,
        expertiseAreas: d.expertiseAreas,
        contributionTypes: d.contributionTypes,
        professionalSummary: d.professionalSummary,
        committeeContribution: d.committeeContribution,
        committeeExpectation: d.committeeExpectation,
        consent: d.consent,
      },
    });

    return NextResponse.json(
      { member: toPublicMember(member) },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (e: unknown) {
    const code = typeof e === "object" && e !== null && "code" in e ? (e as { code?: string }).code : undefined;
    if (code === "P2002") {
      return NextResponse.json(
        {
          error:
            "Ya existe un perfil con este correo. Use Mi perfil para actualizar el suyo o indique otro correo.",
        },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "No se pudo guardar el registro. Intente de nuevo." }, { status: 500 });
  }
}
