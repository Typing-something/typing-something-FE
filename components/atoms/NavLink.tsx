// components/atoms/NavLink.tsx
import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  external?: boolean;
};

export function NavLink({ href, children, external }: Props) {
  const base =
    "text-xs font-medium text-neutral-300 hover:text-teal-300 transition-colors";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={base}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={base}>
      {children}
    </Link>
  );
}