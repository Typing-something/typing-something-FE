import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // 이미 user_id 있으면 유지
      if ((token as any).user_id) return token;

      // 구글 로그인 콜백 시점에만 동기화
      if (account?.provider === "google") {
        if (!account.id_token) {
          console.error("google id_token missing");
          return token;
        }

        const res = await fetch(`${process.env.API_BASE_URL}/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${account.id_token}`,
            "X-INTERNAL-KEY": process.env.INTERNAL_SYNC_KEY!,
          },
          body: JSON.stringify({
            google_id: account.providerAccountId,
            email: token.email ?? user?.email ?? null,
            username: token.name ?? user?.name ?? null,
          }),
        });

        const data = await res.json();
        console.log("✅ /auth/google response:", data);

        // 핵심: 서버 응답이 data.data.user_id 형태
        const userId = data?.data?.user_id ?? data?.user_id;
        (token as any).user_id = userId;
      }

      return token;
    },

    async session({ session, token }) {
      (session.user as any).user_id = (token as any).user_id;
      return session;
    },
  },
};