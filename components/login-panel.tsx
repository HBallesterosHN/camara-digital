"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginPanel() {
  const searchParams = useSearchParams();
  const [busy, setBusy] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/directorio";

  async function onGoogle() {
    setBusy(true);
    try {
      await signIn("google", { callbackUrl });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[var(--ccd-surface)]/90 p-8 shadow-2xl shadow-violet-950/20 backdrop-blur-sm sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ccd-orange)]">Acceso institucional</p>
      <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Área del comité</h1>
      <p className="mt-4 leading-relaxed text-slate-400">
        El registro, directorio, panel ejecutivo y administración están reservados a personas autorizadas. Inicie sesión
        con la cuenta corporativa o institucional habilitada por la coordinación (Google).
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={() => void onGoogle()}
        className="mt-8 flex w-full min-h-[48px] items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ccd-orange)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleGlyph />
        {busy ? "Redirigiendo…" : "Continuar con Google"}
      </button>
      <p className="mt-6 text-center text-xs text-slate-500">
        Al continuar, acepta las condiciones de uso definidas por la Cámara de Comercio Digital de Honduras para este
        prototipo.
      </p>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
