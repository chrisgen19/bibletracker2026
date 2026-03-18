import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";
import { authConfig } from "@/lib/auth.config";
import { generateId } from "@/lib/ulid";
import { env } from "@/env";

const adapter = PrismaAdapter(prisma);

const originalCreateUser = adapter.createUser!.bind(adapter);
adapter.createUser = async (data) => {
  const nameParts = data.name?.split(" ") ?? [];
  const firstName = nameParts[0] || "User";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Safe to set emailVerified here — signIn callback runs first and
  // rejects Google profiles where email_verified is false
  return originalCreateUser({
    ...data,
    id: generateId(),
    firstName,
    lastName,
    image: data.image ?? null,
    emailVerified: new Date(),
  } as typeof data);
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter,
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: { params: { prompt: "select_account" } },
    }),
    Facebook({
      clientId: env.AUTH_FACEBOOK_ID,
      clientSecret: env.AUTH_FACEBOOK_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          parsed.data.password,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Reject if Google says the email is not verified
        if (!profile?.email_verified) {
          return false;
        }

        if (user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true, emailVerified: true, image: true, password: true },
          });

          if (dbUser) {
            // Reject linking to unverified credentials accounts
            if (!dbUser.emailVerified && dbUser.password) {
              return "/login?error=OAuthAccountNotLinked";
            }

            // Backfill profile image
            if (!dbUser.image && user.image) {
              await prisma.user.update({
                where: { id: dbUser.id },
                data: { image: user.image },
              });
            }
          }
        }
      }

      if (account?.provider === "facebook") {
        // Facebook only returns email if user has a verified email on FB
        if (!profile?.email) {
          return false;
        }

        if (user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true, emailVerified: true, image: true, password: true },
          });

          if (dbUser) {
            // Reject linking to unverified credentials accounts
            if (!dbUser.emailVerified && dbUser.password) {
              return "/login?error=OAuthAccountNotLinked";
            }

            // Backfill profile image
            if (!dbUser.image && user.image) {
              await prisma.user.update({
                where: { id: dbUser.id },
                data: { image: user.image },
              });
            }
          }
        }
      }

      return true;
    },
  },
});
