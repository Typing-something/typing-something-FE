import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageShellProps = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalPageShell({
  title,
  lastUpdated,
  children,
}: LegalPageShellProps) {
  return (
    <main className="min-h-screen bg-neutral-100 px-4 pb-16 pt-24">
      <article className="mx-auto w-full max-w-3xl">
        <Link
          href="/"
          className="text-xs text-neutral-500 transition-colors hover:text-neutral-900"
        >
          ← 홈으로
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-neutral-900">
          {title}
        </h1>
        <p className="mt-2 text-xs text-neutral-500">
          최종 수정일: {lastUpdated}
        </p>
        <div className="prose-neutral mt-10 space-y-8 text-sm leading-relaxed text-neutral-700">
          {children}
        </div>
      </article>
    </main>
  );
}
