import { LogoutButton } from "@/components/atoms/LogoutButton"
import { Avatar } from "@/components/atoms/mypage/Avatar"
import { StatCard } from "./StatCard";
import { Me } from "@/types/me";
  export function MyProfileSection({ me }: { me: Me }) {
    return (
      <section className="mt-6 overflow-hidden border-neutral-200">
        {/* header */}
        <div className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
            {me.image ? (
                <img
                  src={me.image}
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
                <div className="flex space-x-2 items-center justify-center">
                  <div className="truncate text-lg font-semibold text-neutral-900">
                    {me.name}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-800">
                    {me.tier}
                  </div>
                </div>
                <div className="truncate text-sm text-neutral-500">{me.handle}</div>                
              </div>
            </div>
  
            <div className="flex flex-wrap gap-2">
              <button className="rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
                프로필 편집
              </button>
              <LogoutButton
                callbackUrl="/"
                className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                로그아웃
              </LogoutButton>
            </div>
          </div>
        </div>
  
        {/* divider */}
        <div className="h-px bg-neutral-200" />
  
        {/* stats header (스크린샷 느낌) */}
        <div className="p-5">
          <div className="flex items-center gap-3 text-neutral-900">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 11v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M19 8v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="text-lg font-black tracking-tight">STATS</div>
          </div>
  
          <div className="mt-6 text-sm font-semibold tracking-[0.18em] text-neutral-500">
            TYPING RECORDS
          </div>
  
          {/* 3 columns, spread */}
          <div className="mt-6 grid gap-10 lg:grid-cols-3">
            <StatCard
              label="ACC"
              sub="평균 정확도"
              value={
                me.avg_accuracy == null
                  ? "—"
                  : `${me.avg_accuracy.toFixed(1)}%`
              }
              accent="text-neutral-600"
            />
  
            <StatCard
              label="SESSIONS"
              sub="총 플레이 횟수"
              value={me.play_count ?? 0}
              accent="text-neutral-600"
            />
  
            <StatCard
              label="MAX COMBO"
              sub="최고 콤보"
              value={me.max_combo ?? 0}
              accent="text-neutral-600"
            />
          </div>
        </div>
  
        {/* bottom divider (원하면) */}
        <div className="h-px bg-neutral-200" />
      </section>
    );
  }