import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTafsir } from "@/lib/api/quran";
import { absoluteUrl } from "@/lib/site";

function parseSurahNumber(value: string) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 114 ? number : null;
}

export async function generateMetadata({ params }: { params: Promise<{ surah: string }> }): Promise<Metadata> {
  const { surah } = await params;
  const number = parseSurahNumber(surah);
  if (!number) return { title: "Tafsir tidak ditemukan — Qira", robots: { index: false, follow: true } };
  const data = await getTafsir(number);
  const title = `Tafsir ${data.namaLatin} — Qira`;
  const description = `Baca tafsir Surah ${data.namaLatin} per ayat dalam Bahasa Indonesia di Qira.`;
  return { title, description, alternates: { canonical: `/tafsir/${number}` }, openGraph: { title, description, url: absoluteUrl(`/tafsir/${number}`), type: "article" } };
}

export default async function TafsirPage({ params }: { params: Promise<{ surah: string }> }) {
  const { surah } = await params;
  const number = parseSurahNumber(surah);
  if (!number) notFound();
  const data = await getTafsir(number);
  return <div className="container py-6 sm:py-10"><div className="mx-auto max-w-3xl"><Link href={`/quran/${number}`} className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]"><ArrowLeft size={18}/>Kembali ke bacaan</Link><div className="mt-8"><p className="text-sm font-bold uppercase tracking-[.18em] text-[var(--blue)]">Understanding</p><h1 className="mt-2 text-3xl font-bold">Tafsir {data.namaLatin}</h1><p className="mt-2 text-[var(--muted)]">Penjelasan ringkas per ayat untuk menemani bacaanmu.</p></div><div className="mt-8 space-y-4">{data.tafsir.map(item=><details key={item.ayat} open={item.ayat===1} className="card group p-5"><summary className="cursor-pointer list-none font-bold">Ayat {item.ayat}<span className="float-right text-[var(--blue)]" aria-hidden="true">+</span></summary><p className="mt-4 border-t border-[var(--border)] pt-4 text-sm leading-8 text-[var(--muted)]">{item.teks.replace(/<[^>]*>/g, "")}</p></details>)}</div></div></div>;
}
