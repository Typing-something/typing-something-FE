import { SongTypeBoard } from "@/components/organisms/SongTypeBoard";
import { Song } from "@/types/song";

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

async function getSongs(): Promise<Song[]> {
  const API_BASE_URL = `${process.env.API_BASE_URL}/text/main/10`;
  console.log("머임", API_BASE_URL)

  const res = await fetch(API_BASE_URL, { cache: "no-store" });

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
  }));
}
export default async function Home() {
  const songs = await getSongs();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-100">
      <SongTypeBoard songs={songs}/>
    </div>
  );
}
