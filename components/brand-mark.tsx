import fs from "node:fs";
import path from "node:path";

import Image from "next/image";

type BrandMarkProps = {
  className?: string;
};

/**
 * Marca visual CCD: usa `/logo-camara.png` si existe en `public/`; si no, marca SVG institucional.
 */
export function BrandMark({ className = "" }: BrandMarkProps) {
  const logoPath = path.join(process.cwd(), "public", "logo-camara.png");
  const hasLogo = fs.existsSync(logoPath);

  if (hasLogo) {
    return (
      <span className={`relative block h-9 w-9 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/15 ${className}`}>
        <Image
          src="/logo-camara.png"
          alt="Cámara de Comercio Digital de Honduras"
          width={36}
          height={36}
          className="object-contain"
          priority
        />
      </span>
    );
  }

  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e3a8a] via-[#5b21b6] to-[#ea580c] shadow-lg shadow-violet-950/40 ring-1 ring-white/20 ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 22V10l6 6-6 6zm10-12h10v4H16v-4zm0 6h8v4h-8v-4z"
          fill="currentColor"
          opacity="0.95"
        />
      </svg>
    </span>
  );
}
