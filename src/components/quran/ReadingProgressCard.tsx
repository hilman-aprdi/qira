"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { LastRead } from "@/lib/types/quran";
import { defaultLastRead, readStorage, STORAGE_KEYS } from "@/lib/utils/storage";

export function ContinueReadingCard() {
  const [lastRead, setLastRead] = useState<LastRead>(defaultLastRead);

  useEffect(() => {
    setLastRead(readStorage(STORAGE_KEYS.lastRead, defaultLastRead));
  }, []);

  return <section className="card mt-6 p-5 sm:p-7"><Link href={`/quran/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`} className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] px-4 py-4 transition hover:border-[var(--blue)]"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--blue)]">Lanjutkan Membaca</p><p className="mt-2 text-base font-bold">{lastRead.surahName} <span className="font-normal text-[var(--muted)]">· Ayat {lastRead.ayahNumber}</span></p></div><ArrowRight size={20} className="shrink-0 text-[var(--blue)]" /></Link></section>;
}
