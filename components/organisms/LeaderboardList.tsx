"use client";

import { useSession } from "next-auth/react";
import { Leader } from "@/types/leaderboard";
import { Row } from "./LeaderboardRow";

export default function LeaderboardList({ ranking }: { ranking: Leader[] }) {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.user_id;

  return (
    <ul className="divide-y divide-neutral-200">
      {ranking.map((u) => (
        <Row key={u.userId} u={u} highlight={u.userId === userId} />
      ))}
    </ul>
  );
}
