// components/organisms/MyRankSideCardClient.tsx
"use client";

import { useSession } from "next-auth/react";
import { MyRankSideCard } from "@/components/organisms/MyRankSideCard";
import { Leader } from "@/types/leaderboard";

export default function MyRankSideCardClient({ ranking }: { ranking: Leader[] }) {
  const { data } = useSession();
  const userId = (data?.user as any)?.user_id;

  if (!userId) return null;

  const me = ranking.find((u) => u.userId === userId);
  if (!me) return null;

  return (
    <aside className="hidden md:block w-[320px] shrink-0">
      <div className="sticky top-[88px]">
        <MyRankSideCard me={me} />
      </div>
    </aside>
  );
}