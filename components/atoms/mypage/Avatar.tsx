export function Avatar({ name }: { name: string }) {
  return (
    <div className="relative h-14 w-14 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
      <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-neutral-600">
        {name.slice(0, 1)}
      </div>
    </div>
  );
}