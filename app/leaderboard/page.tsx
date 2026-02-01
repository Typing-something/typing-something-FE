// app/leaderboard/page.tsx
import { getRanking } from "@/lib/api/ranking";
import MyRankSideCardClient from "@/components/organisms/MyRankSideCardClient";
import LeaderboardList from "@/components/organisms/LeaderboardList";

export const revalidate = 600;

export default async function LeaderboardPage() {
  const ranking = await getRanking();

  const updatedAt = new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  });

  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mt-14 grid gap-6 md:grid-cols-[320px_1fr]">
          {/* 왼쪽: 클라에서만 결정 */}
          <aside className="hidden md:block">
            <div className="sticky top-[88px]">
              <MyRankSideCardClient ranking={ranking} />
            </div>
          </aside>

          <section className="min-w-0">
            <div className="border-b border-neutral-200">
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <div className="text-3xl font-semibold text-neutral-900">
                  Rankings
                </div>
                <div className="text-xs text-neutral-500">
                  <span>랭킹은 10분마다 갱신됩니다</span>
                  <span className="mx-1">·</span>
                  <span>최근 갱신: {updatedAt}</span>
                </div>
              </div>

              <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-neutral-200 bg-neutral-100 px-5 py-3 text-xs font-semibold text-neutral-500">
                <div className="w-10 text-center">#</div>
                <div className="h-10 w-10" />
                <div className="min-w-0 flex-1">Name</div>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-[72px] text-center">WPM</div>
                  <div className="w-[72px] text-center">ACC</div>
                  {/* TODO: 콤보 구현 후 주석 해제 */}
                  {/* <div className="w-[72px] text-center">Combo</div> */}
                </div>
              </div>

              <LeaderboardList ranking={ranking} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}