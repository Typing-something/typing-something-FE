import Image from "next/image";
import { SongTypeBoard } from "@/components/organisms/SongTypeBoard";
export type Song = {
  songId: number;
  title: string;
  artist: string;
  lyrice: string;
}
async function getSong(id: number): Promise<Song>{
  const res = await fetch(
    `https://a19711ac-539e-40c0-a306-e3b41b1fdd35.mock.pstmn.io/songs/${id}`,
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
