// components/atoms/Logo.tsx
export function Logo() {
    return (
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-teal-400 to-emerald-300" />
        <div
          className="text-lg font-semibold tracking-wide"
        >
          LyricType<span className="ml-0.5 font-bold text-lg text-teal-400 typing-cursor">|</span>
        </div>
      </div>
    );
  }