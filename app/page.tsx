import Image from "next/image";
import { SongTypeBoard } from "@/components/organisms/SongTypeBoard";
export type Song = {
  songId: number;
  title: string;
  artist: string;
  lyrice: string;
}

async function getSong(id: number): Promise<Song>{
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_POSTMAN_URL!;
  const res = await fetch(
    `${API_BASE_URL}`,
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
  const DUMMY_SONG: Song = {
    songId: 1,
    title: "Dummy Song",
    artist: "Test Artist",
    lyrice: "오늘도 나는 키보드를 두드린다. 오늘도 나는 키보드를 두드린다. 오늘도 나는 키보드를 두드린다",
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-100">
      <SongTypeBoard song={DUMMY_SONG}/>
    </div>
  );
}
