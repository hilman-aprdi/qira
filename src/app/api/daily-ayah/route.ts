import { NextResponse } from "next/server";
import { getSurah } from "@/lib/api/quran";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const surahNumber = Number(searchParams.get("surah"));
  const ayahNumber = Number(searchParams.get("ayah"));
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114 || !Number.isInteger(ayahNumber) || ayahNumber < 1) {
    return NextResponse.json({ message: "Invalid ayah selection" }, { status: 400 });
  }

  try {
    const surah = await getSurah(surahNumber);
    const ayah = surah.ayat.find((item) => item.nomorAyat === ayahNumber);
    if (!ayah) return NextResponse.json({ message: "Ayah not found" }, { status: 404 });
    return NextResponse.json({ surah: { nomor: surah.nomor, namaLatin: surah.namaLatin, nama: surah.nama }, ayah });
  } catch {
    return NextResponse.json({ message: "Daily ayah unavailable" }, { status: 502 });
  }
}
