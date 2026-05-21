"use client";

import Link from "next/link";
import { useState } from "react";

import { MemberProfileFormFields } from "@/components/member-profile-form-fields";
import { emptyMemberProfileFormState, type MemberProfileFormState } from "@/lib/member-profile-form-types";
import { validateMemberProfileFormState } from "@/lib/member-profile-validate-client";
import { normalizeHnWhatsappForStorage } from "@/lib/hn-whatsapp";

type RegistrationFormProps = {
  hasExistingProfile?: boolean;
};

export function RegistrationForm({ hasExistingProfile = false }: RegistrationFormProps) {
  const [form, setForm] = useState<MemberProfileFormState>(() => emptyMemberProfileFormState());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function validate(): boolean {
    const e = validateMemberProfileFormState(form);
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          company: form.company.trim(),
          position: form.position.trim(),
          email: form.email.trim().toLowerCase(),
          whatsapp: normalizeHnWhatsappForStorage(form.whatsapp),
          department: form.department,
          municipality: form.municipality,
          linkedin: form.linkedin.trim() || null,
          website: form.website.trim() || null,
          expertiseAreas: form.expertiseAreas,
          contributionTypes: form.contributionTypes,
          professionalSummary: form.professionalSummary.trim(),
          committeeContribution: form.committeeContribution.trim(),
          committeeExpectation: form.committeeExpectation.trim(),
          consent: form.consent,
        }),
      });
      const rawText = await res.text();
      let data: { error?: string } = {};
      if (rawText) {
        try {
          data = JSON.parse(rawText) as { error?: string };
        } catch {
          setErrors({ _form: `Respuesta no válida del servidor (código ${res.status}).` });
          return;
        }
      }
      if (!res.ok) {
        setErrors({ _form: data.error ?? "No se pudo completar el registro." });
        return;
      }
      setDone(true);
      setForm(emptyMemberProfileFormState());
    } catch {
      setErrors({ _form: "Error de red. Intente de nuevo." });
    } finally {
      setSubmitting(false);
    }
  }

  if (hasExistingProfile) {
    return (
      <div className="rounded-3xl border border-cyan-400/25 bg-gradient-to-br from-cyan-500/[0.08] via-[#0a1628] to-blue-900/15 px-6 py-12 text-center shadow-xl sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/90">Perfil existente</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">Ya tienes un perfil registrado</h2>
        <p className="mx-auto mt-4 max-w-lg text-slate-300">
          Puedes actualizarlo desde <span className="font-medium text-white">Mi perfil</span>: nombre, empresa, áreas
          de experiencia y el resto de campos del comité.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <Link
            href="/mi-perfil"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 active:scale-[0.98]"
          >
            Ir a Mi perfil
          </Link>
          <Link
            href="/directorio"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 active:scale-[0.98]"
          >
            Ver directorio
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 via-[#0a1628] to-blue-900/20 px-6 py-10 text-center shadow-2xl shadow-cyan-500/10 sm:px-10 sm:py-12">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/20 text-3xl text-cyan-100"
          aria-hidden
        >
          ✓
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-white">Registro completado</h2>
        <p className="mx-auto mt-3 max-w-lg text-slate-300">
          Los datos quedaron almacenados para el directorio y las vistas analíticas del comité, conforme al consentimiento
          otorgado y a las políticas internas que defina la coordinación.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <button
            type="button"
            onClick={() => setDone(false)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 active:scale-[0.98]"
          >
            Registrar otro miembro
          </button>
          <Link
            href="/directorio"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 active:scale-[0.98]"
          >
            Ver directorio
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 active:scale-[0.98]"
          >
            Ver dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {errors._form && (
        <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">{errors._form}</div>
      )}

      <MemberProfileFormFields form={form} setForm={setForm} errors={errors} />

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[44px] min-w-[180px] items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
        >
          {submitting ? "Enviando…" : "Enviar registro"}
        </button>
        <Link
          href="/directorio"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 active:scale-[0.98]"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
