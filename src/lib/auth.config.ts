import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified ?? null;
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      // Allow refreshing emailVerified status from session update
      if (trigger === "update" && session?.emailVerified !== undefined) {
        token.emailVerified = session.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      session.user.emailVerified = (token.emailVerified as Date) ?? null;
      return session;
    },
  },
} satisfies NextAuthConfig;
