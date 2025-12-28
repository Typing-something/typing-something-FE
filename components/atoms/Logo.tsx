import Link from "next/link";
// components/atoms/Logo.tsx
export function Logo() {
    return (
      <Link href="/">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-[#fb4058] to-[#fb576e]" />  
            <div
              className="text-lg font-semibold tracking-wide"
            >
            LyricType
            <span className="ml-0.5 font-bold text-lg text-[#fb4058] typing-cursor">
              |
            </span>
          </div>
        </div>
      </Link>
    );
  }