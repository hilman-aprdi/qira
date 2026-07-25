"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { DailyAyahPayload, SurahSummary } from "@/lib/types/quran";
import { getLocalDateKey } from "@/lib/utils/storage";

function dateSeed(dateKey: string) {
  return Array.from(dateKey).reduce((seed, character) => ((seed * 31) + character.charCodeAt(0)) >>> 0, 7);
}

function getDailySelection(dateKey: string, surahs: SurahSummary[]) {
  const surah = surahs[dateSeed(dateKey) % surahs.length];
  return { surah: surah.nomor, ayah: (dateSeed(`${dateKey}:${surah.nomor}`) % surah.jumlahAyat) + 1 };
}

export function DailyAyahCard({ surahs }: { surahs: SurahSummary[] }) {
  const [dateKey, setDateKey] = useState("");
  const [data, setData] = useState<DailyAyahPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const selection = useMemo(() => dateKey && surahs.length ? getDailySelection(dateKey, surahs) : null, [dateKey, surahs]);

  useEffect(() => {
    setDateKey(getLocalDateKey());
  }, []);

  useEffect(() => {
    if (!selection) return;
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetch(`/api/daily-ayah?surah=${selection.surah}&ayah=${selection.ayah}`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("Daily ayah unavailable"); return response.json() as Promise<DailyAyahPayload>; })
      .then(setData)
      .catch((reason: unknown) => { if (reason instanceof DOMException && reason.name === "AbortError") return; setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [selection, retry]);

  return <section className="card relative mt-6 overflow-hidden border-[rgb(74,126,247)] !bg-[rgb(74,126,247)] p-5 text-center italic sm:p-7">
    <div className="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden="true">
      <Image src="/assets/clouds/cloud-01.png" alt="" width={181} height={76} className="absolute -left-14 top-5 w-36 opacity-25 sm:-left-20 sm:w-44" />
      <Image src="/assets/clouds/cloud-02.png" alt="" width={208} height={105} className="absolute -right-16 bottom-0 w-40 opacity-20 sm:-right-24 sm:w-48" />
      <Image src="/assets/sparkles/sparkle-01.png" alt="" width={46} height={55} className="absolute left-[18%] top-8 w-6 opacity-45" />
      <Image src="/assets/sparkles/sparkle-03.png" alt="" width={59} height={47} className="absolute bottom-8 right-[18%] w-7 opacity-40" />
    </div>
    <div className="relative z-10 flex flex-col items-center">
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-blue-100">Daily reflection</p><h2 className="mt-1 text-xl font-bold text-white">Ayat Hari Ini</h2>
      </div>
      <span className="mt-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">{dateKey || "Hari ini"}</span>
    {loading && <div className="mt-7 flex w-full flex-col items-center gap-3" aria-live="polite"><div className="h-5 w-4/5 animate-pulse rounded-lg bg-white/70" /><div className="h-4 w-3/4 animate-pulse rounded bg-white/70" /><div className="h-4 w-1/3 animate-pulse rounded bg-white/70" /></div>}
    {!loading && error && <div className="mt-6 flex flex-col items-center rounded-2xl bg-white/15 p-4 text-sm text-white/90" role="alert"><p>Ayat hari ini tidak dapat dimuat.</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-3 inline-flex items-center gap-2 font-semibold text-white"><RefreshCw size={15} />Coba lagi</button></div>}
    {!loading && !error && data && <><p lang="id" className="mt-7 max-w-2xl text-base leading-8 text-white sm:text-lg">“{data.ayah.teksIndonesia}”</p><div className="mt-6 flex flex-col items-center gap-3 border-t border-white/25 pt-4"><p className="text-sm font-semibold text-blue-100">{data.surah.namaLatin} <span aria-hidden="true">•</span> Ayat {data.ayah.nomorAyat}</p><p className="text-xs text-blue-100">Sumber: Kementerian Agama RI</p><Link href={`/quran/${data.surah.nomor}#ayah-${data.ayah.nomorAyat}`} className="inline-flex items-center gap-2 text-sm font-bold text-white hover:underline">Baca Ayat <ArrowRight size={16} /></Link></div></>}
    </div>
  </section>;
}
