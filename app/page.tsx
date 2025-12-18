import Image from "next/image";
import { SongTypeBoard } from "@/components/organisms/SongTypeBoard";
export type Song = {
  songId: number;
  title: string;
  artist: string;
  lyrics: string;
}
async function getSong(id: number): Promise<Song>{
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(
    `${API_BASE_URL}/api/songs/${id}`,
    {
      // 개발 중엔 매번 새로 가져오고 싶으면:
      cache: "no-store",
    }
  )
  if(!res.ok){
    throw new Error("Failed to fetch song");
  }
  return res.json();
}
export default async function Home() {
  const song = await getSong(1);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-100">
      <SongTypeBoard song={song}/>
    </div>
  );
}
