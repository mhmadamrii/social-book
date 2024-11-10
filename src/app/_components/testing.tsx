import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db"; // Adjust path to your db instance
import bcrypt from "bcryptjs"; // Make sure to install bcryptjs if using it for password hashing

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "next-auth",
      name: "Login with email",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Your username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Find the user by username
          const user = await db.user.findFirst({
            where: {
              username: credentials.username,
            },
          });

          // If user doesn't exist or password is incorrect, return null
          if (
            !user ||
            !bcrypt.compareSync(credentials.password, user.password)
          ) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: async ({ session, token }) => {
      // Pass user ID to session
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
