import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { MiPerfilForm } from "@/components/mi-perfil-form";
import { assertActiveCommitteeMember } from "@/lib/assert-committee-page";
import { normalizeCommitteeEmail } from "@/lib/committee-access";

export const metadata: Metadata = {
  title: "Mi perfil",
};

export default async function MiPerfilPage() {
  const { session } = await assertActiveCommitteeMember("/mi-perfil");
  const sessionEmail = normalizeCommitteeEmail(session.user?.email ?? null);
  if (!sessionEmail) {
    redirect("/login?callbackUrl=/mi-perfil");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Área privada del comité</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Mi perfil</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Cree o actualice su ficha en el mapa de capacidades: datos visibles para coordinación en directorio y tableros
          analíticos. El correo se toma de su cuenta de Google.
        </p>
      </div>
      <MiPerfilForm sessionEmail={sessionEmail} />
    </div>
  );
}
