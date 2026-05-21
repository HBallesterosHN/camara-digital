import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { NextResponse } from "next/server";

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/api/auth")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico") return true;
  return false;
}

function requiresAuthentication(pathname: string): boolean {
  return (
    pathname.startsWith("/registro") ||
    pathname.startsWith("/directorio") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/members") ||
    pathname.startsWith("/api/admin")
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ request, auth: session }) {
      const { pathname } = request.nextUrl;

      if (isPublicPath(pathname)) return true;
      if (!requiresAuthentication(pathname)) return true;

      if (session?.user) return true;

      const signInUrl = new URL("/login", request.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(signInUrl);
    },
  },
});
