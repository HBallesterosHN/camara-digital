"use client";

import Link from "next/link";
import { startTransition, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { MemberProfileFormFields } from "@/components/member-profile-form-fields";
import { formatHnWhatsappDisplay, normalizeHnWhatsappForStorage } from "@/lib/hn-whatsapp";
import { emptyMemberProfileFormState, type MemberProfileFormState } from "@/lib/member-profile-form-types";
import { validateMemberProfileFormState } from "@/lib/member-profile-validate-client";

type ApiMember = {
  id: string;
  fullName: string;
  company: string;
  position: string;
  email: string;
  whatsapp: string;
  department: string;
  municipality: string;
  linkedin: string | null;
  website: string | null;
  expertiseAreas: string[];
  contributionTypes: string[];
  professionalSummary: string;
  committeeContribution: string;
  committeeExpectation: string;
  consent: boolean;
};

function memberToFormState(m: ApiMember, sessionEmail: string): MemberProfileFormState {
  return {
    fullName: m.fullName,
    company: m.company,
    position: m.position,
    email: sessionEmail,
    whatsapp: formatHnWhatsappDisplay(m.whatsapp),
    department: m.department,
    municipality: m.municipality,
    linkedin: m.linkedin ?? "",
    website: m.website ?? "",
    expertiseAreas: [...m.expertiseAreas],
    contributionTypes: [...m.contributionTypes],
    professionalSummary: m.professionalSummary,
    committeeContribution: m.committeeContribution,
    committeeExpectation: m.committeeExpectation,
    consent: m.consent,
  };
}

type MiPerfilFormProps = {
  sessionEmail: string;
};

export function MiPerfilForm({ sessionEmail }: MiPerfilFormProps) {
  const [form, setForm] = useState<MemberProfileFormState>(() =>
    emptyMemberProfileFormState({ email: sessionEmail }),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    try {
      const res = await fetch("/api/me/member");
      const data = (await res.json()) as { member?: ApiMember | null; error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo cargar el perfil.");
        return;
      }
      if (data.member) {
        setForm(memberToFormState(data.member, sessionEmail));
        setHasProfile(true);
      } else {
        setForm(emptyMemberProfileFormState({ email: sessionEmail }));
        setHasProfile(false);
      }
    } catch {
      toast.error("Error de red al cargar el perfil.");
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, [sessionEmail]);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  function validate(): boolean {
    const e = validateMemberProfileFormState(form, { fixedEmail: sessionEmail });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/me/member", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          company: form.company.trim(),
          position: form.position.trim(),
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
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "No se pudo guardar.");
        return;
      }
      toast.success(hasProfile ? "Perfil actualizado correctamente." : "Perfil creado correctamente.");
      setHasProfile(true);
      await load({ silent: true });
    } catch {
      toast.error("Error de red.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8" aria-busy="true">
        <div className="h-6 w-48 animate-pulse rounded bg-white/10" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-white/[0.06]" />
          ))}
        </div>
        <p className="text-center text-sm text-slate-500">Cargando su perfil…</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 sm:px-6">
        <p className="text-sm text-slate-300">
          {hasProfile ? (
            <>
              Está editando su perfil del comité. Los cambios se reflejan en el <strong className="text-white">directorio</strong> y
              el <strong className="text-white">dashboard</strong>.
            </>
          ) : (
            <>
              Aún no tiene perfil en el mapa de capacidades. Complete el formulario para crearlo; el correo coincide con su
              sesión de Google y no se puede cambiar aquí.
            </>
          )}
        </p>
      </div>

      {errors._form && (
        <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">{errors._form}</div>
      )}

      <MemberProfileFormFields form={form} setForm={setForm} errors={errors} lockedEmail={sessionEmail} />

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[44px] min-w-[200px] items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Guardando…" : hasProfile ? "Guardar cambios" : "Crear perfil"}
        </button>
        <Link
          href="/directorio"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 active:scale-[0.98]"
        >
          Ver directorio
        </Link>
      </div>
    </form>
  );
}
