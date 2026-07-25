import type { Metadata } from "next";
import { PrayerTimesShell } from "@/components/prayer/PrayerTimesShell";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Jadwal Shalat — Qira", description: "Lihat jadwal shalat harian dan bulanan berdasarkan provinsi serta kabupaten atau kota di Indonesia.", alternates: { canonical: "/prayer-times" }, openGraph: { title: "Jadwal Shalat — Qira", description: "Lihat jadwal shalat harian dan bulanan di Indonesia.", url: absoluteUrl("/prayer-times"), type: "website" } };
export default function PrayerTimesPage() { return <PrayerTimesShell />; }
