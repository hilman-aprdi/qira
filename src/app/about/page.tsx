import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tentang Qira — Qira",
  description: "Kenali Qira, aplikasi membaca Al-Qur'an yang sederhana, tenang, dan nyaman.",
  alternates: { canonical: "/about" },
  openGraph: { title: "Tentang Qira — Qira", description: "Kenali Qira, aplikasi membaca Al-Qur'an yang sederhana, tenang, dan nyaman.", url: absoluteUrl("/about"), type: "website" },
};

export default function AboutPage() {
  return <div className="container py-10 sm:py-16"><article className="mx-auto max-w-3xl"><p className="text-sm font-bold uppercase tracking-[.18em] text-[var(--blue)]">Tentang Qira</p><h1 className="mt-3 text-3xl font-bold sm:text-4xl">Membaca Al-Qur&apos;an dengan lebih tenang.</h1><p className="mt-5 text-base leading-8 text-[var(--muted)]">Qira adalah aplikasi web untuk membantu menghadirkan pengalaman membaca Al-Qur&apos;an yang sederhana, nyaman, dan bebas dari gangguan yang tidak perlu.</p><div className="mt-10 grid gap-4 sm:grid-cols-3"><section className="card p-5"><h2 className="font-bold">Baca</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Teks Arab, transliterasi, dan terjemahan Indonesia dalam satu ruang baca.</p></section><section className="card p-5"><h2 className="font-bold">Dengarkan</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Nikmati audio surah dan ayat dengan pilihan qari yang tersedia.</p></section><section className="card p-5"><h2 className="font-bold">Pahami</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Buka tafsir untuk membaca penjelasan ayat dalam konteksnya.</p></section></div><section className="card mt-8 bg-[var(--soft)] p-6 sm:p-8"><h2 className="text-xl font-bold">Prinsip Qira</h2><p className="mt-3 leading-8 text-[var(--muted)]">Qira dirancang untuk mendukung kebiasaan membaca tanpa tekanan. Tidak ada streak, kompetisi, atau target yang memaksa. Cukup buka, baca satu ayat, dan lanjutkan dengan tenang.</p></section></article></div>;
}
