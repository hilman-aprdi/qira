# Qira

Qira adalah aplikasi web Al-Qur'an dengan pengalaman membaca yang sederhana, tenang, dan nyaman.

> A simple Quran reading experience.

## Fitur

- Daftar dan pencarian 114 surah.
- Pembaca ayat dengan teks Arab, transliterasi, dan terjemahan Indonesia.
- Audio surah dan ayat dengan pilihan qari dari data API.
- Tafsir per ayat.
- Bookmark ayat menggunakan `localStorage`.
- Penyimpanan posisi terakhir membaca.
- Ayat Hari Ini dengan pemilihan deterministik berdasarkan tanggal lokal.
- Reading Mode untuk membaca tanpa distraksi.
- Share Ayah sebagai gambar dengan pilihan format dan tema.
- Jadwal shalat berdasarkan provinsi dan kabupaten/kota di Indonesia.
- Halaman About, Privacy Policy, sitemap, dan robots.txt.

## Teknologi

- Next.js 15 dengan App Router
- React 19
- TypeScript
- Tailwind CSS
- lucide-react
- html-to-image untuk export gambar ayat

## Struktur Route

| Route | Keterangan |
| --- | --- |
| `/` | Landing page Qira |
| `/quran` | Daftar seluruh surah |
| `/quran/[surah]` | Pembaca surah |
| `/tafsir/[surah]` | Tafsir surah per ayat |
| `/bookmarks` | Ayat yang disimpan secara lokal |
| `/prayer-times` | Jadwal shalat |
| `/about` | Tentang Qira |
| `/privacy-policy` | Kebijakan privasi |
| `/sitemap.xml` | Sitemap halaman publik |
| `/robots.txt` | Aturan crawling mesin pencari |

## Sumber Data

- Ayat, terjemahan, audio, dan tafsir: [EQuran API](https://equran.id/apidev/v2)
- Jadwal shalat: [EQuran API Shalat](https://equran.id/apidev/shalat)
- Sumber ayat, terjemahan, dan tafsir: Kementerian Agama Republik Indonesia.
- Sumber jadwal shalat: Bimas Islam Kementerian Agama Republik Indonesia.

## Menjalankan Secara Lokal

Pastikan Node.js dan npm sudah terpasang.

```bash
git clone https://github.com/USERNAME/qira.git
cd qira
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Environment Variable

Buat file `.env.local` jika ingin mengatur domain canonical secara lokal:

```env
NEXT_PUBLIC_SITE_URL=https://qiraweb.vercel.app
```

Jika variable tidak diisi, aplikasi menggunakan `https://qira.app` sebagai fallback.

Jangan commit file `.env.local` ke repository.

## Validasi Project

```bash
npm run lint
npm run typecheck
npm run build
```

Untuk menjalankan hasil production build:

```bash
npm run start
```

Catatan: `next lint` masih tersedia pada project ini, tetapi Next.js memberikan peringatan bahwa command tersebut akan deprecated pada Next.js 16.

## Deployment ke Vercel

1. Push repository ke GitHub.
2. Import repository tersebut ke Vercel.
3. Pilih framework **Next.js**.
4. Tambahkan environment variable berikut pada environment Production:

   ```env
   NEXT_PUBLIC_SITE_URL=https://qiraweb.vercel.app
   ```

5. Jalankan deployment.

Setelah deployment, periksa beberapa halaman berikut:

- `https://qiraweb.vercel.app`
- `https://qiraweb.vercel.app/quran`
- `https://qiraweb.vercel.app/quran/1`
- `https://qiraweb.vercel.app/tafsir/1`
- `https://qiraweb.vercel.app/sitemap.xml`
- `https://qiraweb.vercel.app/robots.txt`

## Penyimpanan Lokal

Qira tidak menggunakan database atau authentication. Preferensi ringan disimpan di browser pengguna, termasuk:

- posisi terakhir membaca
- bookmark ayat
- qari pilihan
- lokasi jadwal shalat
- aktivitas reading progress
- preferensi reading mode jika tersedia

Menghapus site data atau `localStorage` browser akan menghapus data lokal tersebut.

## Lisensi dan Atribusi

Project ini dibuat untuk pengalaman membaca Al-Qur'an yang sederhana dan nyaman. Data Al-Qur'an, terjemahan, tafsir, audio, dan jadwal shalat mengikuti sumber API serta atribusi yang tercantum di dalam aplikasi.
