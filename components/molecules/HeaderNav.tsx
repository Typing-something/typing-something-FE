// components/molecules/HeaderNav.tsx
import { Logo } from "../atoms/Logo";
import { NavLink } from "../atoms/NavLink";

export function HeaderNav() {
  return (
    <nav className="flex w-full items-center justify-between gap-6">
      <Logo />

      <div className="flex items-center gap-4 text-sm">
        <NavLink href="/">Playground</NavLink>
        <NavLink href="/snippets">Snippets</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="https://github.com/..." external>
          GitHub
        </NavLink>
      </div>
    </nav>
  );
}