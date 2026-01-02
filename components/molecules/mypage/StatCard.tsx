  export function StatCard({
    label,
    value,
    sub,
    accent = "text-neutral-900",
  }: {
    label: string;
    value: React.ReactNode;
    sub?: string;
    accent?: string;
  }) {
    return (
      <div className="min-w-0">
        <div className={["text-sm font-semibold tracking-wide", accent].join(" ")}>
          {label}
        </div>
        {sub && <div className="mt-1 text-xs text-neutral-500">{sub}</div>}
  
        {/* big value */}
        <div className="mt-6 flex items-end justify-end">
          <div className="text-4xl tracking-tight text-neutral-900 tabular-nums">
            {value}
          </div>
        </div>
      </div>
    );
  }  
