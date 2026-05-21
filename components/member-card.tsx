"use client";

import { useState } from "react";

import { isFoundingReferenceProfile } from "@/lib/demo-profile";
import { buildMemberClipboardSummary } from "@/lib/member-clipboard";
import type { PublicMember } from "@/lib/member-mapper";

function shorten(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex max-w-full items-center break-words rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-100">
      {children}
    </span>
  );
}

export function MemberCard({ member }: { member: PublicMember }) {
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied" | "err">("idle");
  const linkedin = member.linkedin?.replace(/^https?:\/\//, "");
  const website = member.website?.replace(/^https?:\/\//, "");
  const showRefRibbon = isFoundingReferenceProfile(member);

  async function copySummary() {
    if (copyState === "copying") return;
    const text = buildMemberClipboardSummary(member);
    setCopyState("copying");
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2200);
    } catch {
      setCopyState("err");
      setTimeout(() => setCopyState("idle"), 2800);
    }
  }

  const copyLabel =
    copyState === "copying" ? "Copiando…" : copyState === "copied" ? "Copiado" : copyState === "err" ? "Reintentar" : "Copiar resumen";

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-xl shadow-black/25 transition hover:border-cyan-400/35 hover:shadow-cyan-500/15 sm:rounded-2xl">
      {showRefRibbon && (
        <div className="border-b border-amber-400/20 bg-gradient-to-r from-amber-500/15 to-transparent px-4 py-2.5 sm:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-100/95">Perfil de referencia · comité fundador</p>
          <p className="mt-0.5 text-xs leading-snug text-amber-50/80">
            Línea SaaS, plataformas empresariales, integración, IA aplicada y transformación digital.
          </p>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="break-words text-lg font-semibold tracking-tight text-white">{member.fullName}</h3>
            <p className="break-words text-sm font-medium text-cyan-200/90">{member.company}</p>
            <p className="break-words text-sm text-slate-300">{member.position}</p>
          </div>
          <button
            type="button"
            onClick={() => void copySummary()}
            disabled={copyState === "copying"}
            aria-busy={copyState === "copying"}
            className="shrink-0 rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          >
            {copyLabel}
          </button>
        </div>
        <p className="break-words text-xs uppercase tracking-wide text-slate-500">
          {member.department} · {member.municipality}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {member.expertiseAreas.map((a) => (
            <Pill key={a}>{a}</Pill>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {member.contributionTypes.map((c) => (
            <span
              key={c}
              className="inline-flex max-w-full break-words rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-200"
            >
              {c}
            </span>
          ))}
        </div>
        <p className="min-w-0 border-t border-white/5 pt-2 text-sm leading-relaxed text-slate-300">
          {shorten(member.professionalSummary, 220)}
        </p>
        {(member.linkedin || member.website) && (
          <div className="mt-auto flex flex-wrap gap-3 border-t border-white/10 pt-3 text-sm">
            {member.linkedin && (
              <a
                href={member.linkedin.startsWith("http") ? member.linkedin : `https://${member.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-cyan-300 underline-offset-4 transition hover:text-cyan-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
              >
                LinkedIn{linkedin ? ` (${shorten(linkedin, 28)})` : ""}
              </a>
            )}
            {member.website && (
              <a
                href={member.website.startsWith("http") ? member.website : `https://${member.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-cyan-300 underline-offset-4 transition hover:text-cyan-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
              >
                Sitio web{website ? ` (${shorten(website, 28)})` : ""}
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
