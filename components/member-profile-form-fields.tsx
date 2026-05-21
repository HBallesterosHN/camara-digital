"use client";

import { CONTRIBUTION_TYPES, EXPERTISE_AREAS, HONDURAS_DEPARTMENTS } from "@/lib/constants";
import { getMunicipalitiesForDepartment } from "@/lib/honduras-municipalities";
import { formatHnWhatsappDisplay } from "@/lib/hn-whatsapp";
import type { MemberProfileFormState } from "@/lib/member-profile-form-types";
import { useMemo } from "react";

function toggle<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

const fieldClass =
  "mt-1 w-full rounded-xl border border-white/10 bg-[#071229] px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-400/35 focus-visible:outline-none";

type MemberProfileFormFieldsProps = {
  form: MemberProfileFormState;
  setForm: React.Dispatch<React.SetStateAction<MemberProfileFormState>>;
  errors: Record<string, string>;
  /** Si se define, el correo se muestra bloqueado (sesión). */
  lockedEmail?: string | null;
};

export function MemberProfileFormFields({ form, setForm, errors, lockedEmail }: MemberProfileFormFieldsProps) {
  const municipalityOptions = useMemo(() => getMunicipalitiesForDepartment(form.department), [form.department]);

  return (
    <>
      <section className="grid gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-2">
        <h2 className="text-lg font-semibold text-white sm:col-span-2">Datos generales</h2>
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
          {lockedEmail ? (
            <input type="email" className={`${fieldClass} cursor-not-allowed opacity-80`} value={lockedEmail} readOnly tabIndex={-1} />
          ) : (
            <input
              type="email"
              className={fieldClass}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          )}
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
            <option value="">{form.department ? "Seleccione municipio…" : "Primero seleccione departamento"}</option>
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
            <label
              key={a}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/5 bg-[#071229] px-3 py-2 text-sm text-slate-200 hover:border-cyan-400/30"
            >
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
            <label
              key={c}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/5 bg-[#071229] px-3 py-2 text-sm text-slate-200 hover:border-cyan-400/30"
            >
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
    </>
  );
}
