"use client";

import { FontSize } from "@/stores/useTypingSetting";

type Props = {
  value: FontSize;
  onChange: (size: FontSize) => void;
};

export function FontSizeSelector({ value, onChange }: Props) {
  const button = (size: FontSize, withRightBorder?: boolean) => (
    <button
      type="button"
      onClick={() => onChange(size)}
      className={[
        "py-3 text-sm",
        withRightBorder ? "border-r border-neutral-300" : "",
        value === size
          ? "bg-black text-white"
          : "bg-white text-black hover:bg-neutral-50",
      ].join(" ")}
    >
      {size}
    </button>
  );

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-wider text-neutral-500">
          FONT SIZE
        </h3>
        <span className="text-sm text-neutral-700">{value}</span>
      </div>

      <div className="grid grid-cols-3 border border-neutral-300">
        {button("sm", true)}
        {button("md", true)}
        {button("lg")}
      </div>
    </section>
  );
}