"use client";

type Result = { wpm: number; cpm: number; acc: number };

export function ResultModal({
  open,
  result,
  onClose,
}: {
  open: boolean;
  result: Result | null;
  onClose: () => void;
}) {
  if (!open || !result) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="text-lg font-semibold">결과</div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>WPM</span>
            <b>{result.wpm}</b>
          </div>
          <div className="flex justify-between">
            <span>CPM</span>
            <b>{result.cpm}</b>
          </div>
          <div className="flex justify-between">
            <span>ACC</span>
            <b>{result.acc}%</b>
          </div>
        </div>

        <button
          className="mt-6 w-full rounded-lg bg-neutral-900 py-2 text-white"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
}