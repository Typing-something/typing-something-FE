// components/molecules/HeaderNav.tsx
"use client"
import { useEffect } from "react";
import { Logo } from "../atoms/Logo";
import { NavLink } from "../atoms/NavLink";
import { useSession } from "next-auth/react";

export function HeaderNav() {
  const {data: session} = useSession();
  const isAdmin = Boolean((session?.user as any)?.is_admin);
  
  return (
    <nav 
      className="flex w-full items-center justify-between gap-6"
      style={{ fontFamily: "var(--font-orbit)" }}
    >
      <Logo />

      <div className="flex items-center gap-8 text-sm">
        {isAdmin && <NavLink href="/admin">Admin</NavLink>}
        <NavLink href="/leaderboard">Leaderboard</NavLink>
        <NavLink href="/my">MyPage</NavLink>
      </div> 
    </nav>
  );
}