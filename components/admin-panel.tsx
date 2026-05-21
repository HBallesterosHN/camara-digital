"use client";

import { useCallback, useEffect, useState } from "react";

import { ADMIN_PIN_STORAGE_KEY } from "@/lib/admin-storage";
import { adminMembersToCsvRows, membersToCsv } from "@/lib/csv-export";

type AdminMember = {
  id: string;
  fullName: string;
  company: string;
  position: string;
  email: string;
  whatsapp: string;
  department: string;
  municipality: string;
  linkedin: string | null;
  website: string | null;
  expertiseAreas: string[];
  contributionTypes: string[];
  professionalSummary: string;
  committeeContribution: string;
  committeeExpectation: string;
  consent: boolean;
  createdAt: string;
  updatedAt: string;
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-HN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function AdminPanel() {
  const [pinInput, setPinInput] = useState("");
  const [storedPin, setStoredPin] = useState<string | null>(() => {
    const raw = window.localStorage.getItem(ADMIN_PIN_STORAGE_KEY);
    const t = raw?.trim();
    return t ? t : null;
  });
  const [members, setMembers] = useState<AdminMember[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminMember | null>(null);
  const [exportState, setExportState] = useState<"idle" | "done">("idle");

  const loadMembers = useCallback(async (pin: string) => {
    const cleanPin = pin.trim();
    if (!cleanPin) {
      setMembers(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/members", { headers: { "x-admin-pin": cleanPin } });
      const data = (await res.json()) as { members?: AdminMember[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? "No autorizado");
        setMembers(null);
        if (res.status === 401 && typeof window !== "undefined") {
          window.localStorage.removeItem(ADMIN_PIN_STORAGE_KEY);
          setStoredPin(null);
        }
        return;
      }
      setMembers(data.members ?? []);
    } catch {
      setError("No se pudo cargar la lista.");
      setMembers(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga y re-carga cuando cambia el PIN almacenado (login o logout).
  useEffect(() => {
    if (!storedPin) {
      setMembers(null);
      return;
    }
    void loadMembers(storedPin);
  }, [storedPin, loadMembers]);

  useEffect(() => {
    if (!detail) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDetail(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [detail]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "PIN incorrecto");
        return;
      }
      const clean = pinInput.trim();
      window.localStorage.setItem(ADMIN_PIN_STORAGE_KEY, clean);
      setStoredPin(clean);
      setPinInput("");
    } catch {
      setError("No se pudo verificar el PIN.");
    }
  }

  function logout() {
    window.localStorage.removeItem(ADMIN_PIN_STORAGE_KEY);
    setStoredPin(null);
    setMembers(null);
    setDetail(null);
  }

  function exportCsv() {
    if (!members || members.length === 0) return;
    const rows = adminMembersToCsvRows(members);
    const csv = `\uFEFF${membersToCsv(rows)}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mapa-comite-miembros-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setExportState("done");
    window.setTimeout(() => setExportState("idle"), 2500);
  }

  if (!storedPin) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-white">Acceso administrativo</h2>
        <p className="mt-2 text-sm text-slate-400">
          Ingrese el PIN configurado en la variable de entorno <code className="rounded bg-black/30 px-1">ADMIN_PIN</code>{" "}
          del servidor.
        </p>
        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="font-medium text-slate-200">PIN</span>
            <input
              type="password"
              autoComplete="current-password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#071229] px-3 py-2.5 text-slate-100 outline-none ring-cyan-400/30 focus:ring-2"
            />
          </label>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20"
          >
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">
          Sesión activa. El PIN se guarda solo en este navegador (<span className="text-slate-200">localStorage</span>).
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCsv}
            disabled={!members || members.length === 0}
            className="rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {exportState === "done" ? "Archivo generado" : "Exportar CSV"}
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:scale-[0.98]"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6" aria-busy="true" aria-label="Cargando registros">
          <div className="mb-4 h-4 w-48 animate-pulse rounded bg-white/10" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-white/[0.06]" />
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">Sincronizando con la base de datos…</p>
        </div>
      )}

      {members && !loading && members.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#071229]/50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-200">No hay registros en la base de datos</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Cuando existan altas desde el formulario de registro, la tabla se completará automáticamente en esta vista.
          </p>
        </div>
      )}

      {members && !loading && members.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] shadow-inner">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="border-b border-white/10 bg-[#071229] text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Ubicación</th>
                <th className="px-4 py-3">Registro</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium text-white">{m.fullName}</td>
                  <td className="px-4 py-3">{m.company}</td>
                  <td className="px-4 py-3 text-cyan-200/90">{m.email}</td>
                  <td className="px-4 py-3">{m.whatsapp}</td>
                  <td className="px-4 py-3">
                    {m.department}
                    <span className="block text-xs text-slate-500">{m.municipality}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{formatDate(m.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setDetail(m)}
                      className="rounded-lg bg-cyan-500/15 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 active:scale-[0.98]"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && !loading && <p className="text-sm text-red-300">{error}</p>}

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          role="presentation"
          onClick={() => setDetail(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-detail-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0a1628] p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 id="admin-detail-title" className="break-words text-xl font-semibold text-white">
                  {detail.fullName}
                </h3>
                <p className="break-words text-sm text-cyan-200/90">{detail.company}</p>
                <p className="break-words text-sm text-slate-300">{detail.position}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="rounded-lg border border-white/10 px-3 py-1 text-sm text-slate-300 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Cerrar
              </button>
            </div>
            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase text-slate-500">Correo</dt>
                <dd className="break-words text-slate-100">{detail.email}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-slate-500">WhatsApp</dt>
                <dd className="break-words text-slate-100">{detail.whatsapp}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-slate-500">Ubicación</dt>
                <dd className="text-slate-100">
                  {detail.municipality}, {detail.department}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-slate-500">Consentimiento</dt>
                <dd className="text-slate-100">{detail.consent ? "Sí" : "No"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase text-slate-500">LinkedIn</dt>
                <dd className="text-slate-100">{detail.linkedin ?? "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase text-slate-500">Sitio web</dt>
                <dd className="text-slate-100">{detail.website ?? "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase text-slate-500">Áreas de experiencia</dt>
                <dd className="text-slate-100">{detail.expertiseAreas.join(", ")}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase text-slate-500">Tipos de aporte</dt>
                <dd className="text-slate-100">{detail.contributionTypes.join(", ")}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase text-slate-500">Descripción profesional</dt>
                <dd className="break-words leading-relaxed text-slate-200">{detail.professionalSummary}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase text-slate-500">Aporte al comité</dt>
                <dd className="break-words leading-relaxed text-slate-200">{detail.committeeContribution}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase text-slate-500">Expectativa del comité</dt>
                <dd className="break-words leading-relaxed text-slate-200">{detail.committeeExpectation}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
