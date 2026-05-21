import { NextResponse } from "next/server";

import { isAdminPinConfigured, isValidAdminPin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  if (!isAdminPinConfigured()) {
    return NextResponse.json(
      { error: "El servidor no tiene configurado ADMIN_PIN. Revise las variables de entorno." },
      { status: 503 },
    );
  }

  const pin = request.headers.get("x-admin-pin");
  if (!isValidAdminPin(pin)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

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
