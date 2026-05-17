import Link from "next/link";

type AppFooterProps = {
  fixed?: boolean;
};

export function AppFooter({ fixed = false }: AppFooterProps) {
  return (
    <footer
      className={`${
        fixed ? "fixed inset-x-0 bottom-0 z-50" : ""
      } bg-neutral-100 text-neutral-500`}
    >
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 text-xs">
        <span>© 2026 Typing Something</span>
        <div>
          <Link
            href="https://github.com/Typing-something"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 transition-colors hover:text-neutral-900 hover:underline"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}