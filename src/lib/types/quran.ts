export interface Ayah { nomorAyat: number; teksArab: string; teksLatin: string; teksIndonesia: string; audio: Record<string, string>; }
export interface SurahSummary { nomor: number; nama: string; namaLatin: string; jumlahAyat: number; tempatTurun: string; arti: string; }
export interface Surah extends SurahSummary { deskripsi: string; audioFull: Record<string, string>; ayat: Ayah[]; }
export interface TafsirItem { ayat: number; teks: string; }
export interface Tafsir { nama: string; namaLatin: string; tafsir: TafsirItem[]; }
export interface LastRead { surahNumber: number; surahName: string; ayahNumber: number; }
export interface Bookmark { surahNumber: number; surahName: string; ayahNumber: number; arabic: string; translation: string; }
export interface DailyAyahPayload { surah: Pick<SurahSummary, "nomor" | "namaLatin" | "nama">; ayah: Ayah; }
