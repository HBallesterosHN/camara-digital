import Link from "next/link";

import { auth, signOut } from "@/auth";
import { BrandMark } from "@/components/brand-mark";

const memberNav = [
  { href: "/mi-perfil", label: "Mi perfil" },
  { href: "/registro", label: "Registro" },
  { href: "/directorio", label: "Directorio" },
  { href: "/dashboard", label: "Dashboard" },
];

const linkClass =
  "shrink-0 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ccd-orange)]/60 active:scale-[0.98] sm:px-3 sm:text-sm";

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;
  const authorized = user?.committeeAuthorized === true;
  const isAdmin = user?.committeeRole === "admin";

  const badgeLabel = isAdmin ? "Admin" : "Miembro autorizado";
  const badgeClass = isAdmin
    ? "border-violet-400/40 bg-violet-500/15 text-violet-100"
    : "border-cyan-400/35 bg-cyan-500/10 text-cyan-100";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--ccd-surface)]/92 backdrop-blur-md">
      <div className="mx-auto flex min-w-0 max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-2.5">
          <BrandMark />
          <span className="hidden min-w-0 text-sm font-semibold leading-tight text-white sm:block">
            CCD Honduras
            <span className="block text-[11px] font-normal text-slate-400">Comercio Digital</span>
          </span>
        </Link>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
          <nav className="flex min-w-0 flex-1 justify-end overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-none [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-nowrap items-center gap-0.5 sm:gap-1">
              <Link href="/" className={linkClass}>
                Inicio
              </Link>
              {authorized ? (
                <>
                  {memberNav.map((item) => (
                    <Link key={item.href} href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  ))}
                  {isAdmin ? (
                    <Link href="/admin" className={linkClass}>
                      Admin
                    </Link>
                  ) : null}
                </>
              ) : user ? (
                <span className="shrink-0 rounded-lg px-2.5 py-2 text-xs text-amber-200/90 sm:text-sm">
                  Sesión sin acceso al comité
                </span>
              ) : (
                <Link
                  href="/login"
                  className="shrink-0 rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#5b21b6] px-3 py-2 text-xs font-semibold text-white shadow-md shadow-violet-900/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ccd-orange)]/70 active:scale-[0.98] sm:text-sm"
                >
                  Acceder
                </Link>
              )}
            </div>
          </nav>
          {user ? (
            <div className="hidden shrink-0 items-center gap-2 border-l border-white/10 pl-3 sm:flex">
              <div className="max-w-[11rem] truncate text-right text-[11px] leading-tight text-slate-400">
                {user.name && <span className="block truncate font-medium text-slate-200">{user.name}</span>}
                {user.email && <span className="block truncate">{user.email}</span>}
              </div>
              {authorized ? (
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:text-[11px] ${badgeClass}`}
                >
                  {badgeLabel}
                </span>
              ) : null}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ccd-orange)]/50"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
      {user ? (
        <div className="border-t border-white/5 bg-black/20 px-4 py-2 sm:hidden">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-slate-400">
                <span className="font-medium text-slate-300">{user.name ?? "Sesión"}</span>
                {user.email ? <span className="block truncate text-slate-500">{user.email}</span> : null}
              </p>
              {authorized ? (
                <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${badgeClass}`}>
                  {badgeLabel}
                </span>
              ) : null}
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="shrink-0 rounded-lg border border-white/15 px-2 py-1 text-xs font-medium text-slate-200"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </header>
  );
}
