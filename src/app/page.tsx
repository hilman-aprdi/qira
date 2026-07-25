import type { Metadata } from "next";
import { LandingPage } from "@/components/home/LandingPage";

export const metadata: Metadata = {
  title: "Qira — A simple Quran reading experience",
  description: "Baca Al-Qur'an, dengarkan murottal, dan pelajari tafsir melalui pengalaman membaca yang sederhana, tenang, dan nyaman.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <LandingPage />;
}
