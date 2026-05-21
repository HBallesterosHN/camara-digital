"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminAllowedUsers } from "@/components/admin-allowed-users";
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
  accessStatus: "active" | "inactive" | "none";
  allowedUserId: string | null;
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-HN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function MembersSection() {
  const [members, setMembers] = useState<AdminMember[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminMember | null>(null);
  const [exportState, setExportState] = useState<"idle" | "done">("idle");
  const [accessBusyId, setAccessBusyId] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/members");
      const data = (await res.json()) as { members?: AdminMember[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? "No autorizado");
        setMembers(null);
        if (res.status === 401 || res.status === 403) {
          toast.error(data.error ?? "No tiene permisos para ver los registros.");
        }
        return;
      }
      setMembers(data.members ?? []);
    } catch {
      setError("No se pudo cargar la lista.");
      setMembers(null);
      toast.error("Error de red al cargar miembros.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      void loadMembers();
    });
  }, [loadMembers]);

  useEffect(() => {
    if (!detail) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDetail(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [detail]);

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
    toast.success("Archivo CSV generado.");
    window.setTimeout(() => setExportState("idle"), 2500);
  }

  async function setMemberAccess(m: AdminMember, isActive: boolean) {
    if (!m.allowedUserId) {
      toast.error("Este correo no tiene fila en usuarios autorizados. Agréguelo en la sección superior.");
      return;
    }
    setAccessBusyId(m.id);
    try {
      const res = await fetch("/api/admin/allowed-users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: m.allowedUserId, isActive }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo actualizar el acceso.");
        return;
      }
      toast.success(isActive ? "Acceso reactivado." : "Acceso desactivado.");
      setDetail((d) => (d?.id === m.id ? null : d));
      await loadMembers();
    } catch {
      toast.error("Error de red.");
    } finally {
      setAccessBusyId(null);
    }
  }

  function accessLabel(status: AdminMember["accessStatus"]) {
    if (status === "active") return "Activo";
    if (status === "inactive") return "Inactivo";
    return "No autorizado";
  }

  function accessBadgeClass(status: AdminMember["accessStatus"]) {
    if (status === "active") return "border-emerald-400/40 bg-emerald-500/15 text-emerald-100";
    if (status === "inactive") return "border-amber-400/40 bg-amber-500/15 text-amber-100";
    return "border-slate-500/40 bg-slate-500/15 text-slate-300";
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Registros del comité</h2>
          <p className="mt-1 text-sm text-slate-400">
            Perfiles en el mapa de capacidades. El acceso al área privada se gestiona en usuarios autorizados; aquí puede
            desactivar o reactivar el ingreso sin borrar la ficha.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={!members || members.length === 0}
          className="rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {exportState === "done" ? "Archivo generado" : "Exportar CSV"}
        </button>
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

      {!loading && members && members.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#071229]/50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-200">No hay registros en la base de datos</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Cuando existan altas desde el formulario de registro, la tabla se completará automáticamente en esta vista.
          </p>
        </div>
      )}

      {!loading && members && members.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] shadow-inner">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="border-b border-white/10 bg-[#071229] text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Ubicación</th>
                <th className="px-4 py-3">Acceso</th>
                <th className="px-4 py-3">Registro</th>
                <th className="px-4 py-3 text-right">Acciones</th>
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
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${accessBadgeClass(m.accessStatus)}`}
                    >
                      {accessLabel(m.accessStatus)}
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.accessStatus === "active" && m.allowedUserId ? (
                        <button
                          type="button"
                          disabled={accessBusyId === m.id}
                          onClick={() => void setMemberAccess(m, false)}
                          className="rounded border border-amber-500/35 bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-100 hover:bg-amber-500/20 disabled:opacity-40"
                        >
                          Desactivar acceso
                        </button>
                      ) : null}
                      {m.accessStatus === "inactive" && m.allowedUserId ? (
                        <button
                          type="button"
                          disabled={accessBusyId === m.id}
                          onClick={() => void setMemberAccess(m, true)}
                          className="rounded border border-emerald-500/35 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-100 hover:bg-emerald-500/20 disabled:opacity-40"
                        >
                          Reactivar acceso
                        </button>
                      ) : null}
                    </div>
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
              <div>
                <dt className="text-xs uppercase text-slate-500">Acceso al área privada</dt>
                <dd className="flex flex-col gap-2 text-slate-100">
                  <span
                    className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-xs font-semibold uppercase ${accessBadgeClass(detail.accessStatus)}`}
                  >
                    {accessLabel(detail.accessStatus)}
                  </span>
                  {detail.accessStatus === "active" && detail.allowedUserId ? (
                    <button
                      type="button"
                      disabled={accessBusyId === detail.id}
                      onClick={() => void setMemberAccess(detail, false)}
                      className="w-fit rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-500/20 disabled:opacity-40"
                    >
                      Desactivar acceso
                    </button>
                  ) : null}
                  {detail.accessStatus === "inactive" && detail.allowedUserId ? (
                    <button
                      type="button"
                      disabled={accessBusyId === detail.id}
                      onClick={() => void setMemberAccess(detail, true)}
                      className="w-fit rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-100 hover:bg-emerald-500/20 disabled:opacity-40"
                    >
                      Reactivar acceso
                    </button>
                  ) : null}
                </dd>
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
    </section>
  );
}

export function AdminPanel() {
  return (
    <div className="space-y-16">
      <AdminAllowedUsers />
      <div className="border-t border-white/10 pt-12">
        <MembersSection />
      </div>
    </div>
  );
}
