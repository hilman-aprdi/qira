import Image from "next/image";
import Link from "next/link";

function LandingDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden="true">
      <Image src="/assets/clouds/cloud-01.png" alt="" width={181} height={76} className="hero-cloud-enter hero-cloud-enter-left absolute -left-16 top-10 w-36 opacity-25 sm:-left-24 sm:top-16 sm:w-44" />
      <Image src="/assets/clouds/cloud-02.png" alt="" width={208} height={105} className="hero-cloud-enter hero-cloud-enter-right absolute -right-20 bottom-16 w-44 opacity-20 sm:-right-28 sm:bottom-24 sm:w-52" />
      <Image src="/assets/sparkles/sparkle-01.png" alt="" width={46} height={55} className="hero-sparkle-enter hero-sparkle-enter-one absolute left-[12%] top-[25%] w-7 opacity-50 sm:left-[22%] sm:top-[20%]" />
      <Image src="/assets/sparkles/sparkle-02.png" alt="" width={61} height={65} className="hero-sparkle-enter hero-sparkle-enter-two absolute right-[10%] top-[18%] w-8 opacity-40 sm:right-[20%] sm:top-[24%]" />
      <Image src="/assets/sparkles/sparkle-03.png" alt="" width={59} height={47} className="hero-sparkle-enter hero-sparkle-enter-three absolute bottom-[22%] left-[16%] w-8 opacity-45 sm:bottom-[18%] sm:left-[25%]" />
    </div>
  );
}

function PhonePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      <LandingDecorations />
      <div className="relative z-10 rounded-[42px] border border-[var(--border)] bg-white p-3 shadow-[0_24px_60px_rgba(65,104,171,.14)] sm:p-4">
        <div className="overflow-hidden rounded-[32px] bg-[var(--bg)] px-5 pb-5 pt-7 sm:px-6 sm:pb-6 sm:pt-8">
          <div className="mx-auto mb-8 h-1.5 w-16 rounded-full bg-[var(--border)]" aria-hidden="true" />
          <div className="text-center">
            <Image src="/assets/brand/qira-logo.png" alt="" width={131} height={72} className="mx-auto h-10 w-auto object-contain" />
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--blue)]">A moment to reflect</p>
            <p className="mx-auto mt-3 max-w-[220px] text-lg font-semibold leading-snug text-[var(--ink)]">A simple Quran reading experience.</p>
          </div>
          <Image src="/assets/illustrations/quran-open.png" alt="" width={260} height={260} priority sizes="(max-width: 640px) 72vw, 240px" className="mx-auto my-7 w-[min(72vw,240px)] object-contain sm:my-8 sm:w-[240px]" />
          <Link href="/quran" className="flex h-12 items-center justify-center rounded-2xl bg-[var(--blue)] px-6 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(74,126,247,.22)] transition hover:-translate-y-0.5 hover:bg-[#3D70E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)] focus-visible:ring-offset-2">
            Start Reading
          </Link>
          <p className="mt-4 text-center text-xs text-[var(--muted)]">Read, listen, and reflect without distractions.</p>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <section className="landing-page relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden px-5 py-10 sm:px-8 sm:py-14 lg:min-h-[calc(100svh-5rem)]">
      <div className="container relative z-10 grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-24">
        <div className="text-left">
          <p className="hidden text-sm font-semibold uppercase tracking-[0.24em] text-[var(--blue)] lg:block">Welcome to Qira</p>
          <h1 className="sr-only mt-5 max-w-md text-5xl font-bold leading-[1.08] tracking-tight text-[var(--ink)] lg:not-sr-only xl:text-6xl">A simple Quran reading experience.</h1>
          <p className="mt-6 hidden max-w-sm text-base leading-7 text-[var(--muted)] lg:block">Read, listen, and reflect on the Quran in a calm, distraction-free space.</p>
          <Link href="/quran" className="mt-8 hidden h-12 items-center justify-center rounded-2xl bg-[var(--blue)] px-7 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(74,126,247,.18)] transition hover:-translate-y-0.5 hover:bg-[#3D70E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)] focus-visible:ring-offset-2 lg:inline-flex">Start Reading</Link>
        </div>
        <div className="lg:justify-self-end"><PhonePreview /></div>
      </div>
    </section>
  );
}
