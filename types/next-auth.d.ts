import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      user_id: number; // 또는 string (서버가 뭘 주는지에 맞춰)
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}