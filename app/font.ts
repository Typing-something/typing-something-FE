// app/fonts.ts
import { Orbit, Inter, Orbitron, Grandiflora_One } from "next/font/google";

export const orbit = Orbit({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-orbit",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
export const orbitron = Orbitron({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    variable: "--font-orbitron",
  });

  export const grandiflora = Grandiflora_One({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-grandiflora",
  });