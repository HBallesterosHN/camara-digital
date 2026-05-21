import { NextResponse } from "next/server";

import { normalizeCommitteeEmail } from "@/lib/committee-access";
import { prisma } from "@/lib/prisma";
import { requireCommitteeAdmin } from "@/lib/require-committee";

export async function GET() {
  const r = await requireCommitteeAdmin();
  if (!r.ok) return r.response;

  const users = await prisma.allowedUser.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(
    { users },
    {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    },
  );
}

export async function POST(request: Request) {
  const r = await requireCommitteeAdmin();
  if (!r.ok) return r.response;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const body = json as Record<string, unknown>;
  const email = normalizeCommitteeEmail(typeof body.email === "string" ? body.email : null);
  if (!email) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  }
  const role = body.role === "admin" || body.role === "member" ? body.role : null;
  if (!role) {
    return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
  }
  const fullName =
    typeof body.fullName === "string" && body.fullName.trim().length > 0 ? body.fullName.trim() : null;

  try {
    const user = await prisma.allowedUser.create({
      data: { email, fullName, role, isActive: true },
    });
    return NextResponse.json({ user }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "No se pudo crear (¿correo duplicado?)" }, { status: 409 });
  }
}

export async function PATCH(request: Request) {
  const r = await requireCommitteeAdmin();
  if (!r.ok) return r.response;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const body = json as Record<string, unknown>;
  const id = typeof body.id === "string" ? body.id : null;
  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }

  const data: { fullName?: string | null; isActive?: boolean; role?: string } = {};
  if ("fullName" in body) {
    if (body.fullName === null) data.fullName = null;
    else if (typeof body.fullName === "string") data.fullName = body.fullName.trim() || null;
  }
  if (typeof body.isActive === "boolean") data.isActive = body.isActive;
  if (typeof body.role === "string") {
    if (body.role !== "admin" && body.role !== "member") {
      return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
    }
    data.role = body.role;
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Sin cambios" }, { status: 400 });
  }

  try {
    const user = await prisma.allowedUser.update({ where: { id }, data });
    return NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 404 });
  }
}

export async function DELETE(request: Request) {
  const r = await requireCommitteeAdmin();
  if (!r.ok) return r.response;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }

  try {
    await prisma.allowedUser.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 404 });
  }
}
