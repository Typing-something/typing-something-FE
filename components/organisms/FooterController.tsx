"use client";

import { usePathname } from "next/navigation";
import { AppFooter } from "./AppFooter";

export function FooterController() {
  const pathname = usePathname();
  return <AppFooter fixed={pathname === "/"} />;
}
