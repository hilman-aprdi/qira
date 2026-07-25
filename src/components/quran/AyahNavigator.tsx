"use client";

import { List, X } from "lucide-react";
import { useState } from "react";
import type { Surah } from "@/lib/types/quran";

export function AyahNavigator({ surah }: { surah: Surah }) {
  const [open, setOpen] = useState(false);
  return <div className="relative shrink-0"><button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="ayah-navigator-panel" aria-label={open ? "Tutup daftar ayat" : "Buka daftar ayat"} className="grid h-11 w-11 place-items-center rounded-full bg-[var(--blue)] text-white shadow-sm transition hover:scale-105">{open ? <X size={19} /> : <List size={19} />}</button>{open && <aside id="ayah-navigator-panel" aria-label={`Daftar ayat ${surah.namaLatin}`} className="absolute right-0 top-14 z-30 w-56 rounded-2xl border border-[var(--border)] bg-white p-3 shadow-xl"><div className="flex items-center justify-between border-b border-[var(--border)] px-2 pb-3"><div><p className="text-xs font-bold uppercase tracking-wider text-[var(--blue)]">Navigator</p><h2 className="mt-1 text-sm font-bold">Ayat {surah.namaLatin}</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Tutup navigator ayat" className="rounded-full p-1 text-[var(--muted)] hover:bg-[var(--soft)]"><X size={16} /></button></div><div className="mt-3 grid max-h-[55vh] grid-cols-5 gap-2 overflow-y-auto overscroll-contain pr-1">{surah.ayat.map((ayah) => <a key={ayah.nomorAyat} href={`#ayah-${ayah.nomorAyat}`} onClick={() => setOpen(false)} className="grid h-9 place-items-center rounded-lg bg-[var(--soft)] text-xs font-bold text-[var(--blue)] transition hover:bg-[var(--blue)] hover:text-white">{ayah.nomorAyat}</a>)}</div></aside>}</div>;
}
