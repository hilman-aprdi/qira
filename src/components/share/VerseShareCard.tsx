import Image from "next/image";
import type { CSSProperties } from "react";

export type ShareContentMode = "arabic" | "translation" | "both";
export type ShareTheme = "qira" | "blue" | "minimal";
export type ShareFormat = "story" | "portrait" | "square";

export type VerseShareCardProps = {
  arabic: string;
  translation: string;
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  mode: ShareContentMode;
  theme: ShareTheme;
  format: ShareFormat;
};

const formatDimensions: Record<ShareFormat, { width: number; height: number }> = {
  story: { width: 1080, height: 1920 },
  portrait: { width: 1080, height: 1350 },
  square: { width: 1080, height: 1080 },
};

const themes: Record<ShareTheme, { background: string; text: string; muted: string; accent: string }> = {
  qira: { background: "#F3F7FF", text: "#263247", muted: "#6B7A99", accent: "#4A7EF7" },
  blue: { background: "#4A7EF7", text: "#FFFFFF", muted: "rgba(255,255,255,.78)", accent: "rgba(255,255,255,.34)" },
  minimal: { background: "#FFFFFF", text: "#263247", muted: "#6B7A99", accent: "#DCE6F5" },
};

export function getShareFormatDimensions(format: ShareFormat) {
  return formatDimensions[format];
}

export function VerseShareCard({ arabic, translation, surahName, ayahNumber, mode, theme, format }: VerseShareCardProps) {
  const colors = themes[theme];
  const dimensions = formatDimensions[format];
  const cardStyle: CSSProperties = { aspectRatio: `${dimensions.width} / ${dimensions.height}`, backgroundColor: colors.background, color: colors.text };
  const showArabic = mode === "arabic" || mode === "both";
  const showTranslation = mode === "translation" || mode === "both";

  return <div data-share-card className="relative flex w-full max-w-[360px] flex-col overflow-hidden p-7 sm:p-9" style={cardStyle}>
    {theme === "qira" && <><Image src="/assets/sparkles/sparkle-01.png" alt="" width={46} height={55} aria-hidden="true" className="pointer-events-none absolute left-5 top-8 w-7 opacity-45" /><Image src="/assets/sparkles/sparkle-03.png" alt="" width={59} height={47} aria-hidden="true" className="pointer-events-none absolute bottom-20 right-6 w-8 opacity-45" /></>}
    <div className="relative z-10 flex items-center justify-between text-xs font-bold uppercase tracking-[.18em]" style={{ color: colors.accent }}><span>Qira</span><span>Al-Qur&apos;an</span></div>
    <div data-share-content className="relative z-10 flex min-h-0 flex-1 flex-col justify-center overflow-y-auto py-8 text-center">
      {showArabic && <p lang="ar" dir="rtl" className={`arabic break-words text-2xl leading-[2.1] sm:text-3xl ${mode === "both" ? "" : "text-3xl sm:text-4xl"}`}>{arabic}</p>}
      {showArabic && showTranslation && <div className="mx-auto my-7 h-px w-16" style={{ backgroundColor: colors.accent }} />}
      {showTranslation && <p lang="id" className="break-words text-base leading-8 sm:text-lg">{translation}</p>}
    </div>
    <div className="relative z-10 border-t pt-5 text-center" style={{ borderColor: colors.accent }}><p className="text-sm font-semibold">{surahName} <span aria-hidden="true">·</span> Ayat {ayahNumber}</p><p className="mt-1 text-xs" style={{ color: colors.muted }}>Qira · A simple Quran reading experience.</p></div>
  </div>;
}
