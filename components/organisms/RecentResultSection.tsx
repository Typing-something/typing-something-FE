import { SessionRow } from "../molecules/mypage/SessionRow"
import { RecentSession } from "@/app/my/page"
export function RecentResultSection({recentResults}: {recentResults: RecentSession[]}){
    return (
         <div className="min-w-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <div className="text-sm font-semibold text-neutral-900">최근 타이핑 기록</div>
                <button className="text-xs font-semibold text-neutral-600 hover:text-neutral-900">
                    전체 보기
                </button>
            </div>
            <ul className="divide-y divide-neutral-200">
                {recentResults.map((s) => (
                    <SessionRow key={s.resultId} s={s} />
                ))}
            </ul>
        </div>      
    )
}