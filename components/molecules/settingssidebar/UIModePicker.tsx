"use client";

export type UIMode = "default" | "manuscript" | "music";

const OPTIONS: { value: UIMode; label: string; disabled?: boolean }[] = [
  { value: "default", label: "기본" },
  { value: "manuscript", label: "Manuscript (원고지)" },
  { value: "music", label: "Music Player" },
];

type Props = {
  value: UIMode;
  onChange: (mode: UIMode) => void;
};

export function UIModePicker({ value, onChange }: Props) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold tracking-wider text-neutral-500">
        UI MODE
      </h3>

      <div className="space-y-2">
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={[
              "flex items-center gap-3",
              opt.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
            ].join(" ")}
          >
            <input
              type="radio"
              name="ui-mode"
              className="accent-black"
              checked={value === opt.value}
              disabled={opt.disabled}
              onChange={() => onChange(opt.value)}
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
    </section>
  );
}