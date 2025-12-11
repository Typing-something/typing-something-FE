// components/atoms/Logo.tsx
export function Logo() {
    return (
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-teal-400 to-emerald-300" />
        <span className="text-sm font-semibold tracking-tight">
          Typing&nbsp;<span className="text-teal-300">Something</span>
        </span>
      </div>
    );
  }