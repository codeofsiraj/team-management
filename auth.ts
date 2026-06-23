import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        const role = credentials?.role;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const users = await prisma.user.findMany({
          where: { email },
        });

        if (users.length === 0) {
          return null;
        }

        const matchingUsers = [];

        for (const user of users) {
          const passwordMatches = await bcrypt.compare(password, user.password);

          if (passwordMatches) {
            matchingUsers.push(user);
          }
        }

        if (matchingUsers.length === 0) {
          return null;
        }

        const user =
          typeof role === "string" && role
            ? matchingUsers.find((candidate) => candidate.role === role)
            : matchingUsers.length === 1
              ? matchingUsers[0]
              : null;

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const appUser = user as typeof user & { role?: string };

        token.id = user.id;
        token.role = appUser.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & {
          id?: string;
          role?: string;
        };

        sessionUser.id = token.id as string;
        sessionUser.role = token.role as string;
      }

      return session;
    },
  },
});
