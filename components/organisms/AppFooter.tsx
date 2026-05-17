import { FooterCopyright } from "../atoms/FooterCopyright";
import { FooterNav } from "../molecules/FooterNav";

type AppFooterProps = {
  fixed?: boolean;
};

export function AppFooter({ fixed = false }: AppFooterProps) {
  return (
    <footer
      className={`${
        fixed ? "fixed inset-x-0 bottom-0 z-50" : ""
      } border-t border-neutral-200/80 bg-neutral-100 text-neutral-500`}
    >
      <div className="mx-auto flex min-h-12 max-w-5xl flex-col items-center justify-between gap-2 px-4 py-3 sm:flex-row sm:gap-4 sm:py-0">
        <FooterCopyright />
        <FooterNav />
      </div>
    </footer>
  );
}
