type DatabaseUnavailableProps = {
  /** Título breve según la vista */
  sectionLabel: string;
};

/**
 * Vista institucional cuando Prisma no puede alcanzar la base (P5010, P1001, etc.).
 */
export function DatabaseUnavailable({ sectionLabel }: DatabaseUnavailableProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/90">Conectividad</p>
      <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">No fue posible cargar {sectionLabel}</h1>
      <p className="mt-4 leading-relaxed text-slate-400">
        El servidor no pudo obtener datos de PostgreSQL. Suele ocurrir con una URL de{" "}
        <span className="font-mono text-slate-300">prisma+postgres://</span> (Prisma Accelerate) sin acceso de red
        estable desde su equipo, o si la base está detenida.
      </p>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left text-sm text-slate-300">
        <p className="font-semibold text-white">Pasos recomendados (desarrollo local)</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed">
          <li>
            En <span className="font-mono text-cyan-200/90">.env</span>, agregue{" "}
            <span className="font-mono text-cyan-200/90">DATABASE_URL_DIRECT</span> con la cadena{" "}
            <span className="font-mono text-cyan-200/90">postgresql://…</span> del mismo origen que usa en producción
            (Neon, Supabase, Vercel Postgres, etc.). El proyecto la usará automáticamente cuando{" "}
            <span className="font-mono text-cyan-200/90">DATABASE_URL</span> comience por{" "}
            <span className="font-mono text-cyan-200/90">prisma+</span>.
          </li>
          <li>
            O bien sustituya temporalmente <span className="font-mono text-cyan-200/90">DATABASE_URL</span> por la URL
            directa mientras prueba en local.
          </li>
          <li>
            Confirme migraciones y datos: <span className="font-mono text-slate-200">npm run db:push</span> y, si aplica,{" "}
            <span className="font-mono text-slate-200">npm run db:seed</span>.
          </li>
        </ol>
      </div>
      <p className="mt-6 text-xs text-slate-500">
        Consulte la sección «Prisma Accelerate y desarrollo local» en el README del repositorio.
      </p>
    </div>
  );
}
