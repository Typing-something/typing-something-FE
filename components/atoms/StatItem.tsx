"use client";

type Props = {
  label: string;
  value: number | string;
};

export function StatItem({ label, value }: Props) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[10px] text-neutral-400">{label}</span>
      <span className="font-semibold text-neutral-900">{value}</span>
    </div>
  );
}