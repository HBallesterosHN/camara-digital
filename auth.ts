import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { findAllowedUserRecord, normalizeCommitteeEmail } from "@/lib/committee-access";
import { prisma } from "@/lib/prisma";

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
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
    updateAge: 60 * 15,
  },
  callbacks: {
    async signIn({ user }) {
      const email = normalizeCommitteeEmail(user.email);
      if (!email) return "/unauthorized";
      const row = await prisma.allowedUser.findUnique({ where: { email } });
      if (!row?.isActive) return "/unauthorized";
      return true;
    },
    async jwt({ token, user }) {
      const email = normalizeCommitteeEmail(user?.email ?? (typeof token.email === "string" ? token.email : null));
      if (!email) {
        token.committeeAuthorized = false;
        token.committeeRole = null;
        return token;
      }
      const row = await findAllowedUserRecord(email);
      token.email = email;
      token.committeeAuthorized = !!(row?.isActive);
      token.committeeRole = row?.isActive ? row.role : null;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.committeeAuthorized = token.committeeAuthorized === true;
        session.user.committeeRole =
          typeof token.committeeRole === "string" && token.committeeRole.length > 0 ? token.committeeRole : null;
      }
      return session;
    },
  },
});
