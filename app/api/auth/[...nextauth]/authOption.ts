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
      // user_id + is_admin 이미 있으면 재요청 안 함
      if (
        (token as any).user_id != null &&
        (token as any).is_admin != null
      ) {
        return token;
      }

      // 구글 로그인 콜백 시점
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

        const json = await res.json();
        console.log("✅ /auth/google response:", json);

        const userId =
          json?.data?.user_id ??
          json?.user_id ??
          null;

        // 핵심: indinfo → is_admin 매핑
        const isAdmin =
          json?.data?.is_admin ??
          json?.data?.indinfo ??
          json?.is_admin ??
          false;

        (token as any).user_id = userId;
        (token as any).is_admin = isAdmin;
      }

      return token;
    },

    async session({ session, token }) {
      (session.user as any).user_id = (token as any).user_id;
      (session.user as any).is_admin = (token as any).is_admin ?? false;
      return session;
    },
  },
};