import Link from "next/link";
// components/atoms/Logo.tsx
export function Logo() {
    return (
      <Link href="/">
        <div className="flex items-center gap-2">
            <div
              className="text-lg font-semibold tracking-wide"
            >
            TypeSomething
            <span className="font-extrabold text-xl text-[#fb4058] typing-cursor">
              |
            </span>
          </div>
        </div>
      </Link>
    );
  }