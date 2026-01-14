// lib/api/postFavorite.ts
export type PostFavoritePayload = {
  user_id: number;
  text_id: number;
};

// 서버가 is_favorite 안 주니 optional로 안전하게
export type PostFavoriteResponse = {
  success: boolean;
  message?: string;
  is_favorite?: boolean;
  error?: any;
};

export async function postFavorite(
  payload: PostFavoritePayload
): Promise<PostFavoriteResponse> {
  // CORS 없도록 Next.js route handler로 호출
  const res = await fetch("/api/text/favorite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const json = (await res.json().catch(() => null)) as PostFavoriteResponse | null;

  if (!res.ok) {
    throw new Error(
      (json as any)?.error?.message ??
        (json as any)?.message ??
        `Failed to toggle favorite: ${res.status}`
    );
  }

  if (!json?.success) {
    throw new Error(
      (json as any)?.error?.message ?? json?.message ?? "Failed to toggle favorite"
    );
  }

  return json;
}