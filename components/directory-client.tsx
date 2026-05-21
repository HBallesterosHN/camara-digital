"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { MemberCard } from "@/components/member-card";
import { CONTRIBUTION_TYPES, EXPERTISE_AREAS, HONDURAS_DEPARTMENTS } from "@/lib/constants";
import type { PublicMember } from "@/lib/member-mapper";

export function DirectoryClient({ initialMembers }: { initialMembers: PublicMember[] }) {
  const [members, setMembers] = useState(initialMembers);

  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);
  const [q, setQ] = useState("");
  const [department, setDepartment] = useState("");
  const [expertise, setExpertise] = useState("");
  const [contribution, setContribution] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return members.filter((m) => {
      if (department && m.department !== department) return false;
      if (expertise && !m.expertiseAreas.includes(expertise)) return false;
      if (contribution && !m.contributionTypes.includes(contribution)) return false;
      if (!needle) return true;
      const hay = [
        m.fullName,
        m.company,
        m.position,
        m.department,
        m.municipality,
        m.professionalSummary,
        m.committeeContribution,
        ...m.expertiseAreas,
        ...m.contributionTypes,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [members, q, department, expertise, contribution]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="flex min-w-0 flex-col gap-1 text-sm">
            <span className="font-medium text-slate-200">Búsqueda</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nombre, empresa, palabra clave…"
              className="min-w-0 rounded-xl border border-white/10 bg-[#0a1628] px-3 py-2 text-slate-100 outline-none ring-cyan-400/40 placeholder:text-slate-500 focus:ring-2"
            />
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-sm">
            <span className="font-medium text-slate-200">Departamento</span>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="min-w-0 rounded-xl border border-white/10 bg-[#0a1628] px-3 py-2 text-slate-100 outline-none ring-cyan-400/40 focus:ring-2"
            >
              <option value="">Todos</option>
              {HONDURAS_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-sm">
            <span className="font-medium text-slate-200">Área de experiencia</span>
            <select
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              className="min-w-0 rounded-xl border border-white/10 bg-[#0a1628] px-3 py-2 text-slate-100 outline-none ring-cyan-400/40 focus:ring-2"
            >
              <option value="">Todas</option>
              {EXPERTISE_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-sm">
            <span className="font-medium text-slate-200">Tipo de aporte</span>
            <select
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              className="min-w-0 rounded-xl border border-white/10 bg-[#0a1628] px-3 py-2 text-slate-100 outline-none ring-cyan-400/40 focus:ring-2"
            >
              <option value="">Todos</option>
              {CONTRIBUTION_TYPES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-sm text-slate-400">
          Mostrando <span className="font-semibold text-cyan-200">{filtered.length}</span> de{" "}
          <span className="font-semibold text-white">{members.length}</span> perfiles
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-cyan-500/25 bg-gradient-to-b from-[#071229] to-[#050c18] px-6 py-16 text-center shadow-inner sm:px-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-2xl text-cyan-200">
            {members.length === 0 ? "◇" : "⌕"}
          </div>
          <h3 className="mt-6 text-xl font-semibold text-white">
            {members.length === 0 ? "Aún no hay perfiles en el directorio" : "Sin resultados con los criterios actuales"}
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
            {members.length === 0
              ? "Cuando los miembros del comité completen el registro, las capacidades quedarán disponibles aquí como apoyo a la coordinación y a la priorización de iniciativas."
              : "Ajuste la búsqueda o los filtros (departamento, área de experiencia o tipo de aporte) para ampliar el conjunto de perfiles mostrados."}
          </p>
          {members.length === 0 ? (
            <Link
              href="/registro"
              className="mt-8 inline-flex min-h-[44px] min-w-[160px] items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 active:scale-[0.98]"
            >
              Ir al registro
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setDepartment("");
                setExpertise("");
                setContribution("");
              }}
              className="mt-8 inline-flex min-h-[44px] min-w-[160px] items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:scale-[0.98]"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      )}
    </div>
  );
}
