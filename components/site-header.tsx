import Link from "next/link";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/registro", label: "Registro" },
  { href: "/directorio", label: "Directorio" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071229]/90 backdrop-blur-md">
      <div className="mx-auto flex min-w-0 max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
            CD
          </span>
          <span className="hidden text-sm font-semibold leading-tight text-white sm:block">
            CCD Honduras
            <span className="block text-[11px] font-normal text-slate-400">Comercio Digital</span>
          </span>
        </Link>
        <nav className="flex min-w-0 flex-1 justify-end overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-none [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-nowrap items-center gap-0.5 sm:gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 active:scale-[0.98] sm:px-3 sm:text-sm"
            >
              {item.label}
            </Link>
          ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
