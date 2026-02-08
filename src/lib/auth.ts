import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";
import { authConfig } from "@/lib/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[AUTH] Authorize called with:", { email: credentials?.email });

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          console.log("[AUTH] Validation failed:", parsed.error.flatten());
          return null;
        }

        console.log("[AUTH] Looking for user:", parsed.data.email);
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user) {
          console.log("[AUTH] User not found");
          return null;
        }

        if (!user.password) {
          console.log("[AUTH] User has no password");
          return null;
        }

        console.log("[AUTH] User found, comparing password");
        const isValidPassword = await bcrypt.compare(
          parsed.data.password,
          user.password
        );

        if (!isValidPassword) {
          console.log("[AUTH] Password invalid");
          return null;
        }

        console.log("[AUTH] Login successful for:", user.email);
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
        };
      },
    }),
  ],
});
