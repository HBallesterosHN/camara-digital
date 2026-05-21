import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { auth } from "@/auth";
import { AuthProvider } from "@/components/auth-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Mapa Digital del Comité MIPYMES y Transformación Digital",
    template: "%s | Cámara Digital Honduras",
  },
  description:
    "Plataforma para mapear miembros del comité fundador de la Cámara de Comercio Digital de Honduras: ubicación, experiencia y capacidades de aporte.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="es" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body
        className="min-h-full bg-[var(--ccd-bg)] font-sans text-slate-100 antialiased"
        suppressHydrationWarning
      >
        <AuthProvider session={session}>
          <div className="flex min-h-full flex-col">
            <SiteHeader />
            <main className="min-h-0 min-w-0 flex-1">{children}</main>
            <SiteFooter />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
