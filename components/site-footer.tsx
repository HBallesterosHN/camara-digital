export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#050c18] text-slate-400">
      <div className="border-b border-white/5 bg-[#060f1c] py-3 text-center">
        <p className="mx-auto max-w-4xl px-4 text-xs leading-relaxed text-slate-400 sm:text-sm">
          Prototipo funcional preparado como propuesta inicial para el Comité MIPYMES y Transformación Digital.
        </p>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-medium text-slate-200">Cámara de Comercio Digital de Honduras</p>
          <p className="mt-1 max-w-xl text-sm leading-relaxed">
            Mapa Digital del Comité MIPYMES y Transformación Digital — herramienta de organización interna del comité
            fundador.
          </p>
        </div>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} Prototipo institucional.</p>
      </div>
    </footer>
  );
}
