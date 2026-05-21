"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

/** Cierra sesión si el usuario llegó aquí con cookie pero sin permiso de comité (p. ej. revocación). */
export function UnauthorizedSessionCleanup() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user?.committeeAuthorized === true) return;
    void signOut({ redirect: false });
  }, [session?.user?.committeeAuthorized, status]);

  return null;
}
