import type { MonthlyPrayerSchedule, PrayerLocation } from "../types/shalat";

const SHALAT_API_BASE = "https://equran.id/api/v2";

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${SHALAT_API_BASE}${path}`, {
    ...init,
    headers: { Accept: "application/json", "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) throw new Error(`EQuran Shalat API returned ${response.status}`);
  const payload = (await response.json()) as ApiResponse<T>;
  if (payload.code !== 200 || payload.data === undefined) throw new Error(payload.message || "Invalid EQuran Shalat response");
  return payload.data;
}

export function getProvinces(): Promise<string[]> {
  return request<string[]>("/shalat/provinsi", { next: { revalidate: 86400 } });
}

export function getCities(province: string): Promise<string[]> {
  return request<string[]>("/shalat/kabkota", { method: "POST", body: JSON.stringify({ provinsi: province }) });
}

export function getMonthlySchedule(location: PrayerLocation, month: number, year: number): Promise<MonthlyPrayerSchedule> {
  return request<MonthlyPrayerSchedule>("/shalat", { method: "POST", body: JSON.stringify({ provinsi: location.province, kabkota: location.city, bulan: month, tahun: year }) });
}
