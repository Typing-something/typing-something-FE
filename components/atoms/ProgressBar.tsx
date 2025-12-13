"use client";

type Props = {
  value: number; // 0~100
};

export function ProgressBar({ value }: Props) {
  return (
    <div className="h-0.5 w-full overflow-hidden rounded-full bg-neutral-200">
      <div className="h-full bg-neutral-900 transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}