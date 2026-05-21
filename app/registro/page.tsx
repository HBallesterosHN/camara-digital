import type { Metadata } from "next";

import { RegistrationForm } from "@/components/registration-form";
import { assertActiveCommitteeMember } from "@/lib/assert-committee-page";

export const metadata: Metadata = {
  title: "Registro de perfil",
};

export default async function RegistroPage() {
  await assertActiveCommitteeMember("/registro");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Registro de perfil</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Formulario para incorporar datos al mapa de capacidades del comité. Los campos marcados con * son obligatorios.
        </p>
      </div>
      <div className="mb-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/[0.08] to-transparent px-5 py-4 sm:px-6">
        <p className="text-sm leading-relaxed text-slate-200">
          Este formulario construye una <span className="font-medium text-white">base interna de capacidades</span> del
          comité: ubicación, experiencia y modalidades de aporte. La información se destina a la organización y la
          colaboración del Comité MIPYMES y Transformación Digital de la{" "}
          <span className="text-cyan-100/90">Cámara de Comercio Digital de Honduras</span>, en los términos del aviso de
          consentimiento al final del formulario.
        </p>
      </div>
      <RegistrationForm />
    </div>
  );
}
