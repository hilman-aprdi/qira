"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Download, Share2, X } from "lucide-react";
import type { Ayah } from "@/lib/types/quran";
import { getShareFormatDimensions, type ShareContentMode, type ShareFormat, type ShareTheme, VerseShareCard } from "@/components/share/VerseShareCard";

type VerseShareDialogProps = { ayah: Ayah; surahName: string; surahNumber: number; onClose: () => void };

const options = { content: [{ value: "arabic", label: "Arabic" }, { value: "translation", label: "Translation" }, { value: "both", label: "Arabic + Translation" }] as const, format: [{ value: "story", label: "Story", ratio: "9:16" }, { value: "portrait", label: "Portrait", ratio: "4:5" }, { value: "square", label: "Square", ratio: "1:1" }] as const, theme: [{ value: "qira", label: "Qira Light" }, { value: "blue", label: "Qira Blue" }, { value: "minimal", label: "Minimal White" }] as const };

function slugify(value: string) { return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export function VerseShareDialog({ ayah, surahName, surahNumber, onClose }: VerseShareDialogProps) {
  const [mode, setMode] = useState<ShareContentMode>("both");
  const [format, setFormat] = useState<ShareFormat>("story");
  const [theme, setTheme] = useState<ShareTheme>("qira");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const hasFocused = useRef(false);
  const [tooLong, setTooLong] = useState(false);
  const url = typeof window === "undefined" ? `/quran/${surahNumber}#ayah-${ayah.nomorAyat}` : `${window.location.origin}/quran/${surahNumber}#ayah-${ayah.nomorAyat}`;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    if (!hasFocused.current) { closeButtonRef.current?.focus(); hasFocused.current = true; }
    const closeWithEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); if (event.key !== "Tab") return; const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"); if (!focusable?.length) return; const first = focusable[0]; const last = focusable[focusable.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } };
    document.addEventListener("keydown", closeWithEscape);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", closeWithEscape); openerRef.current?.focus(); };
  }, [onClose]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const measure = () => setTooLong(content.scrollHeight > content.clientHeight + 2);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [mode, format, theme]);

  const generateImage = async () => {
    if (!cardRef.current || tooLong) return null;
    setBusy(true);
    setStatus("");
    try {
      const { toPng } = await import("html-to-image");
      const { width, height } = getShareFormatDimensions(format);
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, canvasWidth: width, canvasHeight: height, pixelRatio: 1 });
      return { dataUrl, width, height };
    } catch { setStatus("Gambar tidak dapat dibuat. Coba lagi."); return null; } finally { setBusy(false); }
  };

  const saveImage = async () => { const image = await generateImage(); if (!image) return; const link = document.createElement("a"); link.download = `qira-${slugify(surahName)}-${ayah.nomorAyat}.png`; link.href = image.dataUrl; link.click(); setStatus("Gambar berhasil disiapkan."); };
  const copyLink = async () => { try { await navigator.clipboard.writeText(url); setStatus("Tautan ayat berhasil disalin."); } catch { setStatus("Tautan tidak dapat disalin di browser ini."); } };
  const share = async () => {
    if (!navigator.share) { await copyLink(); return; }
    const image = await generateImage();
    try {
      if (image && typeof File !== "undefined" && navigator.canShare?.({ files: [new File([await (await fetch(image.dataUrl)).blob()], "ayah.png", { type: "image/png" })] })) {
        const file = new File([await (await fetch(image.dataUrl)).blob()], "ayah.png", { type: "image/png" });
        await navigator.share({ title: `${surahName} ayat ${ayah.nomorAyat}`, text: "Share the ayah. Keep its context.", url, files: [file] });
      } else await navigator.share({ title: `${surahName} ayat ${ayah.nomorAyat}`, text: "Share the ayah. Keep its context.", url });
    } catch { /* sharing can be cancelled by the user */ }
  };

  return <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(38,50,71,.45)] p-0 sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="share-ayah-title" className="flex max-h-[95svh] w-full max-w-4xl flex-col overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-7"><header className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--blue)]">Share Ayah</p><h2 id="share-ayah-title" className="mt-1 text-xl font-bold">Bagikan ayat dengan konteksnya</h2><p className="mt-2 text-sm text-[var(--muted)]">Share the ayah. Keep its context.</p></div><button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Tutup Share Ayah" className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--soft)]"><X size={20} /></button></header><div className="mt-6 grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]"><div className="order-2 space-y-5 lg:order-1"><ControlGroup label="Content"><div className="grid grid-cols-3 gap-2">{options.content.map((item) => <button key={item.value} type="button" aria-pressed={mode === item.value} onClick={() => setMode(item.value)} className={`rounded-xl border px-3 py-3 text-xs font-semibold transition ${mode === item.value ? "border-[var(--blue)] bg-[var(--soft)] text-[var(--blue)]" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--blue)]"}`}>{item.label}</button>)}</div></ControlGroup><ControlGroup label="Format"><div className="grid grid-cols-3 gap-2">{options.format.map((item) => <button key={item.value} type="button" aria-pressed={format === item.value} onClick={() => setFormat(item.value)} className={`rounded-xl border px-3 py-3 text-xs font-semibold transition ${format === item.value ? "border-[var(--blue)] bg-[var(--soft)] text-[var(--blue)]" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--blue)]"}`}><span className="block">{item.label}</span><span className="mt-1 block text-[10px] font-normal opacity-75">{item.ratio}</span></button>)}</div></ControlGroup><ControlGroup label="Theme"><div className="grid grid-cols-3 gap-2">{options.theme.map((item) => <button key={item.value} type="button" aria-pressed={theme === item.value} onClick={() => setTheme(item.value)} className={`rounded-xl border px-3 py-3 text-xs font-semibold transition ${theme === item.value ? "border-[var(--blue)] bg-[var(--soft)] text-[var(--blue)]" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--blue)]"}`}>{item.label}</button>)}</div></ControlGroup>{tooLong && <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-800" role="alert">Ayat ini terlalu panjang untuk layout ini. Coba pilih Arabic only, Translation only, atau format lain.</p>}<div className="grid gap-2 sm:grid-cols-3"><button type="button" onClick={() => { void share(); }} disabled={busy || tooLong} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><Share2 size={17} />Share</button><button type="button" onClick={() => { void saveImage(); }} disabled={busy || tooLong} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 text-sm font-bold text-[var(--blue)] disabled:cursor-not-allowed disabled:opacity-50"><Download size={17} />Save Image</button><button type="button" onClick={() => { void copyLink(); }} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 text-sm font-bold text-[var(--muted)]"><Copy size={17} />Copy Link</button></div>{status && <p className="text-center text-sm text-[var(--muted)]" role="status">{status}</p>}</div><div className="order-1 flex min-h-0 justify-center rounded-2xl bg-[var(--bg)] p-4 lg:order-2"><div ref={(node) => { cardRef.current = node; contentRef.current = node?.querySelector("[data-share-content]") ?? null; }} className="w-full max-w-[360px]"><VerseShareCard arabic={ayah.teksArab} translation={ayah.teksIndonesia} surahName={surahName} surahNumber={surahNumber} ayahNumber={ayah.nomorAyat} mode={mode} theme={theme} format={format} /></div></div></div></section></div>;
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) { return <fieldset><legend className="mb-2 text-sm font-bold text-[var(--ink)]">{label}</legend>{children}</fieldset>; }
