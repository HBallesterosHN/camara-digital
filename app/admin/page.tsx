import { AdminPanel } from "@/components/admin-panel";
import { assertActiveCommitteeAdmin } from "@/lib/assert-committee-page";

export default async function AdminPage() {
  await assertActiveCommitteeAdmin("/admin");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Panel administrativo</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Gestión de accesos al área privada y revisión de registros del comité. Requiere inicio de sesión con Google y
          rol de administrador asignado en la base de datos.
        </p>
      </div>
      <AdminPanel />
    </div>
  );
}
