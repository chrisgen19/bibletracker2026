import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
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

  return originalCreateUser({
    ...data,
    id: generateId(),
    firstName,
    lastName,
    image: data.image ?? null,
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
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, emailVerified: true, image: true, firstName: true },
        });

        if (existingUser) {
          const updates: Record<string, unknown> = {};

          if (!existingUser.emailVerified) {
            updates.emailVerified = new Date();
          }
          if (!existingUser.image && user.image) {
            updates.image = user.image;
          }

          if (Object.keys(updates).length > 0) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: updates,
            });
          }
        }
      }
      return true;
    },
  },
});
