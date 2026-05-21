import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { UnauthorizedSessionCleanup } from "@/components/unauthorized-session-cleanup";

export default function UnauthorizedPage() {
  return (
    <>
      <UnauthorizedSessionCleanup />
      <div className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center overflow-hidden px-4 py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(56, 189, 248, 0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(139, 92, 246, 0.12), transparent)",
          }}
        />
        <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-[#0a1628]/90 p-8 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-10">
          <div className="mb-8 flex justify-center">
            <BrandMark className="!h-14 !w-14" />
          </div>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/90">Área privada</p>
          <h1 className="mt-3 text-center text-2xl font-semibold leading-snug text-white sm:text-[1.65rem]">
            Acceso no habilitado
          </h1>
          <p className="mt-5 text-center text-base leading-relaxed text-slate-300">
            Su cuenta aún no ha sido habilitada para acceder al área privada del comité.
          </p>
          <p className="mt-4 text-center text-sm text-slate-500">
            Si considera que esto es un error, contacte a la secretaría del comité para solicitar acceso.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#5b21b6] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/25 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ccd-orange)]/60 active:scale-[0.98]"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
