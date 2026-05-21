import type { DashboardStats } from "@/lib/dashboard-stats";
import { HONDURAS_DEPARTMENTS } from "@/lib/constants";

function StatCard({
  title,
  value,
  hint,
  accent,
}: {
  title: string;
  value: string | number;
  hint?: string;
  accent?: "cyan" | "blue" | "slate";
}) {
  const ring =
    accent === "blue"
      ? "from-blue-500/25 via-white/[0.06] to-transparent"
      : accent === "slate"
        ? "from-slate-400/15 via-white/[0.05] to-transparent"
        : "from-cyan-400/25 via-white/[0.06] to-transparent";
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${ring} p-5 shadow-lg shadow-black/30`}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl" />
      <p className="relative text-xs font-semibold uppercase tracking-wide text-cyan-100/85">{title}</p>
      <p className="relative mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
      {hint && <p className="relative mt-1.5 text-xs leading-snug text-slate-400">{hint}</p>}
    </div>
  );
}

function SimpleBarRow({
  label,
  value,
  max,
  tone = "default",
}: {
  label: string;
  value: number;
  max: number;
  tone?: "default" | "soft";
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const fill =
    tone === "soft"
      ? "from-slate-300/80 to-slate-500/90"
      : "from-cyan-300 via-cyan-400 to-blue-600";
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex justify-between gap-2 text-sm text-slate-200">
        <span className="min-w-0 truncate" title={label}>
          {label}
        </span>
        <span className="shrink-0 tabular-nums font-semibold text-cyan-100">{value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/[0.08] ring-1 ring-inset ring-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${fill} shadow-sm shadow-cyan-500/20 transition-[width] duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function BarList({
  title,
  subtitle,
  rows,
  empty,
}: {
  title: string;
  subtitle?: string;
  rows: { label: string; count: number }[];
  empty: string;
}) {
  const max = rows.reduce((m, r) => Math.max(m, r.count), 0);
  return (
    <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-6 shadow-xl shadow-black/25 ring-1 ring-white/5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">{empty}</p>
      ) : (
        <div className="mt-5 space-y-4">
          {rows.map((r) => (
            <SimpleBarRow key={r.label} label={r.label} value={r.count} max={max} />
          ))}
        </div>
      )}
    </section>
  );
}

function OpportunityList({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#071229]/80 p-4">
      <h3 className="text-sm font-semibold text-cyan-100/90">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-slate-300">{children}</div>
    </div>
  );
}

export function DashboardView({ stats }: { stats: DashboardStats }) {
  const deptMax = stats.byDepartment.reduce((m, r) => Math.max(m, r.count), 0);
  const totalDepts = HONDURAS_DEPARTMENTS.length;

  return (
    <div className="min-w-0 space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0a1f35] via-[#071229] to-[#050c18] p-6 shadow-2xl shadow-cyan-500/10 sm:p-8">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.12),transparent_70%)]" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/90">Radiografía del comité</p>
        <h2 className="relative mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Panorama de capacidades</h2>
        <p className="relative mt-4 max-w-3xl text-base leading-relaxed text-slate-300">{stats.executiveInsight}</p>
        <div className="relative mt-6 flex flex-wrap gap-2 text-xs text-slate-400">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Cámara de Comercio Digital de Honduras</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Comité MIPYMES y Transformación Digital</span>
        </div>
      </section>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Indicadores clave</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Miembros registrados" value={stats.totalMembers} hint="Perfiles activos en el mapa" accent="cyan" />
          <StatCard
            title="Departamentos representados"
            value={stats.departmentsRepresented}
            hint={`De ${String(totalDepts)} departamentos del país`}
            accent="blue"
          />
          <StatCard
            title="Municipios representados"
            value={stats.municipalitiesRepresented}
            hint="Combinación departamento + municipio"
            accent="slate"
          />
        </div>
      </div>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Oportunidades detectadas</h3>
        <div className="grid gap-4 lg:grid-cols-3">
          <OpportunityList title="Cobertura territorial">
            {stats.departmentsWithoutMembers.length === 0 ? (
              <p className="text-emerald-200/90">
                Todos los departamentos del catálogo tienen al menos un perfil. Excelente cobertura para una demo inicial.
              </p>
            ) : (
              <ul className="list-inside list-disc space-y-1 text-slate-300">
                <li>
                  <span className="font-medium text-white">{stats.departmentsWithoutMembers.length}</span> departamento(s) sin
                  representación aún: {stats.departmentsWithoutMembers.slice(0, 6).join(", ")}
                  {stats.departmentsWithoutMembers.length > 6 ? "…" : ""}.
                </li>
                <li className="text-slate-400">
                  Priorizar invitaciones o registro en estas regiones fortalece la legitimidad nacional del comité.
                </li>
              </ul>
            )}
          </OpportunityList>
          <OpportunityList title="Áreas de experiencia con menor presencia">
            {stats.expertiseLowPresence.length === 0 ? (
              <p>No hay datos suficientes para comparar.</p>
            ) : stats.expertiseLowPresence.every((x) => x.count === 0) ? (
              <ul className="space-y-1">
                {stats.expertiseLowPresence.map((x) => (
                  <li key={x.label}>
                    <span className="text-white">{x.label}</span>
                    <span className="text-slate-500"> — sin perfiles etiquetados aún</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-1">
                {stats.expertiseLowPresence.map((x) => (
                  <li key={x.label}>
                    <span className="text-white">{x.label}</span>
                    <span className="text-slate-500"> — {x.count} mención(es)</span>
                  </li>
                ))}
              </ul>
            )}
          </OpportunityList>
          <OpportunityList title="Mayor representación: tipos de aporte">
            {stats.strongestContributionTypes.length === 0 ? (
              <p>Sin datos de aportes todavía.</p>
            ) : (
              <ol className="list-decimal space-y-1.5 pl-4">
                {stats.strongestContributionTypes.map((x) => (
                  <li key={x.label}>
                    <span className="font-medium text-white">{x.label}</span>
                    <span className="text-slate-500"> ({x.count})</span>
                  </li>
                ))}
              </ol>
            )}
            <p className="mt-3 text-xs text-slate-500">
              Útil para diseñar comisiones de trabajo y convocatorias alineadas a la oferta real del comité.
            </p>
          </OpportunityList>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <BarList
          title="Top áreas de experiencia"
          subtitle="Frecuencia en los perfiles (cada miembro puede tener varias áreas)"
          rows={stats.topExpertise}
          empty="Aún no hay datos."
        />
        <BarList
          title="Top tipos de aporte"
          subtitle="Modalidades declaradas por los miembros"
          rows={stats.topContributions}
          empty="Aún no hay datos."
        />
      </div>

      <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-6 shadow-xl shadow-black/25 ring-1 ring-white/5">
        <h2 className="text-lg font-semibold text-white">Distribución por departamento</h2>
        <p className="mt-1 text-sm text-slate-400">Intensidad relativa según número de perfiles por departamento.</p>
        {stats.byDepartment.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">Aún no hay registros.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {stats.byDepartment.map((r) => (
              <SimpleBarRow key={r.department} label={r.department} value={r.count} max={deptMax} tone="soft" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
