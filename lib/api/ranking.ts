// lib/api/ranking.ts
import type { GetRankingResponse } from "@/types/ranking";

export type Leader = {
  rank: number;
  name: string;
  handle: string;
  imageUrl: string;
  wpm: number;
  accuracy: number;
  combo: number;
};

export async function getRanking(): Promise<Leader[]> {
  const res = await fetch(`${process.env.API_BASE_URL}/user/ranking`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Failed to fetch ranking: ${res.status}`);

  const json: GetRankingResponse = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch ranking");

  return (json.data ?? []).map((item) => {
    const name = item.account.username;
    const handle = `@user${item.account.user_id}`; // 서버에 handle 없으니 일단 이렇게
    const imageUrl = item.account.profile_pic || "imsi";

    return {
      rank: item.rank,
      name,
      handle,
      imageUrl,
      wpm: item.stats.avg_wpm,        // 평균 WPM을 쓰는 게 자연스러움 (원하면 best_wpm으로 바꿔도 됨)
      accuracy: item.stats.avg_accuracy,
      combo: item.stats.max_combo,
    };
  });
}