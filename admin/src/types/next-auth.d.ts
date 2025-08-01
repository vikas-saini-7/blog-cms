// types/next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      avatar?: string | null;
      isOnboarded: boolean;
      username?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    isOnboarded: boolean;
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    isOnboarded: boolean;
    username?: string;
  }
}
