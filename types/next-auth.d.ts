import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      committeeAuthorized?: boolean;
      committeeRole?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    committeeAuthorized?: boolean;
    committeeRole?: string | null;
  }
}
