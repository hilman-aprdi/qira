"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { LastRead } from "@/lib/types/quran";
import { defaultLastRead, readStorage, STORAGE_KEYS } from "@/lib/utils/storage";

function HeroDecorations({ animate }: { animate: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <Image src="/assets/clouds/cloud-01.png" alt="" width={181} height={76} className={`${animate ? "hero-cloud-enter hero-cloud-enter-left" : ""} absolute -left-6 top-5 opacity-35`} />
      <Image src="/assets/clouds/cloud-02.png" alt="" width={208} height={105} className={`${animate ? "hero-cloud-enter hero-cloud-enter-right" : ""} absolute -right-10 top-1 opacity-35`} />
      <Image src="/assets/sparkles/sparkle-01.png" alt="" width={46} height={55} className={`${animate ? "hero-sparkle-enter hero-sparkle-enter-one" : ""} absolute left-[47%] top-8 opacity-80`} />
      <Image src="/assets/sparkles/sparkle-02.png" alt="" width={61} height={65} className={`${animate ? "hero-sparkle-enter hero-sparkle-enter-two" : ""} absolute left-[58%] top-[42%] opacity-70`} />
      <Image src="/assets/sparkles/sparkle-03.png" alt="" width={59} height={47} className={`${animate ? "hero-sparkle-enter hero-sparkle-enter-three" : ""} absolute left-[34%] top-[48%] opacity-75`} />
    </div>
  );
}

export function HomeClient() {
  const [last, setLast] = useState<LastRead>(defaultLastRead);
  const [animateIntro, setAnimateIntro] = useState(true);
  useEffect(() => {
    setLast(readStorage(STORAGE_KEYS.lastRead, defaultLastRead));
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isRefresh = navigation?.type === "reload";
    const hasVisited = sessionStorage.getItem("qira:home-intro-seen") === "true";
    setAnimateIntro(isRefresh || !hasVisited);
    sessionStorage.setItem("qira:home-intro-seen", "true");
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";

  return (
    <>
      <section className="relative overflow-hidden rounded-[28px] bg-[var(--blue)] px-6 py-8 text-white shadow-[0_18px_40px_rgba(74,126,247,.2)] sm:px-10">
        <HeroDecorations animate={animateIntro} />
        <div className="relative z-10">
          <p className="text-sm font-semibold text-blue-100">{greeting} • {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date())}</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Assalamu&apos;alaikum</h1>
          <p className="mt-2 text-blue-100">Ready to continue reading?</p>
          <Link href={`/quran/${last.surahNumber}#ayah-${last.ayahNumber}`} className="mt-7 block rounded-2xl bg-white/15 p-5 transition hover:bg-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Continue Reading</p>
                <h2 className="mt-1 text-xl font-bold">{last.surahName}</h2>
                <p className="mt-1 text-sm text-blue-100">Ayat {last.ayahNumber}</p>
              </div>
              <Image src="/assets/illustrations/quran-open.png" alt="Ilustrasi Al-Qur&apos;an terbuka" width={130} height={130} sizes="130px" className="-my-5 object-contain" />
            </div>
          </Link>
        </div>
      </section>
      <p className="mt-8 text-sm font-semibold text-[var(--muted)]">Mulai dengan satu ayat, lanjutkan dengan tenang.</p>
    </>
  );
}
