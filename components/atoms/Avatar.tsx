function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "h-10 w-10" : "h-12 w-12";
  return (
    <div className={`relative ${cls} overflow-hidden rounded-full border border-neutral-200 bg-neutral-100`}>
      <div className="absolute inset-0 grid place-items-center text-xs font-semibold text-neutral-600">
        {name.slice(0, 1)}
      </div>
    </div>
  );
}