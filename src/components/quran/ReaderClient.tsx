"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Bookmark, Check, Copy, Focus, Pause, Play, Share2, X } from "lucide-react";
import { AyahNavigator } from "@/components/quran/AyahNavigator";
import type { Ayah, Bookmark as BookmarkType, LastRead, Surah } from "@/lib/types/quran";
import { defaultLastRead, markAyahAsRead, readStorage, STORAGE_KEYS, toggleBookmark, writeStorage } from "@/lib/utils/storage";

const qariNames: Record<string, string> = { "01": "Misyari Rasyid Alafasy", "02": "Abdullah Al-Mathrud", "03": "Abdurrahman As-Sudais", "04": "Ibrahim Al-Dosari", "05": "Mahmoud Khalil Al-Husary", "06": "Mahir Al-Muaiqly" };
const VerseShareDialog = dynamic(() => import("@/components/share/VerseShareDialog").then((module) => module.VerseShareDialog), { ssr: false });

export function ReaderClient({ surah }: { surah: Surah }) {
  const [qari, setQari] = useState("01");
  const [playing, setPlaying] = useState<number | null>(null);
  const [saved, setSaved] = useState<number[]>([]);
  const [checkpoint, setCheckpoint] = useState<LastRead | null>(null);
  const [readingMode, setReadingMode] = useState(false);
  const [shareAyah, setShareAyah] = useState<Ayah | null>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const readTimers = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    setQari(readStorage(STORAGE_KEYS.qari, "01"));
    setSaved(readStorage<BookmarkType[]>(STORAGE_KEYS.bookmarks, []).filter((item) => item.surahNumber === surah.nomor).map((item) => item.ayahNumber));
    const lastRead = readStorage<LastRead>(STORAGE_KEYS.lastRead, defaultLastRead);
    setCheckpoint(lastRead.surahNumber === surah.nomor ? lastRead : null);
    const hashNumber = Number(window.location.hash.match(/^#ayah-(\d+)$/)?.[1]);
    const target = hashNumber || (lastRead.surahNumber === surah.nomor ? lastRead.ayahNumber : 0);
    if (target > 0) window.setTimeout(() => document.getElementById(`ayah-${target}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);

    const elements = surah.ayat.map((ayah) => document.getElementById(`ayah-${ayah.nomorAyat}`)).filter((element): element is HTMLElement => Boolean(element));
    const timers = readTimers.current;
    const checkpointObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      const number = Number(visible?.target.id.replace("ayah-", ""));
      if (!number) return;
      const next = { surahNumber: surah.nomor, surahName: surah.namaLatin, ayahNumber: number };
      setCheckpoint(next);
      writeStorage(STORAGE_KEYS.lastRead, next);
    }, { rootMargin: "-18% 0px -60% 0px", threshold: 0.2 });
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const number = Number(entry.target.id.replace("ayah-", ""));
        if (!number) return;
        const currentTimer = readTimers.current.get(number);
        if (entry.isIntersecting && currentTimer === undefined) {
          const timer = window.setTimeout(() => {
            markAyahAsRead(surah.nomor, number);
            readTimers.current.delete(number);
          }, 1000);
          readTimers.current.set(number, timer);
        } else if (!entry.isIntersecting && currentTimer !== undefined) {
          window.clearTimeout(currentTimer);
          readTimers.current.delete(number);
        }
      });
    }, { threshold: 0.6 });
    elements.forEach((element) => { checkpointObserver.observe(element); progressObserver.observe(element); });
    return () => { checkpointObserver.disconnect(); progressObserver.disconnect(); timers.forEach((timer) => window.clearTimeout(timer)); timers.clear(); };
  }, [surah]);

  useEffect(() => {
    document.body.classList.toggle("qira-reading-mode", readingMode);
    const exitWithEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { setReadingMode(false); if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined); } };
    const syncFullscreen = () => { if (!document.fullscreenElement && readingMode) setReadingMode(false); };
    document.addEventListener("keydown", exitWithEscape);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => { document.body.classList.remove("qira-reading-mode"); document.removeEventListener("keydown", exitWithEscape); document.removeEventListener("fullscreenchange", syncFullscreen); };
  }, [readingMode]);

  const qaris = Object.keys(surah.audioFull || {}).filter((key) => surah.audioFull[key]);
  const resume = () => { if (checkpoint) document.getElementById(`ayah-${checkpoint.ayahNumber}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const playFull = () => { if (!audio.current) return; if (playing === 0) { audio.current.pause(); setPlaying(null); } else { audio.current.play().catch(() => undefined); setPlaying(0); } };
  const playAyah = (number: number, url?: string) => { if (!url) return; if (playing === number) { audio.current?.pause(); setPlaying(null); return; } if (audio.current) { audio.current.src = url; audio.current.play().catch(() => undefined); setPlaying(number); const next = { surahNumber: surah.nomor, surahName: surah.namaLatin, ayahNumber: number }; setCheckpoint(next); writeStorage(STORAGE_KEYS.lastRead, next); } };
  const bookmark = (number: number) => { const ayah = surah.ayat[number - 1]; const active = toggleBookmark({ surahNumber: surah.nomor, surahName: surah.namaLatin, ayahNumber: number, arabic: ayah.teksArab, translation: ayah.teksIndonesia }); setSaved((current) => active ? [...current, number] : current.filter((item) => item !== number)); };
  const enterReadingMode = async () => { setReadingMode(true); if (document.documentElement.requestFullscreen && !document.fullscreenElement) await document.documentElement.requestFullscreen().catch(() => undefined); };
  const exitReadingMode = async () => { setReadingMode(false); if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen().catch(() => undefined); };

  return <>
    {readingMode && <div className="reading-mode-bar mx-auto flex max-w-3xl items-center justify-between border-b border-[var(--border)] px-1 py-4"><div><p className="text-sm font-bold">{surah.namaLatin}</p><p className="mt-1 text-xs text-[var(--muted)]">{checkpoint ? `Ayat ${checkpoint.ayahNumber}` : "Mode fokus"}</p></div><button type="button" onClick={() => { void exitReadingMode(); }} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--blue)] hover:bg-[var(--soft)]" aria-label="Keluar dari mode membaca"><X size={17} />Keluar</button></div>}
    <div className={`reader-audio-card card mt-8 p-5 ${readingMode ? "reading-mode-audio" : ""}`}><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-bold text-[var(--blue)]">Listen to this surah</p><p className="mt-1 font-semibold">Murottal pilihanmu</p></div><select aria-label="Pilih qari" value={qari} onChange={(event) => { setQari(event.target.value); writeStorage(STORAGE_KEYS.qari, event.target.value); }} className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm">{qaris.map((key) => <option key={key} value={key}>{qariNames[key] ?? `Qari ${key}`}</option>)}</select></div><div className="mt-5 flex items-center gap-4"><button onClick={playFull} aria-label={playing === 0 ? "Jeda surah" : "Putar surah"} className="grid h-12 w-12 place-items-center rounded-full bg-[var(--blue)] text-white">{playing === 0 ? <Pause size={20} /> : <Play size={20} />}</button><div className="h-2 flex-1 rounded-full bg-[var(--soft)]"><div className="h-full w-1/4 rounded-full bg-[var(--blue)]" /></div></div><audio ref={audio} preload="none" src={surah.audioFull?.[qari]} onEnded={() => setPlaying(null)} /></div>
    {!readingMode && <div className="reader-checkpoint-row mt-4 flex items-center gap-3"><div className="min-w-0 flex-1">{checkpoint && <button type="button" onClick={resume} className="w-full rounded-2xl border border-[var(--blue)] bg-white px-4 py-3 text-left text-sm font-semibold text-[var(--blue)]">Lanjutkan dari Ayat {checkpoint.ayahNumber}<span className="ml-2 font-normal text-[var(--muted)]">• posisi terakhir tersimpan</span></button>}</div><AyahNavigator surah={surah} /><button type="button" onClick={() => { void enterReadingMode(); }} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--muted)] hover:border-[var(--blue)] hover:text-[var(--blue)]" aria-label="Aktifkan mode membaca"><Focus size={17} /> <span className="hidden sm:inline">Mode membaca</span></button></div>}
    <div className="mt-5 space-y-5 reader-verses">{surah.ayat.map((ayah) => <article id={`ayah-${ayah.nomorAyat}`} key={ayah.nomorAyat} className="card scroll-mt-6 p-5 sm:p-7"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--soft)] text-sm font-bold text-[var(--blue)]">{ayah.nomorAyat}</span><div className="flex gap-1 text-[var(--muted)]"><button onClick={() => playAyah(ayah.nomorAyat, ayah.audio?.[qari] ?? Object.values(ayah.audio ?? {})[0])} aria-label={`Putar ayat ${ayah.nomorAyat}`} className="rounded-full p-2 hover:bg-[var(--soft)]">{playing === ayah.nomorAyat ? <Pause size={18} /> : <Play size={18} />}</button><button onClick={() => bookmark(ayah.nomorAyat)} aria-label={`${saved.includes(ayah.nomorAyat) ? "Hapus" : "Simpan"} bookmark ayat ${ayah.nomorAyat}`} className={`rounded-full p-2 hover:bg-[var(--soft)] ${saved.includes(ayah.nomorAyat) ? "text-[var(--blue)]" : ""}`}>{saved.includes(ayah.nomorAyat) ? <Check size={18} /> : <Bookmark size={18} />}</button><button onClick={() => setShareAyah(ayah)} aria-label={`Bagikan ayat ${ayah.nomorAyat}`} className="rounded-full p-2 hover:bg-[var(--soft)]"><Share2 size={18} /></button><button onClick={() => navigator.clipboard?.writeText(ayah.teksArab)} aria-label={`Salin ayat ${ayah.nomorAyat}`} className="rounded-full p-2 hover:bg-[var(--soft)]"><Copy size={18} /></button></div></div><p lang="ar" dir="rtl" className="arabic mt-6 text-right text-3xl leading-[2.1] sm:text-4xl">{ayah.teksArab}</p><p className="mt-5 text-sm italic leading-7 text-[var(--muted)]">{ayah.teksLatin}</p><p lang="id" className="mt-3 max-w-2xl text-base leading-8 text-[var(--ink)]">{ayah.teksIndonesia}</p></article>)}</div>{shareAyah && <VerseShareDialog ayah={shareAyah} surahName={surah.namaLatin} surahNumber={surah.nomor} onClose={() => setShareAyah(null)} />}
  </>;
}
