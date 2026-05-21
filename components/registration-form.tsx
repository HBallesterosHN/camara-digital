"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { CONTRIBUTION_TYPES, EXPERTISE_AREAS, HONDURAS_DEPARTMENTS } from "@/lib/constants";
import { getMunicipalitiesForDepartment, isMunicipalityInDepartment } from "@/lib/honduras-municipalities";
import {
  formatHnWhatsappDisplay,
  isCompleteHnWhatsapp,
  normalizeHnWhatsappForStorage,
} from "@/lib/hn-whatsapp";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_DEPARTMENTS = new Set<string>(HONDURAS_DEPARTMENTS as unknown as string[]);

type FormState = {
  fullName: string;
  company: string;
  position: string;
  email: string;
  whatsapp: string;
  department: string;
  municipality: string;
  linkedin: string;
  website: string;
  expertiseAreas: string[];
  contributionTypes: string[];
  professionalSummary: string;
  committeeContribution: string;
  committeeExpectation: string;
  consent: boolean;
};

const initial: FormState = {
  fullName: "",
  company: "",
  position: "",
  email: "",
  whatsapp: "+504 ",
  department: "",
  municipality: "",
  linkedin: "",
  website: "",
  expertiseAreas: [],
  contributionTypes: [],
  professionalSummary: "",
  committeeContribution: "",
  committeeExpectation: "",
  consent: false,
};

function toggle<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

export function RegistrationForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const municipalityOptions = useMemo(
    () => getMunicipalitiesForDepartment(form.department),
    [form.department],
  );

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (form.fullName.trim().length < 3) e.fullName = "Nombre completo obligatorio (mín. 3 caracteres).";
    if (!form.company.trim()) e.company = "Empresa u organización obligatoria.";
    if (!form.position.trim()) e.position = "Cargo obligatorio.";
    if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) e.email = "Correo electrónico no válido.";
    if (!isCompleteHnWhatsapp(form.whatsapp)) {
      e.whatsapp = "WhatsApp obligatorio: +504 y 8 dígitos (móvil).";
    }
    if (!form.department) e.department = "Seleccione un departamento.";
    else if (!ALLOWED_DEPARTMENTS.has(form.department)) e.department = "Departamento no válido.";
    if (!form.municipality) e.municipality = "Seleccione un municipio.";
    else if (!isMunicipalityInDepartment(form.department, form.municipality)) {
      e.municipality = "Municipio no válido para el departamento elegido.";
    }
    if (form.expertiseAreas.length === 0) e.expertiseAreas = "Seleccione al menos un área.";
    if (form.contributionTypes.length === 0) e.contributionTypes = "Seleccione al menos un tipo de aporte.";
    if (form.professionalSummary.trim().length < 20) {
      e.professionalSummary = "Mínimo 20 caracteres.";
    }
    if (form.committeeContribution.trim().length < 20) {
      e.committeeContribution = "Indique al menos 20 caracteres sobre las formas de aporte.";
    }
    if (form.committeeExpectation.trim().length < 10) {
      e.committeeExpectation = "Indique al menos 10 caracteres sobre la expectativa.";
    }
    if (!form.consent) e.consent = "Debe marcar la autorización conforme al aviso de consentimiento.";

    if (form.linkedin.trim()) {
      try {
        const u = new URL(form.linkedin.startsWith("http") ? form.linkedin : `https://${form.linkedin}`);
        if (!["http:", "https:"].includes(u.protocol)) e.linkedin = "URL no válida.";
      } catch {
        e.linkedin = "URL no válida.";
      }
    }
    if (form.website.trim()) {
      try {
        const u = new URL(form.website.startsWith("http") ? form.website : `https://${form.website}`);
        if (!["http:", "https:"].includes(u.protocol)) e.website = "URL no válida.";
      } catch {
        e.website = "URL no válida.";
      }
    }

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
          email: form.email.trim(),
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
      setForm(initial);
    } catch {
      setErrors({ _form: "Error de red. Intente de nuevo." });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 via-[#0a1628] to-blue-900/20 px-6 py-10 text-center shadow-2xl shadow-cyan-500/10 sm:px-10 sm:py-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/20 text-3xl text-cyan-100" aria-hidden>
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

  const fieldClass =
    "mt-1 w-full rounded-xl border border-white/10 bg-[#071229] px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-400/35 focus-visible:outline-none";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {errors._form && (
        <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {errors._form}
        </div>
      )}

      <section className="grid gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-lg font-semibold text-white">Datos generales</h2>
        <label className="block text-sm">
          <span className="font-medium text-slate-200">Nombre completo *</span>
          <input
            className={fieldClass}
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-300">{errors.fullName}</p>}
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-200">Empresa u organización *</span>
          <input className={fieldClass} value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
          {errors.company && <p className="mt-1 text-xs text-red-300">{errors.company}</p>}
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-200">Cargo *</span>
          <input className={fieldClass} value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} />
          {errors.position && <p className="mt-1 text-xs text-red-300">{errors.position}</p>}
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-200">Correo electrónico *</span>
          <input
            type="email"
            className={fieldClass}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          {errors.email && <p className="mt-1 text-xs text-red-300">{errors.email}</p>}
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-200">WhatsApp *</span>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            className={fieldClass}
            value={form.whatsapp}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp: formatHnWhatsappDisplay(e.target.value) }))}
            placeholder="+504 0000-0000"
            aria-describedby="whatsapp-hint"
          />
          <p id="whatsapp-hint" className="mt-1 text-xs text-slate-500">
            Prefijo +504 fijo. Escriba o pegue los 8 dígitos del móvil (se formatean automáticamente).
          </p>
          {errors.whatsapp && <p className="mt-1 text-xs text-red-300">{errors.whatsapp}</p>}
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-200">Departamento *</span>
          <select
            className={fieldClass}
            value={form.department}
            onChange={(e) => {
              const department = e.target.value;
              setForm((f) => ({ ...f, department, municipality: "" }));
            }}
          >
            <option value="">Seleccione…</option>
            {HONDURAS_DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.department && <p className="mt-1 text-xs text-red-300">{errors.department}</p>}
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-200">Municipio *</span>
          <select
            className={fieldClass}
            value={form.municipality}
            disabled={!form.department}
            onChange={(e) => setForm((f) => ({ ...f, municipality: e.target.value }))}
          >
            <option value="">
              {form.department ? "Seleccione municipio…" : "Primero seleccione departamento"}
            </option>
            {municipalityOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {errors.municipality && <p className="mt-1 text-xs text-red-300">{errors.municipality}</p>}
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-200">LinkedIn (opcional)</span>
          <input className={fieldClass} value={form.linkedin} onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))} />
          {errors.linkedin && <p className="mt-1 text-xs text-red-300">{errors.linkedin}</p>}
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-200">Sitio web (opcional)</span>
          <input className={fieldClass} value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} />
          {errors.website && <p className="mt-1 text-xs text-red-300">{errors.website}</p>}
        </label>
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-semibold text-white">Áreas de experiencia *</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTISE_AREAS.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/5 bg-[#071229] px-3 py-2 text-sm text-slate-200 hover:border-cyan-400/30">
              <input
                type="checkbox"
                checked={form.expertiseAreas.includes(a)}
                onChange={() => setForm((f) => ({ ...f, expertiseAreas: toggle(f.expertiseAreas, a) }))}
                className="size-4 rounded border-white/20 bg-transparent text-cyan-400 focus:ring-cyan-400/40"
              />
              {a}
            </label>
          ))}
        </div>
        {errors.expertiseAreas && <p className="text-xs text-red-300">{errors.expertiseAreas}</p>}
      </section>

      <section className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-semibold text-white">Tipo de aporte *</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {CONTRIBUTION_TYPES.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/5 bg-[#071229] px-3 py-2 text-sm text-slate-200 hover:border-cyan-400/30">
              <input
                type="checkbox"
                checked={form.contributionTypes.includes(c)}
                onChange={() => setForm((f) => ({ ...f, contributionTypes: toggle(f.contributionTypes, c) }))}
                className="size-4 rounded border-white/20 bg-transparent text-cyan-400 focus:ring-cyan-400/40"
              />
              {c}
            </label>
          ))}
        </div>
        {errors.contributionTypes && <p className="text-xs text-red-300">{errors.contributionTypes}</p>}
      </section>

      <section className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-semibold text-white">Perfil y expectativas</h2>
        <label className="block text-sm">
          <span className="font-medium text-slate-200">Breve descripción profesional *</span>
          <textarea
            rows={4}
            className={fieldClass}
            value={form.professionalSummary}
            onChange={(e) => setForm((f) => ({ ...f, professionalSummary: e.target.value }))}
          />
          {errors.professionalSummary && <p className="mt-1 text-xs text-red-300">{errors.professionalSummary}</p>}
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-200">Formas de aporte al comité (autorreportado) *</span>
          <textarea
            rows={4}
            className={fieldClass}
            value={form.committeeContribution}
            onChange={(e) => setForm((f) => ({ ...f, committeeContribution: e.target.value }))}
          />
          {errors.committeeContribution && <p className="mt-1 text-xs text-red-300">{errors.committeeContribution}</p>}
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-200">Expectativa respecto del trabajo del comité *</span>
          <textarea
            rows={3}
            className={fieldClass}
            value={form.committeeExpectation}
            onChange={(e) => setForm((f) => ({ ...f, committeeExpectation: e.target.value }))}
          />
          {errors.committeeExpectation && <p className="mt-1 text-xs text-red-300">{errors.committeeExpectation}</p>}
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-[#071229] p-4 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
            className="mt-1 size-4 rounded border-white/20 bg-transparent text-cyan-400 focus:ring-cyan-400/40"
          />
          <span>
            Autorizo el uso interno de la información suministrada por el comité, con fines de organización, articulación
            entre miembros y colaboración institucional, conforme a lo acordado por la coordinación.
          </span>
        </label>
        {errors.consent && <p className="text-xs text-red-300">{errors.consent}</p>}
      </section>

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
