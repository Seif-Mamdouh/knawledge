import { NextAuthOptions, Profile } from "next-auth";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";
import { PrismaClient } from '@prisma/client';
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Create or update user in database
        await prisma.users.upsert({
          where: { email: user.email! },
          update: {
            name: user.name!,
            image: user.image!,
          },
          create: {
            email: user.email!,
            name: user.name!,
            image: user.image!,
          },
        });
        return true;
      } catch (error) {
        console.error('Error saving user:', error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return "/summary"
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};
