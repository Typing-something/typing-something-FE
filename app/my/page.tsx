// app/my/page.tsx
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/authOption";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { MyProfileSection } from "@/components/molecules/mypage/MyProfileSection";
import type { Me } from "@/components/molecules/mypage/MyProfileSection";
type Session = {
  id: string;
  songTitle: string;
  artist: string;
  playedAt: string; // e.g. "2025-12-28 14:10"
  wpm: number;
  accuracy: number;
  combo: number;
  durationSec: number;
};

type Achievement = {
  id: string;
  title: string;
  desc: string;
  progress: number; // 0~100
  earned: boolean;
  earnedAt?: string;
};

const me = {
  name: "You",
  handle: "@me",
  tier: "Silver",
  bestWpm: 132,
  bestAccuracy: 99.1,
  totalSessions: 84,
  totalPlayTimeMin: 312,
};

const sessions: Session[] = [
  { id: "s1", songTitle: "으르렁", artist: "엑소", playedAt: "2025-12-28 14:10", wpm: 104, accuracy: 94.3, combo: 18, durationSec: 92 },
  { id: "s2", songTitle: "Ditto", artist: "NewJeans", playedAt: "2025-12-27 22:31", wpm: 112, accuracy: 96.8, combo: 25, durationSec: 88 },
  { id: "s3", songTitle: "밤편지", artist: "아이유", playedAt: "2025-12-26 19:04", wpm: 98, accuracy: 97.5, combo: 31, durationSec: 105 },
  { id: "s4", songTitle: "Next Level", artist: "aespa", playedAt: "2025-12-25 23:12", wpm: 120, accuracy: 95.2, combo: 22, durationSec: 80 },
  { id: "s5", songTitle: "Hype Boy", artist: "NewJeans", playedAt: "2025-12-25 10:49", wpm: 109, accuracy: 93.8, combo: 16, durationSec: 90 },
];

const achievements: Achievement[] = [
  { id: "a1", title: "첫 플레이", desc: "첫 타이핑 세션 완료", progress: 100, earned: true, earnedAt: "2025-12-01" },
  { id: "a2", title: "정확도 장인", desc: "정확도 98% 이상 달성", progress: 70, earned: false },
  { id: "a3", title: "스피드 러너", desc: "WPM 120 이상 달성", progress: 100, earned: true, earnedAt: "2025-12-25" },
  { id: "a4", title: "콤보 마스터", desc: "최대 콤보 x50 달성", progress: 36, earned: false },
  { id: "a5", title: "꾸준함", desc: "연속 7일 플레이", progress: 57, earned: false },
  { id: "a6", title: "백전노장", desc: "누적 100회 플레이", progress: 84, earned: false },
];

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
      <div className="h-full rounded-full bg-neutral-900" style={{ width: `${v}%` }} />
    </div>
  );
}



function StatCard({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="border-b border-neutral-200 p-4">
      <div className="text-xs font-semibold text-neutral-500">{label}</div>
      <div className="mt-2 text-2xl font-bold text-neutral-900 tabular-nums">{value}</div>
      {sub && <div className="mt-1 text-xs text-neutral-500">{sub}</div>}
    </div>
  );
}

function SessionRow({ s }: { s: Session }) {
  const mm = Math.floor(s.durationSec / 60);
  const ss = s.durationSec % 60;
  const duration = `${mm}:${String(ss).padStart(2, "0")}`;

  return (
    <li className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50">
      <div className="w-14 text-center text-sm font-semibold text-neutral-700 tabular-nums">{/* rank placeholder */}</div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-neutral-900">
          {s.songTitle} <span className="text-neutral-400">·</span> {s.artist}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <span>{s.playedAt}</span>
          <span className="text-neutral-300">•</span>
          <span>{duration}</span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold tabular-nums text-neutral-800">
          {s.wpm} WPM
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold tabular-nums text-neutral-800">
          {s.accuracy.toFixed(1)}%
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold tabular-nums text-neutral-800">
          x{s.combo}
        </div>
      </div>

      <button className="ml-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">
        상세
      </button>
    </li>
  );
}

function AchievementCard({ a }: { a: Achievement }) {
    const accent = a.earned ? "#fb4058" : undefined;
  return (
    <div
      className={[
        "border border-neutral-200 p-4",
        a.earned ? "ring-2 ring-[#fb4058]/30" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-neutral-900">{a.title}</div>
          <div className="mt-1 text-xs text-neutral-500">{a.desc}</div>
        </div>

        <div
          className={[
            "shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold",
            a.earned
            ? "border-[#fb4058] text-[#fb4058]"
            : "border-neutral-200 bg-white text-neutral-600",
            ].join(" ")}
        >
          {a.earned ? "획득" : `${a.progress}%`}
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar value={a.progress} />
        <div className="mt-2 text-[11px] text-neutral-500">
          {a.earned ? `획득일: ${a.earnedAt}` : "진행 중"}
        </div>
      </div>
    </div>
  );
}

async function getMe(userId: number): Promise<Me> {
  const res = await fetch(`${process.env.API_BASE_URL}/user/profile/${userId}`, {
    cache: "no-store",
    headers: {
      // 서버가 내부키 요구하면 유지
      "X-INTERNAL-KEY": process.env.INTERNAL_SYNC_KEY!,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch profile: ${res.status}`);
  }

  const json = await res.json();

  return {
    name: json?.data?.username ?? "Unknown",
    handle: json?.data?.email ?? `user-${userId}`,
    tier: json?.data?.tier ?? "Bronze",
    email: json?.data?.email,
    image: json?.data?.profile_pic ?? null,
    avg_accuracy: json?.data?.avg_accuracy ?? null,
    max_combo: json?.data?.max_combo ?? null,
    play_count: json?.data?.play_count ?? null,
  };
}
export default async function MyPage() {
  const session = await getServerSession(authOptions);
  if(!session) {
    redirect("/login?callbackUrl=/mypage");
  }
  const userId = (session.user as any)?.user_id;
  if (!userId) redirect("/login?callbackUrl=/mypage");

  const me = await getMe(Number(userId));
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        {/* header */}
        {/* <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">My Page</h1>
          <p className="text-sm text-neutral-600">내 기록과 업적을 확인해요.</p>
        </div> */}

        {/* profile */}
       <MyProfileSection me={me}/>

        {/* content grid */}
        <section className="mt-12 grid gap-6 md:grid-cols-[1fr_360px]">
          {/* left: sessions */}
          <div className="min-w-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <div className="text-sm font-semibold text-neutral-900">최근 타이핑 기록</div>
              <button className="text-xs font-semibold text-neutral-600 hover:text-neutral-900">
                전체 보기
              </button>
            </div>

            <ul className="divide-y divide-neutral-200">
              {sessions.map((s) => (
                <SessionRow key={s.id} s={s} />
              ))}
            </ul>
          </div>

          {/* right: achievements */}
          <aside className="min-w-0">
            <div className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <div className="text-sm font-semibold text-neutral-900">업적</div>
                <div className="text-xs text-neutral-500">{achievements.filter(a => a.earned).length} / {achievements.length}</div>
              </div>

              <div className="grid gap-3 p-4">
                {achievements.slice(0, 6).map((a) => (
                  <AchievementCard key={a.id} a={a} />
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}