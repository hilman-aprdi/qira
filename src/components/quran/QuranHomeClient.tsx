import type { SurahSummary } from "@/lib/types/quran";
import { DailyAyahCard } from "@/components/quran/DailyAyahCard";
import { ContinueReadingCard } from "@/components/quran/ReadingProgressCard";
import { SurahList } from "@/components/quran/SurahList";

export function QuranHomeClient({ surahs }: { surahs: SurahSummary[] }) {
  return <><DailyAyahCard surahs={surahs} /><ContinueReadingCard /><div className="mt-12"><SurahList surahs={surahs} /></div></>;
}
