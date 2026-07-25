import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Bookmark, Clock3, Home } from "lucide-react";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Qira — A simple Quran reading experience",
  description: "Baca Al-Qur'an, dengarkan murottal, dan pelajari tafsir melalui pengalaman membaca yang sederhana dan nyaman.",
  alternates: { canonical: "/" },
  openGraph: { title: "Qira — A simple Quran reading experience", description: "Baca Al-Qur'an dengan nyaman.", url: absoluteUrl(), siteName: "Qira", type: "website" },
  twitter: { card: "summary", title: "Qira — A simple Quran reading experience", description: "Baca Al-Qur'an dengan nyaman." },
  icons: { icon: "/assets/brand/qira-icon.png" },
  verification: { google: "rAX9eRjgxEfjxaZJyxE_ZX9bYupHul2wmpNmcNR4jg4" },
};

const nav = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/quran", label: "Quran", Icon: BookOpen },
  { href: "/prayer-times", label: "Shalat", Icon: Clock3 },
  { href: "/bookmarks", label: "Bookmarks", Icon: Bookmark },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: "Qira", url: SITE_URL },
      { "@type": "WebApplication", name: "Qira", url: SITE_URL, applicationCategory: "EducationalApplication", operatingSystem: "Web", description: "A simple Quran reading experience." },
    ],
  };

  return (
    <html lang="id">
      <body className={`${inter.variable} ${arabic.variable}`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-[var(--blue)] focus:shadow-lg">Lewati ke konten utama</a>
        <header className="border-b border-[var(--border)] bg-white/90 backdrop-blur md:fixed md:inset-x-0 md:top-0 md:z-40">
          <div className="container flex h-20 items-center justify-between">
            <Link href="/" aria-label="Qira home"><Image src="/assets/brand/qira-logo.png" alt="Qira" width={131} height={72} className="h-10 w-auto object-contain" sizes="131px" /></Link>
            <nav aria-label="Navigasi utama" className="hidden gap-7 text-sm font-semibold text-[var(--muted)] md:flex">{nav.map(({ href, label }) => <Link key={href} href={href} className="transition-colors hover:text-[var(--blue)]">{label}</Link>)}</nav>
          </div>
        </header>
        <main id="main-content" className="pb-24 md:pb-10 md:pt-20">{children}</main>
        <Footer />
        <nav aria-label="Navigasi utama mobile" className="site-mobile-nav fixed inset-x-0 bottom-0 z-20 border-t border-[var(--border)] bg-white/95 px-6 py-3 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-md justify-around">{nav.map(({ href, label, Icon }) => <Link key={href} href={href} className="flex min-h-11 flex-col items-center justify-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-[var(--blue)]"><Icon size={21} strokeWidth={1.8} aria-hidden="true" />{label}</Link>)}</div>
        </nav>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
