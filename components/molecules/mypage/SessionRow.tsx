import { RecentSession } from "@/app/my/page";
export function SessionRow({ s }: { s: RecentSession }) {

  return (
    <li className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50">
      {/* cover */}
      <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
        {s.imageUrl ? (
          <img
            src={s.imageUrl}
            alt={s.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-neutral-200" />
        )}
      </div>      
      {/* text */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-neutral-900">
          {s.title} <span className="text-neutral-400">·</span> {s.author}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <span>{s.playedAt}</span>
        </div>
      </div>
      {/* stats */}
      <div className="hidden sm:flex items-center gap-2">
        <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold tabular-nums text-neutral-800">
          {s.wpm} WPM
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold tabular-nums text-neutral-800">
          {s.accuracy.toFixed(1)}%
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold tabular-nums text-neutral-800">
          x{s.combo}
        </div>
      </div>
      {/* action */}
      <button className="ml-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">
        상세
      </button>
    </li>
  );
}
