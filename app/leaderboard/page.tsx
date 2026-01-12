// app/leaderboard/page.tsx
import { MyRankSideCard } from "@/components/organisms/MyRankSideCard";
import { authOptions } from "../api/auth/[...nextauth]/authOption";
import { getServerSession } from "next-auth";
import { getMe } from "@/lib/api/user";
import { getRanking } from "@/lib/api/ranking";
import { Leader } from "@/lib/api/ranking";
import { Row } from "@/components/organisms/LeaderboardRow";

export default async function LeaderboardPage() {
  const ranking = await getRanking(); // 로그인 여부와 무관
  
  const session = await getServerSession(authOptions);
  
    const userId = (session?.user as any)?.user_id;
    const me = userId ? await getMe(Number(userId)) : null;
  
    const myRank: Leader | null = me 
    ? {
      rank: 0, // TODO: 서버에서 내려주면 교체
      name: me.name,
      handle: me.handle,
      imageUrl: me.image ?? "imsi",
      wpm: 0, // TODO: 서버 통계 붙으면 교체
      accuracy: me.avg_accuracy ?? 0,
      combo: me.max_combo ?? 0,
    }
    : null;
    return (
      <main className="min-h-screen bg-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          {/* desktop layout */}
          <div
            className={[
              "mt-6 grid gap-6",
              myRank ? "md:grid-cols-[320px_1fr]" : "md:grid-cols-1",
            ].join(" ")}
          >
            {/* left (desktop only) - 로그인 했을 때만 아예 렌더 */}
            {myRank && (
              <aside className="hidden md:block">
                <div className="sticky top-[88px] mt-8">
                  <MyRankSideCard me={myRank} />
                </div>
              </aside>
            )}
    
            {/* right */}
            <section className="min-w-0">
              <div className="mt-6 border-b border-neutral-200">
                <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                  <div className="text-sm font-semibold text-neutral-900">
                    Rankings
                  </div>
                  <div className="text-xs text-neutral-500">Updated just now</div>
                </div>
    
                <ul className="divide-y divide-neutral-200">
                  {ranking.map((u) => (
                    <Row
                      key={u.rank}
                      u={u}
                      highlight={u.rank === (myRank?.rank ?? -1)}
                    />
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
    );
}