// components/molecules/HeaderNav.tsx
import { Logo } from "../atoms/Logo";
import { NavLink } from "../atoms/NavLink";

export function HeaderNav() {
  return (
    <nav 
      className="flex w-full items-center justify-between gap-6"
      style={{ fontFamily: "var(--font-orbit)" }}
    >
      <Logo />

      <div className="flex items-center gap-4 text-sm">
        <NavLink href="/leaderboard">Leaderboard</NavLink>
        <NavLink href="/my">MyPage</NavLink>
      </div>
    </nav>
  );
}