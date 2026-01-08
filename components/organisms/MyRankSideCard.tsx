import { Avatar } from "../atoms/mypage/Avatar";
import { Leader } from "@/app/leaderboard/page";

export function MyRankSideCard({ me }: { me: Leader }) {
    return (
      <div className="border border-neutral-200 p-4 rounded-2xl bg-white">
        <div className="flex items-start justify-between">
          <div className="text-xs font-semibold text-neutral-500">MY RANK</div>
          <div className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-800 tabular-nums">
            #{me.rank}
          </div>
        </div>
  
        <div className="mt-4 flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
            {me.imageUrl ? (
                <img
                  src={me.imageUrl}
                  alt={me.name}
                  className="h-full w-full object-cover"
                />
            ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-neutral-500">
                        {me.name[0]}
                    </div>
                ) }          
            </div>
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-neutral-900">{me.name}</div>
            <div className="truncate text-sm text-neutral-500">{me.handle}</div>
          </div>
        </div>
  
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2">
            <div className="text-[11px] font-medium text-neutral-500">WPM</div>
            <div className="mt-0.5 text-sm font-semibold text-neutral-900 tabular-nums">{me.wpm}</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2">
            <div className="text-[11px] font-medium text-neutral-500">ACC</div>
            <div className="mt-0.5 text-sm font-semibold text-neutral-900 tabular-nums">{me.accuracy.toFixed(1)}%</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2">
            <div className="text-[11px] font-medium text-neutral-500">COMBO</div>
            <div className="mt-0.5 text-sm font-semibold text-neutral-900 tabular-nums">x{me.combo}</div>
          </div>
        </div>
  
        <button className="mt-5 w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800">
          내 기록 보기
        </button>
  
        <div className="mt-3 text-xs text-neutral-500">
          * 리더보드는 WPM/정확도/콤보를 종합해 정렬될 수 있어요.
        </div>
      </div>
    );
  }
  