import { Leader } from "@/lib/api/ranking";
export function Row({ u, highlight }: { u: Leader; highlight?: boolean }) {
    return (
      <li
        className={[
          "flex items-center gap-4 px-5 py-4",
          highlight
            ? "ring-3 ring-[#fb4058]/40"
            : "hover:bg-neutral-50",
        ].join(" ")}
      >
        <div
          className={[
            "w-10 text-center text-sm font-semibold tabular-nums",
            "text-neutral-700",
          ].join(" ")}
        >
          {u.rank}
        </div>
  
        <div
          className={[
            "relative h-10 w-10 overflow-hidden rounded-full border",
            highlight
              ? "border-[#fb4058]/30 bg-white"
              : "border-neutral-200 bg-neutral-100",
          ].join(" ")}
        >
          <div className="absolute inset-0 grid place-items-center text-xs font-semibold text-neutral-600">
            <img src={u.imageUrl} alt={u.handle}/>
          </div>
        </div>
  
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-neutral-900">
            {u.name}
          </div>
          <div className="truncate text-xs text-neutral-500">
            {u.handle}
          </div>
        </div>
  
        <div className="hidden sm:flex items-center gap-2">
          <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold tabular-nums text-neutral-800">
            {u.wpm} WPM
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold tabular-nums text-neutral-800">
            {u.accuracy.toFixed(1)}%
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold tabular-nums text-neutral-800">
            x{u.combo}
          </div>
        </div>
  
        <button
          className="ml-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          보기
        </button>
      </li>
    );
}
