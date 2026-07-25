import type { Bookmark, LastRead } from "../types/quran";

export interface ReadingProgress {
  version: 1;
  days: Record<string, string[]>;
}

export const STORAGE_KEYS = { lastRead: "qira:last-read", bookmarks: "qira:bookmarks", qari: "qira:preferred-qari", readingProgress: "qira:reading-progress" } as const;
export function readStorage<T>(key: string, fallback: T): T { if (typeof window === "undefined") return fallback; try { const value = localStorage.getItem(key); return value ? (JSON.parse(value) as T) : fallback; } catch { return fallback; } }
export function writeStorage<T>(key: string, value: T) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage can be unavailable */ } }
export const defaultLastRead: LastRead = { surahNumber: 1, surahName: "Al-Fatihah", ayahNumber: 1 };
export function toggleBookmark(bookmark: Bookmark) { const current = readStorage<Bookmark[]>(STORAGE_KEYS.bookmarks, []); const exists = current.some((item) => item.surahNumber === bookmark.surahNumber && item.ayahNumber === bookmark.ayahNumber); writeStorage(STORAGE_KEYS.bookmarks, exists ? current.filter((item) => !(item.surahNumber === bookmark.surahNumber && item.ayahNumber === bookmark.ayahNumber)) : [bookmark, ...current]); return !exists; }

export const emptyReadingProgress = (): ReadingProgress => ({ version: 1, days: {} });

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function readReadingProgress() {
  const stored = readStorage<Partial<ReadingProgress>>(STORAGE_KEYS.readingProgress, {});
  if (stored.version !== 1 || !stored.days || typeof stored.days !== "object") return emptyReadingProgress();
  return stored as ReadingProgress;
}

export function markAyahAsRead(surahNumber: number, ayahNumber: number, date = new Date()) {
  const progress = readReadingProgress();
  const dateKey = getLocalDateKey(date);
  const dayAyahs = progress.days[dateKey] ?? [];
  const ayahKey = `${surahNumber}:${ayahNumber}`;
  const next: ReadingProgress = {
    version: 1,
    days: { ...progress.days, [dateKey]: dayAyahs.includes(ayahKey) ? dayAyahs : [...dayAyahs, ayahKey] },
  };
  writeStorage(STORAGE_KEYS.readingProgress, next);
  return next;
}

export function getWeeklyReadingCount(progress: ReadingProgress, date = new Date()) {
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = current.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return Array.from({ length: 7 }, (_, index) => {
    const weekDate = new Date(current);
    weekDate.setDate(current.getDate() + mondayOffset + index);
    return progress.days[getLocalDateKey(weekDate)]?.length ?? 0;
  }).reduce((total, count) => total + count, 0);
}
