import type { Surah, SurahSummary, Tafsir } from "../types/quran";

const API_BASE = "https://equran.id/api/v2";
async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error(`Quran API returned ${response.status}`);
  const json: unknown = await response.json();
  if (!json || typeof json !== "object" || !("data" in json)) throw new Error("Invalid Quran API response");
  return (json as { data: T }).data;
}
export const getSurahs = () => request<SurahSummary[]>("/surat");
export const getSurah = (number: number) => request<Surah>(`/surat/${number}`);
export const getTafsir = (number: number) => request<Tafsir>(`/tafsir/${number}`);
