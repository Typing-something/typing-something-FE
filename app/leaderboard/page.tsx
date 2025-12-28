// app/leaderboard/page.tsx
import React from "react";

type Leader = {
  rank: number;
  name: string;
  handle: string;
  wpm: number;
  accuracy: number; // 0~100
  combo: number;
};

const top3: Leader[] = [
  { rank: 1, name: "MinSung", handle: "@minsung", wpm: 128, accuracy: 98.4, combo: 42 },
  { rank: 2, name: "JungMin", handle: "@jungmin", wpm: 121, accuracy: 97.1, combo: 31 },
  { rank: 3, name: "Hyun", handle: "@hyun", wpm: 118, accuracy: 96.7, combo: 27 },
];

const rest: Leader[] = Array.from({ length: 20 }).map((_, i) => {
  const rank = i + 4;
  return {
    rank,
    name: `User ${rank}`,
    handle: `@user${rank}`,
    wpm: 112 - i,
    accuracy: Math.max(90, 96 - i * 0.2),
    combo: Math.max(3, 25 - i),
  };
});

// 내 랭킹(더미)
const myRank: Leader = { rank: 17, name: "You", handle: "@me", wpm: 104, accuracy: 94.3, combo: 18 };

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

/** 데스크탑 왼쪽 사이드에 두는 My Rank 카드(가리지 않음 + sticky) */
function MyRankSideCard({ me }: { me: Leader }) {
  return (
    <div className="border border-neutral-200 p-4 rounded-2xl bg-white">
      <div className="flex items-start justify-between">
        <div className="text-xs font-semibold text-neutral-500">MY RANK</div>
        <div className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-800 tabular-nums">
          #{me.rank}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Avatar name={me.name} />
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-neutral-900">{me.name}</div>
          <div className="truncate text-sm text-neutral-500">{me.handle}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2">
          <div className="text-[11px] font-medium text-neutral-500">WPM</div>
          <div className="mt-0.5 text-sm font-semibold text-neutral-900 tabular-nums">{me.wpm}</div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2">
          <div className="text-[11px] font-medium text-neutral-500">ACC</div>
          <div className="mt-0.5 text-sm font-semibold text-neutral-900 tabular-nums">{me.accuracy.toFixed(1)}%</div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2">
          <div className="text-[11px] font-medium text-neutral-500">COMBO</div>
          <div className="mt-0.5 text-sm font-semibold text-neutral-900 tabular-nums">x{me.combo}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] text-neutral-500">
          <span>Accuracy</span>
          <span className="tabular-nums">{me.accuracy.toFixed(1)}%</span>
        </div>
        <ProgressBar value={me.accuracy} />
      </div>

      <button className="mt-5 w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800">
        내 기록 보기
      </button>

      <div className="mt-3 text-xs text-neutral-500">
        * 리더보드는 WPM/정확도/콤보를 종합해 정렬될 수 있어요.
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

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        {/* mobile my rank */}
        <div className="mt-6">
          <MyRankMobileCard me={myRank} />
        </div>

        {/* desktop layout: left my-rank + right content */}
        <div className="mt-6 grid gap-6 md:grid-cols-[320px_1fr]">
          {/* left (desktop only) */}
          <aside className="hidden md:block">
            <div className="sticky top-6">
              <MyRankSideCard me={myRank} />
            </div>
          </aside>

          {/* right */}
          <section className="min-w-0">
            {/* podium (compact) */}
            <div className="grid gap-3 md:grid-cols-3">
              <CompactPodiumCard leader={top3[1]} />
              <CompactPodiumCard leader={top3[0]} emphasize />
              <CompactPodiumCard leader={top3[2]} />
            </div>

            {/* list */}
            <div className="mt-6 border-b border-neutral-200">
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <div className="text-sm font-semibold text-neutral-900">Rankings</div>
                <div className="text-xs text-neutral-500">Updated just now</div>
              </div>

              <ul className="divide-y divide-neutral-200">
                {rest.map((u) => (
                  <Row key={u.rank} u={u} highlight={u.rank === myRank.rank} />
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}