import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/organisms/AppHeader";
import { AppFooter } from "@/components/organisms/AppFooter";
import { orbit, inter, orbitron, grandiflora } from "./font";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TypeSomething",
  description:
    "A lyric-based typing practice web app to improve typing speed and accuracy through music.",
  openGraph: {
    title: "TypeSomething",
    description:
      "노래 가사 타이핑 웹",
    url: "https://typesomething.vercel.app",
    siteName: "TypeSomething",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "TypeSomething - lyric typing web app",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TypeSomething",
    description:
      "Practice typing with song lyrics and track your typing performance.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${orbit.variable}
          ${inter.variable}
          ${orbitron.variable}
          ${grandiflora.variable}
          bg-neutral-100
          text-neutral-900
            antialiased
        `}
      >
       <Providers>
        <AppHeader />
          {/* <main className="min-h-screen flex items-center justify-center"> */}
          <main className="min-h-screen">
            {children}
          </main>
          {/* <AppFooter /> */}
       </Providers>
      </body>
    </html>
  );
}
