import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/login")) return true;
  if (pathname.startsWith("/unauthorized")) return true;
  if (pathname.startsWith("/api/auth")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico") return true;
  return false;
}

function isMemberPage(pathname: string): boolean {
  return (
    pathname.startsWith("/registro") ||
    pathname.startsWith("/directorio") ||
    pathname.startsWith("/dashboard")
  );
}

function isAdminPage(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

function isMembersApi(pathname: string): boolean {
  return pathname === "/api/members" || pathname.startsWith("/api/members/");
}

function isAdminApi(pathname: string): boolean {
  return pathname.startsWith("/api/admin");
}

function secureCookieFromRequest(req: NextRequest): boolean {
  return req.nextUrl.protocol === "https:";
}

function redirectToLogin(req: NextRequest): NextResponse {
  const signInUrl = new URL("/login", req.nextUrl.origin);
  signInUrl.searchParams.set("callbackUrl", `${req.nextUrl.pathname}${req.nextUrl.search}`);
  return NextResponse.redirect(signInUrl);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const needsCommittee =
    isMemberPage(pathname) || isMembersApi(pathname) || isAdminPage(pathname) || isAdminApi(pathname);

  if (!needsCommittee) {
    return NextResponse.next();
  }

  if (!secret) {
    if (isMembersApi(pathname) || isAdminApi(pathname)) {
      return NextResponse.json({ error: "Configuración de sesión incompleta" }, { status: 500 });
    }
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret,
    secureCookie: secureCookieFromRequest(req),
  });

  if (isMembersApi(pathname)) {
    if (!token?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    if (token.committeeAuthorized !== true) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (isAdminApi(pathname)) {
    if (!token?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    if (token.committeeAuthorized !== true) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    if (token.committeeRole !== "admin") {
      return NextResponse.json({ error: "Se requiere rol de administrador" }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (isMemberPage(pathname)) {
    if (!token?.email) {
      return redirectToLogin(req);
    }
    if (token.committeeAuthorized !== true) {
      return NextResponse.redirect(new URL("/unauthorized", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  if (isAdminPage(pathname)) {
    if (!token?.email) {
      return redirectToLogin(req);
    }
    if (token.committeeAuthorized !== true) {
      return NextResponse.redirect(new URL("/unauthorized", req.nextUrl.origin));
    }
    if (token.committeeRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
