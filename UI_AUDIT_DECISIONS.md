# LogiScope — UI Audit Decisions

Dokumen ini berisi keputusan UX terbaru berdasarkan audit tampilan aktual LogiScope. Ini bukan ide opsional. Gunakan sebagai keputusan produk terbaru saat memperbaiki UI.

## 1. Tujuan audit terbaru

UI LogiScope saat ini masih terlalu banyak explanatory copy, beberapa elemen terasa dekoratif, dan ada overlap fungsi antara Dashboard dan Coverage Map.

Arah perbaikan:
- kurangi teks yang tidak membantu keputusan;
- perjelas hierarchy;
- bedakan preview/overview dari full-feature tool;
- jangan menampilkan penjelasan permanen untuk hal yang sudah jelas dari UI;
- gunakan progressive disclosure;
- pertahankan data integrity dan behavior yang benar.

## 2. Aturan copywriting: hapus teks yang redundant

Untuk halaman operasional, jangan gunakan subtitle atau helper text hanya untuk menjelaskan fungsi yang sudah obvious dari field, tombol, atau judul halaman.

Gunakan prinsip:
> Jika user tetap bisa menyelesaikan tugas dengan benar setelah teks dihapus, teks tersebut kemungkinan tidak perlu tampil permanen.

### 2.1 Measure Distance / Ukur Jarak

Hapus explanatory copy permanen seperti:
- `Pilih kota/kabupaten, atau tentukan dua titik langsung pada peta.`
- `Pilih nama kota/kabupaten atau gunakan tombol pilih titik di peta.`
- paragraf panjang mengenai jumlah tujuan yang memiliki harga;
- penjelasan panjang mengenai arti warna wilayah;
- technical note seperti referensi boundary geografis pada area utama.

Pertahankan hanya:
- judul `Ukur Jarak`;
- field Asal;
- field Tujuan;
- tombol pilih titik bila masih dibutuhkan;
- tombol `Ukur Jarak`;
- tombol `Reset`;
- hasil `Garis lurus`;
- hasil `Jalan / driving`;
- satu catatan singkat bila perlu: `Estimasi jalan bukan dasar tarif resmi.`

Jangan tampilkan koordinat sebagai value utama ke user normal jika user memilih kota/kabupaten. Koordinat boleh menjadi internal/debug detail.

### 2.2 Compare Vendor

Hapus copy permanen seperti:
- `Hasil berasal dari pasangan origin → destination; arah balik dicari secara terpisah.`
- `Cari rute, pilih vendor, lalu bandingkan layanan dan harga berizin.`
- `Rekomendasi default: vendor Aktif dari kelompok Ekspedisi / Transport...`

UI ideal cukup memiliki:
- heading `Compare Vendor`;
- Origin;
- Destination;
- tombol `Cari Vendor`;
- section `Hasil Pencarian`;
- empty state singkat: `Pilih origin dan destination untuk melihat vendor.`

Business rule tentang arah route, status vendor, atau filter default tetap harus dijalankan di logic, tetapi tidak perlu dijadikan paragraf permanen di UI.

Jika perlu edukasi, gunakan tooltip/help icon/empty state kontekstual, bukan subtitle panjang.

### 2.3 Vendor Directory

Hapus subtitle seperti:
- `Capability, cakupan, dan kesiapan komersial ditampilkan secara terpisah.`

Konsep tersebut tetap penting pada data model, tetapi jangan menjadi explanatory copy permanen.

Halaman cukup fokus pada:
- judul `Direktori Vendor`;
- filter;
- tabel/list vendor;
- action yang relevan.

Gunakan label kolom dan status yang jelas agar user memahami struktur tanpa paragraf tutorial.

## 3. User / Login area harus terlihat fungsional, bukan dekorasi

Area kanan atas yang menampilkan `Tim Logistik` tidak boleh terasa seperti hiasan.

Tujuan area ini:
- menunjukkan identitas session/workspace;
- memperjelas bahwa user sedang menggunakan akses internal;
- menyediakan tempat natural untuk user/session action jika nanti diperlukan.

Arah visual:
- tampil sebagai compact account/workspace control;
- avatar/icon + `Tim Logistik` sebagai primary label;
- `Akses internal` sebagai secondary label kecil;
- seluruh block memiliki hover/click affordance bila ada action;
- boleh memiliki chevron/dropdown jika memang ada menu profil/session;
- jangan gunakan divider berlebihan;
- jangan membuatnya terlihat seperti teks dekoratif di samping icon refresh/notifikasi.

Jika tidak ada fungsi dropdown saat ini, tetap buat visual hierarchy yang jelas tetapi jangan membuat fake interaction.

## 4. Dashboard vs Coverage Map: jangan double fungsi

Dashboard boleh memiliki peta, tetapi peta Dashboard dan halaman Coverage Map harus punya peran berbeda secara tegas.

### 4.1 Dashboard map = Coverage Snapshot

Peta di Dashboard adalah overview/preview saja.

Tujuan:
- memberi gambaran coverage dalam 2–3 detik;
- menunjukkan kondisi umum;
- memberi visual hero yang eye-catching;
- menyediakan CTA ke Coverage Map.

Dashboard map TIDAK boleh menjadi full Coverage Map.

Jangan duplikasi di Dashboard:
- seluruh filter Coverage Map;
- full city/kabupaten exploration;
- detail panel lengkap;
- route measurement workflow lengkap;
- seluruh legend/status teknis;
- seluruh interaction untuk analisis wilayah.

Dashboard map harus lebih ringan, lebih sederhana, dan fokus pada snapshot.

Gunakan label section seperti:
- `Coverage Snapshot`
atau
- `Coverage Indonesia`

Sediakan CTA:
- `Buka Coverage Map`
atau
- `Lihat Semua`

### 4.2 Coverage Map = Full geographic exploration

Coverage Map tetap menjadi menu utama karena fungsinya berbeda dari Dashboard.

Coverage Map adalah tempat untuk:
- search kota/kabupaten/provinsi;
- zoom dan pan;
- progressive geographic labels;
- filter coverage;
- click wilayah;
- panel detail wilayah;
- cluster/declutter marker;
- gap coverage;
- single-vendor risk;
- CTA lanjutan ke Compare Vendor/Vendor Directory.

Jika Dashboard map sudah menyediakan fungsi yang sama lengkapnya, kurangi fungsi Dashboard map. Jangan menghapus Coverage Map hanya karena ada preview map di Dashboard.

## 5. Coverage Map tidak boleh penuh tulisan

Pada map utama:
- jangan tampilkan tooltip panjang permanen;
- jangan tampilkan nama seluruh vendor;
- jangan tampilkan technical metadata;
- jangan tampilkan paragraph di bawah map yang menjelaskan hal yang sudah bisa dibaca dari visual;
- legend harus compact;
- detail muncul setelah selection;
- nama kota/kabupaten harus tetap terbaca sesuai zoom.

Jika ada informasi panjang seperti sumber geografis, metodologi, atau caveat teknis, pindahkan ke:
- tooltip info;
- help dialog;
- Data Health;
- technical documentation.

## 6. Sidebar dan branding

Sidebar utama tetap:
1. Dashboard
2. Compare Vendor
   - Route Search
   - Vendor Directory
   - Vendor Comparison
3. Coverage Map
4. Load Planner
5. Armada Guide
6. Data Health

Jangan menambah menu baru hanya untuk informasi pendukung.

Brand utama adalah `LogiScope`.

Subtitle `Logistics Coverage Hub` di bawah logo bukan nama utama lagi. Bila subtitle diperlukan, pilih descriptor yang lebih generic/internal, misalnya `Internal Logistics Platform`; bila tidak menambah value, hapus subtitle sama sekali.

## 7. Dashboard: kurangi elemen yang hanya mengisi ruang

Dashboard bukan tempat untuk menaruh semua data.

Pertahankan hanya insight yang benar-benar membantu overview.

Untuk setiap card/chart/section, tanyakan:
- apakah ini membantu user memahami kondisi operasional dalam beberapa detik?
- apakah informasi ini sudah ada di halaman spesialis?
- apakah section ini cukup penting untuk mengambil ruang dashboard?

Jika tidak, hapus atau pindahkan.

Contoh: `Statistik Layanan` tidak harus besar jika hanya berisi sedikit data. Boleh diperkecil atau diganti menjadi ringkasan lebih compact agar map/insight utama tidak kalah dominan.

## 8. Empty state dan helper text

Helper text tidak dilarang, tetapi harus kontekstual.

Gunakan helper text hanya jika:
- user bisa salah menginterpretasikan action;
- ada constraint yang penting untuk mencegah error;
- data kosong butuh next step.

Contoh baik:
- `Pilih origin dan destination untuk melihat vendor.`
- `Lead time belum tersedia.`
- `Belum ada coverage terkonfirmasi.`

Contoh buruk:
- paragraf yang menjelaskan fitur yang sudah jelas dari judul/field;
- technical implementation note;
- data policy note yang tidak relevan dengan task saat itu.

## 9. Acceptance criteria audit terbaru

Sebelum pekerjaan dianggap selesai, cek:

### Copy density
- [ ] Tidak ada subtitle redundant pada Measure Distance, Compare Vendor, dan Vendor Directory.
- [ ] Tidak ada paragraf panjang permanen di area operasional utama.
- [ ] Helper text hanya muncul jika mencegah kebingungan atau error.

### Account area
- [ ] `Tim Logistik` terlihat sebagai identitas account/workspace, bukan dekorasi.
- [ ] `Akses internal` menjadi secondary label.
- [ ] Tidak ada fake dropdown/action jika belum ada behavior-nya.

### Dashboard map
- [ ] Dashboard map hanya coverage snapshot/overview.
- [ ] Dashboard map tidak menduplikasi full Coverage Map.
- [ ] Ada CTA yang jelas ke Coverage Map.

### Coverage Map
- [ ] Full geographic exploration hanya berada di Coverage Map.
- [ ] Nama kota/kabupaten terbaca sesuai zoom.
- [ ] Detail wilayah muncul setelah selection.
- [ ] Legend compact.
- [ ] Tidak penuh tooltip/technical text permanen.

### Branding
- [ ] `LogiScope` adalah nama utama.
- [ ] `Logistics Coverage Hub` tidak dipakai sebagai nama utama UI.

### Data safety
- [ ] Perubahan UI tidak mengubah approved rate.
- [ ] Route logic origin → destination tetap benar.
- [ ] Tidak ada data kosong yang ditebak.
- [ ] Tidak ada field sensitif baru yang dikirim ke browser.

## 10. Cara melakukan pekerjaan ini

Saat diminta memperbaiki UI berdasarkan audit:
1. Inspect implementasi aktual terlebih dahulu.
2. Identifikasi komponen/DOM/CSS yang menghasilkan elemen bermasalah.
3. Pertahankan behavior/business logic yang benar.
4. Hapus copy redundant sebelum redesign besar.
5. Bedakan Dashboard map dan Coverage Map secara fungsional.
6. Rapikan account area tanpa membuat fake functionality.
7. Uji state kosong, state hasil, map interaction, dan responsive desktop/laptop.
8. Laporkan apa yang dihapus, apa yang diubah, dan apa yang sengaja dipertahankan.

Jangan mengerjakan redesign besar yang tidak diperlukan. Prioritaskan perubahan paling sederhana yang menghasilkan UX lebih bersih dan jelas.
