import Link from "next/link";

const benefits = [
  {
    title: "Directorio de capacidades",
    text: "Consulta estructurada de perfiles para ubicar responsabilidades y convocar apoyo técnico con criterios comunes.",
  },
  {
    title: "Mapa de capacidades",
    text: "Lectura comparativa de experiencias y aportes para priorizar líneas de trabajo y comisiones temáticas.",
  },
  {
    title: "Cobertura regional",
    text: "Visibilidad municipal y departamental para articular esfuerzos territoriales con enfoque institucional.",
  },
  {
    title: "Red de especialistas",
    text: "Identificación expedita de perfiles por área temática y modalidad de colaboración declarada.",
  },
  {
    title: "Base para programas MIPYMES",
    text: "Insumo ordenado para diseñar rutas de diagnóstico, mentorías y acompañamiento en fases posteriores.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(234,88,12,0.22),transparent_42%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200/90">
            Cámara de Comercio Digital de Honduras
          </p>
          <h1 className="mt-4 max-w-4xl text-balance text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Mapa Digital del Comité MIPYMES y Transformación Digital
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Plataforma de apoyo a la coordinación del comité fundador: visibiliza capacidades, ubicación y formas de
            colaboración, con vistas listas para compartir con la Cámara de Comercio Digital de Honduras.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-slate-400">
            Registro, directorio, panel ejecutivo y administración requieren <span className="text-slate-300">acceso con Google</span>{" "}
            (cuenta autorizada). Use <span className="font-medium text-orange-200/90">Acceder</span> en la parte superior cuando esté listo para trabajar en el área del comité.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/registro"
              className="inline-flex min-h-[44px] min-w-[160px] items-center justify-center rounded-xl bg-gradient-to-r from-[#1e3a8a] via-[#5b21b6] to-[#c2410c] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ccd-orange)] active:scale-[0.98]"
            >
              Registrar mi perfil
            </Link>
            <Link
              href="/directorio"
              className="inline-flex min-h-[44px] min-w-[160px] items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 active:scale-[0.98]"
            >
              Ver directorio
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 active:scale-[0.98]"
            >
              Radiografía del comité
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-gradient-to-b from-[var(--ccd-surface)]/90 to-transparent py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200/80">Resumen para el comité</p>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Valor del prototipo en una sola lectura</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg ring-1 ring-white/5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-violet-200/90">Problema que ordena</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Reduce la dispersión de información en canales informales. Concentra quién participa, desde qué
                territorio aporta y con qué capacidades técnicas, para decisiones de agenda y seguimiento institucional.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg ring-1 ring-white/5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-violet-200/90">Utilidad para el comité</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Sirve de insumo para comisiones de trabajo, convocatorias focalizadas e informes de capacidades frente a
                aliados de la Cámara de Comercio Digital de Honduras, con un lenguaje común y criterios comparables.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg ring-1 ring-white/5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-violet-200/90">Escalabilidad prevista</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                La misma estructura puede alimentar programas de acompañamiento a MIPYMES, convocatorias regionales y
                tableros de seguimiento, incorporando autenticación, roles y conectores cuando el comité lo autorice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold text-white">Propósito del mapa</h2>
            <p className="mt-4 leading-relaxed text-slate-300">
              El mapa consolida, con criterios uniformes, la ubicación geográfica, la trayectoria profesional, las
              capacidades técnicas y las modalidades de aporte declaradas por los miembros del comité. El objetivo es
              fortalecer la coordinación interna, acotar tiempos de búsqueda de apoyo especializado y preparar el terreno
              para iniciativas de transformación digital con enfoque en MIPYMES.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/30">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-violet-200/90">Enfoque por fases</h3>
            <div className="mt-4 space-y-5">
              <div>
                <p className="text-sm font-semibold text-white">Fase 1: Organización interna del comité</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Directorio actualizable, filtros por experiencia técnica y tipo de aporte, y vista analítica para
                  decisiones de agenda y trabajo en comisiones.
                </p>
              </div>
              <div className="border-t border-white/10 pt-5">
                <p className="text-sm font-semibold text-white">Fase 2: Apoyo estructurado a MIPYMES</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  La misma base de datos y diseño sirven como punto de partida para programas de diagnóstico,
                  mentorías, alianzas y rutas de implementación tecnológica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:pb-20">
        <div className="rounded-3xl border border-[var(--ccd-orange)]/25 bg-gradient-to-br from-violet-950/40 via-[var(--ccd-surface)] to-slate-950/80 p-6 shadow-xl sm:p-10">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Próximos pasos sugeridos</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Secuencia orientativa para una primera sesión de coordinación con el comité fundador.
          </p>
          <ol className="mt-8 space-y-4 text-sm leading-relaxed text-slate-200">
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-violet-200">
                1
              </span>
              <span>
                <span className="font-semibold text-white">Validar el formulario de registro</span> — confirmar que los
                campos cubren las necesidades del comité y ajustar redacciones si la coordinación lo estima necesario.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-violet-200">
                2
              </span>
              <span>
                <span className="font-semibold text-white">Registrar a los miembros fundadores</span> — completar
                perfiles reales para que el directorio y la radiografía reflejen la composición vigente del comité.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-violet-200">
                3
              </span>
              <span>
                <span className="font-semibold text-white">Revisar el dashboard de capacidades</span> — utilizar la vista
                analítica para conversar sobre brechas, fortalezas y prioridades compartidas.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-violet-200">
                4
              </span>
              <span>
                <span className="font-semibold text-white">Definir enlaces regionales</span> — asignar responsables por
                departamento o corredor para sostener la actualización del mapa.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-violet-200">
                5
              </span>
              <span>
                <span className="font-semibold text-white">Diseñar la fase 2 para MIPYMES</span> — traducir esta base en
                rutas de diagnóstico, mentorías o alianzas con el ecosistema digital.
              </span>
            </li>
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/registro"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:scale-[0.98]"
            >
              Abrir registro
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 active:scale-[0.98]"
            >
              Ver dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[var(--ccd-surface)]/55 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-semibold text-white">Beneficios clave</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-400">
            Interfaz sobria y consistente, pensada para trabajo colaborativo y presentación ante aliados institucionales.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-5 shadow-lg shadow-black/25 transition hover:border-orange-400/25"
              >
                <h3 className="text-lg font-semibold text-white">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
