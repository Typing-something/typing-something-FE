import { NavLink } from "../atoms/NavLink";

const LEGAL_LINKS = [
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/terms", label: "이용약관" },
] as const;

export function FooterNav() {
  return (
    <nav
      className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1"
      style={{ fontFamily: "var(--font-orbit)" }}
      aria-label="Footer"
    >
      {LEGAL_LINKS.map(({ href, label }) => (
        <NavLink key={href} href={href}>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
