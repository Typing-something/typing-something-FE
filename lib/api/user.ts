import { Me } from "@/types/me";

type ApiMeResponse = {
  data: {
    account: {
      email: string;
      profile_pic: string | null;
      ranking_score: number;
      user_id: number;
      username: string;
    };
    stats: {
      avg_accuracy: number;
      avg_cpm: number;
      avg_wpm: number;
      best_cpm: number;
      best_wpm: number;
      max_combo: number;
      play_count: number;
    };
  } | null;
  error: any;
  success: boolean;
};
export async function getMe(userId: number): Promise<Me> {
  const base = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("API_BASE_URL env is missing");

  const res = await fetch(`${base}/user/profile/${userId}`, {
    cache: "no-store",
    headers: {
      "X-INTERNAL-KEY": process.env.INTERNAL_SYNC_KEY ?? "",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch profile: ${res.status}`);
  }

  const json: ApiMeResponse = await res.json();

  if (!json.success || !json.data) {
    throw new Error("API error");
  }

  const { account, stats } = json.data;

  return {
    name: account.username ?? "Unknown",
    handle: account.email ?? `user-${userId}`,
    tier: "Bronze",
    email: account.email,
    image: account.profile_pic ?? null,

    avg_accuracy: stats.avg_accuracy ?? null,
    max_combo: stats.max_combo ?? null,
    play_count: stats.play_count ?? null,
  };
}