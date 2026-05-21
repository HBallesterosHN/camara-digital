"use client";

import dynamic from "next/dynamic";

const AdminPanel = dynamic(() => import("@/components/admin-panel").then((m) => m.AdminPanel), { ssr: false });

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Panel administrativo</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Vista operativa para revisar registros completos (correo, WhatsApp y campos extendidos). Requiere sesión con
          Google y, además, el PIN de administrador definido en el entorno (doble control en este MVP).
        </p>
      </div>
      <AdminPanel />
    </div>
  );
}
