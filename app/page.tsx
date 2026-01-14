import { SongTypeBoard } from "@/components/organisms/SongTypeBoard";
import { Song } from "@/types/song";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOption";

type ApiSong = {
  id: number;
  title: string;
  author: string;
  content: string;
  genre: string;
  image_url: string;
  is_favorite: boolean;
};

type ApiResponse<T> = {
  data: T;
  success: boolean;
  message: string;
  //error: string | null;
};

async function getSongs(userId?: number): Promise<Song[]> {
  const base = process.env.API_BASE_URL;
  if (!base) throw new Error("API_BASE_URL missing");

  const url = new URL("/text/main/10", base);

  // 로그인한 경우만 user_id 전달
  if (userId) {
    url.searchParams.set("user_id", String(userId));
  }

  const res = await fetch(url.toString(), { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch songs");
  }

  const json: ApiResponse<ApiSong[]> = await res.json();

  if (!json.success) {
    throw new Error(json.message ?? "API error");
  }

  return json.data.map((item) => ({
    songId: item.id,
    title: item.title,
    artist: item.author,
    lyric: item.content,
    imageUrl: item.image_url,
    isFavorite: item.is_favorite, // 로그인 X면 항상 false
  }));
}
export default async function Home() {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.user_id
  ? Number(session.user.user_id)
  : undefined;

  const songs = await getSongs(userId);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-100">
      <SongTypeBoard songs={songs}/>
    </div>
  );
}
