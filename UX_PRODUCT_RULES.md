# LogiScope — Product & UX Decision Rules

Dokumen ini mengajarkan **cara berpikir produk** saat membangun LogiScope. Jangan gunakan dokumen ini hanya sebagai checklist kosmetik. Tujuannya adalah agar implementasi tetap sederhana, fokus, mudah dipahami, dan benar-benar membantu pekerjaan Logistik.

## 1. Prinsip utama: decision support, bukan data dump

LogiScope adalah alat bantu keputusan. Setiap halaman harus menjawab pertanyaan operasional yang jelas.

Sebelum menambah elemen UI, tanyakan:
1. Keputusan apa yang dibantu elemen ini?
2. Apakah informasi ini dibutuhkan sekarang, atau hanya setelah user memilih sesuatu?
3. Apakah informasi ini sudah tampil di tempat lain?
4. Apakah elemen ini membuat user lebih cepat memahami situasi?
5. Kalau elemen ini dihapus, apakah tugas utama user terganggu?

Jika jawaban nomor 5 adalah **tidak**, prioritaskan untuk menghapus atau memindahkan elemen tersebut ke detail/secondary interaction.

Prinsip penting:
- **Remove before add.** Jangan memperbaiki UI yang ramai dengan menambah lebih banyak card, badge, legend, atau teks.
- **Progressive disclosure.** Tampilkan informasi detail hanya setelah user memilih route, kota, vendor, atau item.
- **One screen, one dominant job.** Setiap halaman harus punya satu pekerjaan utama yang paling jelas.
- **Operational first.** Prioritaskan hal yang membantu user bekerja, bukan dekorasi atau technical metadata.
- **Scanability first.** Informasi penting harus terbaca dalam 2–3 detik.

## 2. Hierarki informasi global

Gunakan empat tingkat informasi:

### Level 1 — Primary action
Hal yang paling sering dilakukan user pada halaman tersebut.
Contoh:
- Coverage Map → cari/klik wilayah.
- Compare Vendor → pilih origin dan destination.
- Load Planner → isi dimensi barang.

### Level 2 — Immediate result
Hasil utama dari action user.
Contoh:
- jumlah vendor pada kota terpilih;
- vendor yang melayani route;
- armada yang direkomendasikan.

### Level 3 — Supporting detail
Informasi pendukung seperti lead time, mode, commercial readiness, warning, source status.

### Level 4 — Audit/technical detail
Source row, snapshot date, data quality note, metadata teknis. Jangan tampilkan permanen pada layar utama kecuali memang halaman Data Health atau user membuka detail.

Jangan membalik hierarki ini. Data audit tidak boleh lebih dominan daripada hasil operasional.

## 3. Aturan Coverage Map — sangat penting

Coverage Map harus terasa seperti **peta operasional**, bukan dashboard yang kebetulan berisi peta.

### Tujuan utama
Coverage Map menjawab:
> “Daerah mana yang sudah punya vendor, seberapa kuat coverage-nya, dan siapa vendornya ketika saya memilih wilayah?”

Coverage Map **bukan** Route Search. Route Search tetap berada di Compare Vendor.

### Layout yang diinginkan
- Map adalah elemen dominan: target sekitar **65–75% area viewport konten** pada desktop.
- Header halaman ringkas.
- Di atas map hanya ada kontrol penting: search lokasi dan filter utama.
- Detail wilayah muncul di panel kanan/slide-over hanya setelah wilayah dipilih.
- Saat tidak ada wilayah terpilih, map harus terasa lapang.
- Legend harus compact dan tidak mendominasi.

Contoh struktur:

```text
Coverage Map                                      Refresh Data
Lihat cakupan vendor di seluruh Indonesia

[ Cari kota / kabupaten... ] [Vendor ▾] [Moda ▾] [Status ▾]

┌───────────────────────────────────────┬──────────────────┐
│                                       │                  │
│                                       │  DETAIL WILAYAH  │
│              MAP INDONESIA            │  muncul setelah  │
│                                       │  user memilih    │
│                                       │  kota/kabupaten  │
│                                       │                  │
└───────────────────────────────────────┴──────────────────┘
  Multi Vendor   Single Vendor   Belum Terdata
```

## 4. Progressive zoom untuk label kota/kabupaten

Jangan menampilkan seluruh nama kota/kabupaten sekaligus pada zoom Indonesia.

Gunakan progressive disclosure berdasarkan zoom:
- **Zoom nasional:** nama provinsi dan kota besar yang relevan.
- **Zoom regional/provinsi:** kota dan kabupaten mulai terlihat.
- **Zoom kota/kabupaten:** label lokal dan boundary dapat lebih detail.

Tujuan: user tetap melihat konteks geografis tanpa map penuh tulisan.

Jika basemap sudah menyediakan nama kota/kabupaten, jangan menutupinya dengan polygon solid atau overlay yang terlalu opaque.

## 5. Basemap dan layer order

Peta harus tetap terasa seperti peta nyata.

Prioritas visual:
1. basemap geografis;
2. label geografis;
3. coverage overlay;
4. selected area;
5. marker/cluster interaktif;
6. route line hanya ketika relevan.

Coverage polygon harus semi-transparan. Jangan membuat warna coverage menutup jalan, garis pantai, atau nama kota.

Jika menggunakan Leaflet:
- atur pane/z-index dengan sengaja;
- jangan biarkan GeoJSON overlay menutup label basemap;
- gunakan opacity/fillOpacity konservatif;
- selected area boleh lebih kuat daripada area lain;
- tooltip/label custom hanya jika memang membantu.

## 6. Marker dan clustering

Jangan menaruh banyak pin permanen yang menutupi peta.

Aturan:
- cluster marker pada zoom rendah jika jumlah lokasi banyak;
- pecah cluster saat zoom meningkat;
- nama vendor tidak boleh menjadi permanent label di atas map;
- nama vendor tampil setelah klik kota/wilayah atau membuka detail;
- marker harus menunjukkan lokasi/coverage, bukan menjadi pengganti tabel vendor.

## 7. Interaksi search lokasi

Search harus terasa familiar seperti aplikasi peta modern.

User dapat mencari:
- kota;
- kabupaten;
- provinsi.

Saat lokasi dipilih:
1. map zoom/focus ke area tersebut;
2. wilayah terpilih di-highlight;
3. detail panel muncul;
4. panel menampilkan data operasional ringkas;
5. user dapat lanjut ke daftar vendor atau Compare Vendor.

Jangan menampilkan latitude/longitude kecuali ada kebutuhan debugging/admin.

## 8. Panel detail wilayah

Panel kanan hanya muncul setelah user memilih wilayah.

Konten awal yang direkomendasikan:
- nama kota/kabupaten;
- jumlah vendor terkonfirmasi;
- jumlah vendor aktif jika relevan;
- indikator single-vendor risk jika hanya satu vendor;
- daftar vendor ringkas;
- mode/service atau lead time jika datanya valid;
- CTA seperti `Lihat Vendor` atau `Bandingkan Vendor`.

Jangan isi panel dengan seluruh field master.

Jika data coverage kosong, gunakan wording seperti:
- `Belum ada coverage terkonfirmasi`
- `Belum terdata di master`

Jangan menyimpulkan `tidak dilayani` jika datanya hanya belum lengkap.

## 9. Legend Coverage Map

Legend harus sangat kecil dan jelas.

Default yang disukai:
- Multi Vendor
- Single Vendor
- Belum Terdata

Tambahkan kategori lain hanya jika benar-benar dibutuhkan.

Jangan membuat legend panjang yang memerlukan user membaca paragraf.

## 10. Visual style Coverage Map

Map harus menyatu dengan design system LogiScope:
- base map light grey/off-white;
- laut very light blue-grey;
- label geografis dark grey;
- coverage utama biru/teal;
- single-vendor risk amber;
- unknown/belum terdata grey;
- selected area memiliki highlight yang lebih kuat namun tetap elegan.

Hindari rainbow map atau terlalu banyak kategori warna.

## 11. Hal yang harus dibuang dari map utama

Jangan tampilkan permanen di area utama Coverage Map:
- paragraf penjelasan panjang;
- technical metadata;
- koordinat;
- source row/source sheet;
- semua status komersial sekaligus;
- nama seluruh vendor di atas peta;
- statistik yang sudah ada di Dashboard;
- legend besar;
- banyak badge yang saling bersaing;
- tulisan tutorial yang tetap tampil setelah user mengerti halaman.

Informasi tersebut boleh tersedia di detail, tooltip, Data Health, atau audit view.

## 12. Coverage Map vs Compare Vendor

Jaga pemisahan konsep:

### Coverage Map
Pertanyaan:
> “Wilayah ini punya coverage vendor atau tidak?”

### Compare Vendor / Route Search
Pertanyaan:
> “Untuk Origin A → Destination B, vendor mana yang bisa dipakai?”

Jangan memasukkan semua fungsi Route Search ke Coverage Map. Boleh sediakan CTA untuk melanjutkan ke Compare Vendor dengan lokasi yang sudah terisi.

## 13. Dashboard tidak boleh mengulang Coverage Map penuh

Dashboard boleh memiliki mini map/hero map untuk overview, tetapi:
- tidak perlu seluruh interaction Coverage Map;
- jangan duplikasi seluruh filter;
- klik map/CTA dapat membawa user ke Coverage Map.

Dashboard adalah overview, Coverage Map adalah exploration tool.

## 14. Aturan copywriting UI

Gunakan teks sesingkat mungkin.

Lebih baik:
- `Belum terdata`
- `12 vendor`
- `Single vendor risk`
- `Lihat Vendor`
- `Bandingkan Vendor`

Daripada paragraf panjang yang menjelaskan hal yang sudah terlihat dari UI.

Jika user butuh penjelasan, gunakan tooltip/help icon atau empty state yang kontekstual.

## 15. Aturan card dan badge

Card dan badge bukan default solution.

Sebelum membuat card baru:
- cek apakah bisa menjadi row, inline stat, tooltip, panel detail, atau text biasa;
- hindari nested card di dalam card;
- jangan membuat card hanya untuk satu label kecil;
- dashboard boleh memakai card lebih banyak daripada halaman task-oriented.

Coverage Map harus menggunakan card seminimal mungkin agar map tetap dominan.

## 16. Aturan Data Health

Data Health adalah tempat untuk data quality detail.

Kalau ada field kosong atau mismatch:
- jangan memenuhi halaman operasional dengan warning teknis;
- tampilkan warning singkat jika mempengaruhi keputusan;
- arahkan detail perbaikannya ke Data Health.

Contoh:
`Lead time belum tersedia` cukup pada vendor result.
Source row/file tidak perlu tampil kecuali audit/detail.

## 17. Jangan mengarang data untuk mempercantik UI

Dilarang:
- membuat angka KPI placeholder seolah data aktual;
- membuat coverage area yang tidak ada sumbernya;
- mengisi lead time kosong dengan asumsi;
- menganggap vendor tidak melayani hanya karena rate kosong;
- membuat harga estimasi dari distance tanpa aturan bisnis yang valid.

Jika data belum tersedia, tampilkan state yang jujur dan rapi.

## 18. Technical UX principle

Gunakan teknologi yang sudah ada jika masih memadai.

Untuk Coverage Map, Leaflet + basemap yang tepat masih memadai. Jangan mengganti stack hanya karena tampilan map kurang bagus.

Urutan pemecahan masalah:
1. perbaiki hierarchy/layout;
2. perbaiki basemap/style;
3. perbaiki layer order/opacity;
4. perbaiki clustering/zoom behavior;
5. baru pertimbangkan perubahan library jika ada kebutuhan nyata yang tidak bisa dipenuhi.

Hindari overengineering.

## 19. Acceptance criteria Coverage Map

Sebelum menganggap Coverage Map selesai, cek minimal:

- [ ] Map menjadi elemen terbesar halaman.
- [ ] Nama wilayah/kota masih bisa terbaca pada zoom yang sesuai.
- [ ] Overlay coverage tidak menutup seluruh context geografis.
- [ ] Tidak ada paragraf panjang di atas/di dalam map.
- [ ] Tidak ada vendor names permanen memenuhi map.
- [ ] Marker banyak menggunakan clustering atau mekanisme decluttering.
- [ ] Search kota/kabupaten mem-focus map ke lokasi yang dipilih.
- [ ] Klik wilayah membuka detail panel yang ringkas.
- [ ] Panel detail tidak tampil sebelum ada selection kecuali benar-benar diperlukan.
- [ ] Single-vendor area dapat dibedakan dari multi-vendor area.
- [ ] Area tanpa data disebut belum terdata, bukan otomatis tidak dilayani.
- [ ] CTA ke Vendor/Compare Vendor tersedia ketika relevan.
- [ ] Layout tetap nyaman pada laptop kantor.
- [ ] Tidak ada approved rate yang berubah akibat pekerjaan UI.

## 20. Acceptance criteria umum UI LogiScope

Setiap perubahan besar harus lolos pemeriksaan berikut:

### Clarity
- Dalam 3 detik, user tahu halaman ini untuk apa.
- Primary action jelas.

### Density
- Tidak ada informasi yang tampil dua kali tanpa alasan.
- Detail hanya muncul saat dibutuhkan.

### Readability
- Body/table text sekitar 13–14 px desktop.
- Kontras cukup.
- Tidak ada label kecil yang sulit dibaca.

### Operational usefulness
- Setiap elemen utama membantu pekerjaan Logistik.
- Technical metadata tidak mendominasi.

### Data integrity
- Tidak ada data kosong yang ditebak.
- Approved rate tetap immutable.
- Capability, coverage, dan commercial status tetap dipisahkan.

### Maintainability
- Gunakan solusi paling sederhana yang bisa memenuhi kebutuhan.
- Hindari dependency/library baru tanpa kebutuhan nyata.
- Jangan duplikasi business rule di banyak tempat.

## 21. Cara Codex mengambil keputusan saat requirement tidak eksplisit

Jika ada detail yang belum disebutkan user, gunakan urutan prioritas berikut:
1. data integrity & security;
2. tujuan operasional halaman;
3. simplicity;
4. readability;
5. consistency dengan design system;
6. visual polish;
7. novelty.

Jika harus memilih antara tampilan lebih cantik tetapi lebih ramai vs lebih sederhana tetapi lebih jelas, pilih **lebih jelas**.

Jika harus memilih antara fitur baru vs memperbaiki workflow inti yang belum nyaman, perbaiki **workflow inti** dulu.

Jika harus memilih antara mengganti teknologi vs memperbaiki konfigurasi/UX dari teknologi yang sudah ada, pilih **memperbaiki yang ada** selama masih memadai.
