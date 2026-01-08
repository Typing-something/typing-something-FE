import { Me } from "@/types/me";
export async function getMe(userId: number): Promise<Me> {
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
    avg_accuracy: json?.data?.stats?.avg_accuracy ?? null,
    max_combo: json?.data?.stats?.max_combo ?? null,
    play_count: json?.data?.stats?.play_count ?? null,
  };
}