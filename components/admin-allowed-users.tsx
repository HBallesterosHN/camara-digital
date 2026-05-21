"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type AllowedUserRow = {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  isActive: boolean;
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

export function AdminAllowedUsers() {
  const [users, setUsers] = useState<AllowedUserRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [deleteTarget, setDeleteTarget] = useState<AllowedUserRow | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/allowed-users");
      const data = (await res.json()) as { users?: AllowedUserRow[]; error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo cargar la lista de accesos.");
        setUsers(null);
        return;
      }
      setUsers(data.users ?? []);
    } catch {
      toast.error("Error de red al cargar usuarios autorizados.");
      setUsers(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/allowed-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          fullName: fullName.trim() || null,
          role,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo agregar el usuario.");
        return;
      }
      toast.success("Usuario autorizado agregado.");
      setEmail("");
      setFullName("");
      setRole("member");
      await load();
    } catch {
      toast.error("Error de red.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(u: AllowedUserRow) {
    try {
      const res = await fetch("/api/admin/allowed-users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: u.id, isActive: !u.isActive }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo actualizar el estado.");
        return;
      }
      toast.success(u.isActive ? "Acceso desactivado." : "Acceso activado.");
      await load();
    } catch {
      toast.error("Error de red.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/allowed-users?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo eliminar.");
        return;
      }
      toast.success("Usuario eliminado de la lista de accesos.");
      setDeleteTarget(null);
      await load();
    } catch {
      toast.error("Error de red.");
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Usuarios autorizados</h2>
        <p className="mt-1 text-sm text-slate-400">
          Solo las cuentas listadas aquí pueden entrar al área privada tras iniciar sesión con Google. Los cambios se
          aplican de inmediato en el servidor.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
      >
        <h3 className="text-sm font-semibold text-slate-200">Agregar usuario</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-slate-200">Correo</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#071229] px-3 py-2.5 text-slate-100 outline-none ring-cyan-400/30 focus:ring-2"
              placeholder="correo@ejemplo.com"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-slate-200">Nombre (opcional)</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#071229] px-3 py-2.5 text-slate-100 outline-none ring-cyan-400/30 focus:ring-2"
              placeholder="Nombre completo"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-200">Rol</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "member" | "admin")}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[#071229] px-3 py-2.5 text-slate-100 outline-none ring-cyan-400/30 focus:ring-2"
            >
              <option value="member">Miembro</option>
              <option value="admin">Administrador</option>
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Guardando…" : "Agregar"}
            </button>
          </div>
        </div>
      </form>

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6" aria-busy="true">
          <div className="mb-4 h-4 w-56 animate-pulse rounded bg-white/10" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-white/[0.06]" />
            ))}
          </div>
        </div>
      )}

      {!loading && users && users.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#071229]/50 px-6 py-14 text-center">
          <p className="text-sm font-medium text-slate-200">No hay usuarios autorizados</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Use el formulario superior para agregar correos del comité. Sin registros aquí, nadie podrá acceder al área
            privada (salvo que coincida con datos sembrados en la base).
          </p>
        </div>
      )}

      {!loading && users && users.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] shadow-inner">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="border-b border-white/10 bg-[#071229] text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Creación</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium text-white">{u.fullName ?? "—"}</td>
                  <td className="px-4 py-3 text-cyan-200/90">{u.email}</td>
                  <td className="px-4 py-3">{u.role === "admin" ? "Administrador" : "Miembro"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        u.isActive
                          ? "rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-200"
                          : "rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-200"
                      }
                    >
                      {u.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => void toggleActive(u)}
                        className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                      >
                        {u.isActive ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(u)}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
          role="presentation"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-allowed-title"
            className="max-w-md rounded-2xl border border-white/10 bg-[#0a1628] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="delete-allowed-title" className="text-lg font-semibold text-white">
              ¿Eliminar acceso?
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Se eliminará <span className="font-medium text-slate-200">{deleteTarget.email}</span> de la lista de
              usuarios autorizados. No podrá acceder al área privada hasta que se vuelva a agregar.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
