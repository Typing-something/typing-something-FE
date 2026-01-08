// app/leaderboard/page.tsx
import { MyRankSideCard } from "@/components/organisms/MyRankSideCard";
import { authOptions } from "../api/auth/[...nextauth]/authOption";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getMe } from "@/lib/api/user";

export type Leader = {
  rank: number;
  name: string;
  handle: string;
  imageUrl: string | null;
  wpm: number;
  accuracy: number; // 0~100
  combo: number;
};

const rest: Leader[] = Array.from({ length: 20 }).map((_, i) => {
  const rank = i + 1;
  return {
    rank,
    name: `User ${rank}`,
    handle: `@user${rank}`,
    imageUrl: 'imsi',
    wpm: 112 - i,
    accuracy: Math.max(90, 96 - i * 0.2),
    combo: Math.max(3, 25 - i),
  };
});
// 내 랭킹(더미)
// const myRank: Leader = { rank: 17, name: "You", handle: "@me", wpm: 104, accuracy: 94.3, combo: 18 };

function Crown() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M4 19h16M5 17l2-9 5 5 5-5 2 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 8.5a1.2 1.2 0 1 0 0-.01M12 13.5a1.2 1.2 0 1 0 0-.01M17 8.5a1.2 1.2 0 1 0 0-.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Medal({ rank }: { rank: number }) {
  const label = rank === 1 ? "Champion" : rank === 2 ? "Runner-up" : "3rd Place";
  const badge =
    rank === 1
      ? "border-yellow-200 bg-yellow-50 text-yellow-900"
      : rank === 2
        ? "border-neutral-200 bg-neutral-50 text-neutral-800"
        : "border-amber-200 bg-amber-50 text-amber-900";

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${badge}`}>
      <span className="grid h-5 w-5 place-items-center rounded-full border border-black/10 bg-white/70">
        {rank}
      </span>
      {rank === 1 && <Crown />}
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
      <div className="h-full rounded-full bg-neutral-900" style={{ width: `${v}%` }} />
    </div>
  );
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "h-10 w-10" : "h-12 w-12";
  return (
    <div className={`relative ${cls} overflow-hidden rounded-full border border-neutral-200 bg-neutral-100`}>
      <div className="absolute inset-0 grid place-items-center text-xs font-semibold text-neutral-600">
        {name.slice(0, 1)}
      </div>
    </div>
  );
}

/** Top3를 “덜 차지”하도록 버튼 제거 + stats 한 줄 압축 */
function CompactPodiumCard({ leader, emphasize }: { leader: Leader; emphasize?: boolean }) {
  const isFirst = leader.rank === 1;

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4",
        emphasize ? "ring-2 ring-neutral-900/10" : "",
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute -top-20 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full blur-3xl",
          isFirst ? "bg-yellow-400/15" : "bg-neutral-900/5",
        ].join(" ")}
      />

      <div className="flex items-center justify-between">
        <Medal rank={leader.rank} />
        {isFirst && (
          <div className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-[11px] font-semibold text-yellow-900">
            Weekly #1
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Avatar name={leader.name} size="sm" />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-neutral-900">{leader.name}</div>
          <div className="truncate text-xs text-neutral-500">{leader.handle}</div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-800 tabular-nums">
        {leader.wpm} WPM · {leader.accuracy.toFixed(1)}% · x{leader.combo}
      </div>
    </div>
  );
}

/** 모바일에서는 왼쪽 사이드가 없으니, 위쪽에 “일반 카드”로 한 번만 보여주기 */
function MyRankMobileCard({ me }: { me: Leader }) {
  return (
    <div className="border-b border-neutral-200 md:hidden">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-neutral-900">내 랭킹</div>
        <div className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-800 tabular-nums">
          #{me.rank}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Avatar name={me.name} size="sm" />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-neutral-900">{me.name}</div>
          <div className="truncate text-xs text-neutral-500">{me.handle}</div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-800 tabular-nums">
        {me.wpm} WPM · {me.accuracy.toFixed(1)}% · x{me.combo}
      </div>
    </div>
  );
}

function Row({ u, highlight }: { u: Leader; highlight?: boolean }) {
    return (
      <li
        className={[
          "flex items-center gap-4 px-5 py-4",
          highlight
            ? "ring-3 ring-[#fb4058]/40"
            : "hover:bg-neutral-50",
        ].join(" ")}
      >
        <div
          className={[
            "w-10 text-center text-sm font-semibold tabular-nums",
            "text-neutral-700",
          ].join(" ")}
        >
          {u.rank}
        </div>
  
        <div
          className={[
            "relative h-10 w-10 overflow-hidden rounded-full border",
            highlight
              ? "border-[#fb4058]/30 bg-white"
              : "border-neutral-200 bg-neutral-100",
          ].join(" ")}
        >
          <div className="absolute inset-0 grid place-items-center text-xs font-semibold text-neutral-600">
            {u.name.slice(0, 1)}
          </div>
        </div>
  
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-neutral-900">
            {u.name}
          </div>
          <div className="truncate text-xs text-neutral-500">
            {u.handle}
          </div>
        </div>
  
        <div className="hidden sm:flex items-center gap-2">
          <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold tabular-nums text-neutral-800">
            {u.wpm} WPM
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold tabular-nums text-neutral-800">
            {u.accuracy.toFixed(1)}%
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold tabular-nums text-neutral-800">
            x{u.combo}
          </div>
        </div>
  
        <button
          className="ml-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          보기
        </button>
      </li>
    );
}

export default async function LeaderboardPage() {
    const session = await getServerSession(authOptions);
  
    const userId = (session?.user as any)?.user_id;
    const me = await getMe(Number(userId));
  
    const myRank: Leader | null = me 
    ? {
      rank: 0, // TODO: 서버에서 내려주면 교체
      name: me.name,
      handle: me.handle,
      imageUrl: me.image,
      wpm: 0, // TODO: 서버 통계 붙으면 교체
      accuracy: me.avg_accuracy ?? 0,
      combo: me.max_combo ?? 0,
    }
    : null;
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        {/* mobile my rank */}
        <div className="mt-6">
          {myRank && (<MyRankMobileCard me={myRank} />)}
        </div>

        {/* desktop layout: left my-rank + right content */}
        <div className="mt-6 grid gap-6 md:grid-cols-[320px_1fr]">
          {/* left (desktop only) */}
          <aside className="hidden md:block">
            <div className="sticky top-[88px]">
              {myRank && (<MyRankSideCard me={myRank} />)}
            </div>
          </aside>

          {/* right */}
          <section className="min-w-0">
            {/* list */}
            <div className="mt-6 border-b border-neutral-200">
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <div className="text-sm font-semibold text-neutral-900">Rankings</div>
                <div className="text-xs text-neutral-500">Updated just now</div>
              </div>

              <ul className="divide-y divide-neutral-200">
                {rest.map((u) => (
                  <Row key={u.rank} u={u} highlight={u.rank === (myRank?.rank ?? -1)} />
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}