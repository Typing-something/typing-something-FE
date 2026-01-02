import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // ✅ 로그인(구글 콜백) 시점에 token 만들 때 1번만 동기화하기 좋음
    async jwt({ token, user, account }) {
        if (account?.provider === "google" && !(token as any).synced) {
          if (!account.id_token) {
            console.error("google id_token missing");
            return token;
          }
      
          const payload = {
            google_id: account.providerAccountId,
            email: token.email ?? user?.email ?? null,
            username: token.name ?? user?.name ?? null,
          };
      
          try {
            const res = await fetch(`${process.env.API_BASE_URL}/auth/google`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${account.id_token}`,
                "X-INTERNAL-KEY": process.env.INTERNAL_SYNC_KEY!,
              },
              body: JSON.stringify(payload),
            });
      
            if (res.ok) {
              const data = await res.json();
                // console.log(data, ">>구글로그인 성공");
              (token as any).user_id = data.user_id;
              (token as any).synced = true; // ✅ 이 줄이 핵심
            } else {
              console.error("❌ /auth/google failed:", res.status, await res.text());
            }
          } catch (e) {
            console.error("❌ /auth/google error:", e);
          }
        }
      
        return token;
      },

    async session({ session, token }) {
      // 필요하면 프론트에서 user_id 쓰게 넣어주기
      (session.user as any).user_id = (token as any).user_id;
      return session;
    },
  },
};