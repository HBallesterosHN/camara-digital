import { NextResponse } from "next/server";

import { isAdminPinConfigured, isValidAdminPin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminPinConfigured()) {
    return NextResponse.json(
      { ok: false, error: "El servidor no tiene configurado ADMIN_PIN. Revise las variables de entorno." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const pin = typeof (json as { pin?: unknown }).pin === "string" ? (json as { pin: string }).pin : "";

  if (!isValidAdminPin(pin)) {
    return NextResponse.json({ ok: false, error: "PIN incorrecto" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
