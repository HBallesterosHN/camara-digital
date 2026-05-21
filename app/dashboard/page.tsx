import type { Metadata } from "next";

import { DatabaseUnavailable } from "@/components/database-unavailable";
import { DashboardView } from "@/components/dashboard-view";
import { assertActiveCommitteeMember } from "@/lib/assert-committee-page";
import { getDashboardStats } from "@/lib/dashboard-stats";
import { isPrismaDbUnreachable } from "@/lib/prisma-db-error";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  await assertActiveCommitteeMember("/dashboard");

  let stats;
  try {
    stats = await getDashboardStats();
  } catch (error) {
    if (isPrismaDbUnreachable(error)) {
      return (
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <DatabaseUnavailable sectionLabel="el panel ejecutivo" />
        </div>
      );
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Dashboard del comité</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Vista ejecutiva de la base de capacidades: radiografía territorial, concentración de experiencias y lecturas
          accionables para el coordinador. Los datos se actualizan con cada nuevo registro.
        </p>
      </div>
      <DashboardView stats={stats} />
    </div>
  );
}
