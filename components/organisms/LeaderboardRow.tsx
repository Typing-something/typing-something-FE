import { Leader } from "@/types/leaderboard";
import { ProfileAvatar } from "@/components/atoms/ProfileAvatar";
export function Row({ u, highlight }: { u: Leader; highlight?: boolean }) {
    return (
      <li
        className={[
          "relative flex items-center gap-4 px-5 py-4",
          highlight ? "bg-neutral-50" : "",
        ].join(" ")}
      >
        {highlight && (
          <div className="absolute left-0 top-0 h-full w-[3px] bg-[#fb4058]/50" />
        )}
        <div
          className={[
            "w-10 text-center text-sm font-semibold tabular-nums",
            "text-neutral-700",
          ].join(" ")}
        >
          {u.rank}
        </div>
  
        <ProfileAvatar src={u.imageUrl} alt={u.handle} />
  
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 truncate text-sm font-semibold text-neutral-900">
            {u.name}
            {highlight && (
              <span className="rounded bg-[#fb4058]/70 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                ME
              </span>
            )}
          </div>
          <div className="truncate text-xs text-neutral-500">
            {u.handle}
          </div>
        </div>
  
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-[72px] px-3 py-2 text-center text-xs font-semibold tabular-nums text-neutral-800">
            {u.wpm}
          </div>
          <div className="w-[72px] px-3 py-2 text-center text-xs font-semibold tabular-nums text-neutral-800">
            {u.accuracy.toFixed(1)}%
          </div>
          {/* TODO: 콤보 구현 후 주석 해제 */}
          {/* <div className="w-[72px] rounded-xl border border-neutral-200 bg-white px-3 py-2 text-center text-xs font-semibold tabular-nums text-neutral-800">
            x{u.combo}
          </div> */}
        </div>
      </li>
    );
}
