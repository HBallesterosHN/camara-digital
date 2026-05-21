import type { Metadata } from "next";

import { DatabaseUnavailable } from "@/components/database-unavailable";
import { DirectoryClient } from "@/components/directory-client";
import { assertActiveCommitteeMember } from "@/lib/assert-committee-page";
import { sortMembersForDirectoryDisplay } from "@/lib/member-directory-sort";
import { toPublicMember } from "@/lib/member-mapper";
import { isPrismaDbUnreachable } from "@/lib/prisma-db-error";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Directorio",
};

export default async function DirectorioPage() {
  await assertActiveCommitteeMember("/directorio");

  let membersRaw;
  try {
    membersRaw = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    if (isPrismaDbUnreachable(error)) {
      return (
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <DatabaseUnavailable sectionLabel="el directorio" />
        </div>
      );
    }
    throw error;
  }
  const members = sortMembersForDirectoryDisplay(membersRaw);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">Uso interno del comité</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Directorio de capacidades</h1>
        <p className="mt-3 text-slate-400">
          Vista para coordinación del Comité MIPYMES y Transformación Digital: ubicación, experiencia y modalidades de
          aporte. Utilice filtros para localizar perfiles alineados a la agenda de trabajo.
        </p>
      </div>
      <DirectoryClient initialMembers={members.map(toPublicMember)} />
    </div>
  );
}
