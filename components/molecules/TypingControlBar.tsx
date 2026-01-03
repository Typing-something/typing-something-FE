import { IconButton } from "../atoms/IconButton";

type Props = {
  onReset?: () => void;
  onNext?: () => void;
  disableNext?: boolean;
};

export default function TypingControlBar({
  onReset,
  onNext,
  disableNext,
}: Props) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-3">
        <IconButton ariaLabel="처음으로" variant="ghost" onClick={onReset}>
          {/* refresh svg 그대로 */}
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
            <path d="M19.146 4.854l-1.489 1.489A8 8 0 1 0 12 20a8.094 8.094 0 0 0 7.371-4.886 1 1 0 1 0-1.842-.779A6.071 6.071 0 0 1 12 18a6 6 0 1 1 4.243-10.243l-1.39 1.39a.5.5 0 0 0 .354.854H19.5A.5.5 0 0 0 20 9.5V5.207a.5.5 0 0 0-.854-.353z" />
          </svg>
        </IconButton>

        <div className="flex items-center gap-2">
          <IconButton
            ariaLabel="다음"
            variant="ghost"
            onClick={onNext}
            disabled={disableNext}
          >
            <svg viewBox="0 0 20 20" className="size-5" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </IconButton>
        </div>
      </div>
    </div>
  );
}