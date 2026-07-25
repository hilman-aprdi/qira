import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getSurah } from "@/lib/api/quran";
import { ReaderClient } from "@/components/quran/ReaderClient";
import { absoluteUrl } from "@/lib/site";

function parseSurahNumber(value: string) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 114 ? number : null;
}

export async function generateMetadata({ params }: { params: Promise<{ surah: string }> }): Promise<Metadata> {
  const { surah } = await params;
  const number = parseSurahNumber(surah);
  if (!number) return { title: "Surah tidak ditemukan — Qira", robots: { index: false, follow: true } };
  const data = await getSurah(number);
  const title = `${data.namaLatin} — Qira`;
  const description = `Baca Surah ${data.namaLatin} lengkap dengan teks Arab, transliterasi, terjemahan Indonesia, audio, dan tafsir di Qira.`;
  return { title, description, alternates: { canonical: `/quran/${number}` }, openGraph: { title, description, url: absoluteUrl(`/quran/${number}`), type: "article" } };
}

export default async function SurahPage({ params }: { params: Promise<{ surah: string }> }) {
  const { surah } = await params;
  const number = parseSurahNumber(surah);
  if (!number) notFound();
  const data = await getSurah(number);
  return <div className="container py-6 sm:py-10"><div className="mx-auto max-w-3xl"><div className="surah-toolbar"><Link href="/quran" className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--blue)]"><ArrowLeft size={18}/>Kembali</Link></div><section className="surah-hero card relative mt-6 overflow-hidden bg-[var(--soft)] p-7 sm:p-10"><p className="text-xs font-bold tracking-[.2em] text-[var(--blue)]">SURAH</p><h1 className="mt-3 text-3xl font-bold">{data.namaLatin}</h1><p lang="ar" dir="rtl" className="arabic mt-2 text-3xl text-[var(--blue)]">{data.nama}</p><p className="mt-4 text-sm text-[var(--muted)]">{data.arti} <span aria-hidden="true">•</span> {data.jumlahAyat} Ayat <span aria-hidden="true">•</span> {data.tempatTurun}</p><p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--muted)]">{data.deskripsi.replace(/<[^>]*>/g, "")}</p><Link href={`/tafsir/${data.nomor}`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--blue)] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#3D70E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)] focus-visible:ring-offset-2"><BookOpen size={17} aria-hidden="true" />Baca Tafsir</Link></section><ReaderClient surah={data}/></div></div>;
}
