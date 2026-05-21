import { NextResponse } from "next/server";

import { validateCreateMemberBody } from "@/lib/api-validation";
import { normalizeCommitteeEmail } from "@/lib/committee-access";
import { prisma } from "@/lib/prisma";
import { requireCommitteeMember } from "@/lib/require-committee";

export async function GET() {
  const r = await requireCommitteeMember();
  if (!r.ok) return r.response;

  const email = normalizeCommitteeEmail(r.session.user?.email ?? null);
  if (!email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const member = await prisma.member.findUnique({
      where: { email },
    });
    return NextResponse.json(
      { member },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } },
    );
  } catch {
    return NextResponse.json({ error: "No se pudo cargar el perfil." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const r = await requireCommitteeMember();
  if (!r.ok) return r.response;

  const email = normalizeCommitteeEmail(r.session.user?.email ?? null);
  if (!email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = validateCreateMemberBody(json, { emailFromSession: email });
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const d = parsed.data;
  if (d.email !== email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const member = await prisma.member.upsert({
      where: { email },
      create: {
        fullName: d.fullName,
        company: d.company,
        position: d.position,
        email: d.email,
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
      update: {
        fullName: d.fullName,
        company: d.company,
        position: d.position,
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
      { member },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "No se pudo guardar el perfil." }, { status: 500 });
  }
}
