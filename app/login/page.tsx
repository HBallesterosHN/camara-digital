import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { LoginPanel } from "@/components/login-panel";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Acceso institucional",
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-20">
      <Suspense fallback={<LoginSkeleton />}>
        <LoginPanel />
      </Suspense>
    </div>
  );
}

function LoginSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-3xl border border-white/10 bg-[var(--ccd-surface)]/60" aria-hidden />
  );
}
