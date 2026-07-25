import type { Metadata } from "next";
import { getSurahs } from "@/lib/api/quran";
import { QuranHomeClient } from "@/components/quran/QuranHomeClient";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Al-Qur'an — Qira", description: "Baca daftar 114 surah Al-Qur'an dengan teks Arab, terjemahan, audio, dan tafsir di Qira.", alternates: { canonical: "/quran" }, openGraph: { title: "Al-Qur'an — Qira", description: "Baca daftar 114 surah Al-Qur'an di Qira.", url: absoluteUrl("/quran"), type: "website" } };
export default async function QuranPage(){return <div className="container py-8 sm:py-12"><div className="mx-auto max-w-3xl"><h1 className="text-3xl font-bold">Al-Qur&apos;an</h1><p className="mt-2 text-[var(--muted)]">Baca, dengarkan, dan pahami Al-Qur&apos;an dengan tenang.</p><QuranHomeClient surahs={await getSurahs()}/></div></div>}
