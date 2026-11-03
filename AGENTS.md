# LogiScope — Handoff untuk Codex

## Wajib dibaca sebelum coding
Sebelum mengubah implementasi apa pun, baca dalam urutan berikut:
1. `AGENTS.md` — aturan kerja utama.
2. `PROJECT_CONTEXT.md` — konteks produk, data, arsitektur, dan keputusan proyek.
3. `UX_PRODUCT_RULES.md` — prinsip product judgment dan UX.
4. `UI_AUDIT_DECISIONS.md` — keputusan UI terbaru berdasarkan audit tampilan aktual.
5. Jika ada `MASTER_GOVERNANCE.md`, gunakan sebagai governance reference utama untuk keputusan engineering substantif.

Jika ada konflik, prioritaskan:
**keamanan & integritas data → instruksi terbaru di AGENTS.md → keputusan audit UI terbaru → governance → konteks produk → UX rules → visual polish.**

Gunakan Bahasa Indonesia untuk komunikasi, laporan perubahan, dan dokumentasi internal.

---

## Cara berpikir sebelum coding
Codex tidak boleh langsung menambah elemen hanya karena requirement menyebut sebuah informasi.

Sebelum implementasi:
- inspect implementasi aktual terlebih dahulu;
- pahami pekerjaan utama user pada layar tersebut;
- identifikasi informasi yang benar-benar dibutuhkan untuk menyelesaikan pekerjaan;
- hapus atau pindahkan elemen redundant sebelum menambah elemen baru;
- pertahankan behavior/business rule yang sudah benar;
- pisahkan informasi primer, supporting detail, dan audit/technical detail;
- pilih solusi paling sederhana yang reliable;
- jangan mengganti stack/library jika masalah bisa diselesaikan lewat layout, styling, konfigurasi, atau data flow yang ada.

Prinsip default:
- **Inspect before modifying.**
- **Preserve correct existing behavior.**
- **Remove before add.**
- **Progressive disclosure.**
- **One screen, one dominant job.**
- **Operational usefulness > decoration.**
- **Clarity > novelty.**
- **Jangan overengineering.**

---

## Produk
Bangun dan pelihara **LogiScope**, aplikasi internal tim Logistik PT Prasetia Dwidharma untuk membantu keputusan operasional harian.

Nama produk utama: **LogiScope**.

Jangan gunakan `Logistics Coverage Hub` sebagai nama utama UI final. Jika descriptor di bawah logo tidak menambah value, hapus. Jika descriptor tetap diperlukan, gunakan wording generik/internal seperti `Internal Logistics Platform`.

---

## Modul utama final
Sidebar utama hanya:
1. **Dashboard**
2. **Compare Vendor**
   - Route Search
   - Vendor Directory
   - Vendor Comparison
3. **Coverage Map**
4. **Load Planner**
5. **Armada Guide**
6. **Data Health**

Jangan menambah top-level menu untuk informasi pendukung.

---

## Keputusan UI terbaru — wajib diikuti
Detail lengkap ada di `UI_AUDIT_DECISIONS.md`.

### 1. Kurangi explanatory copy
Halaman operasional tidak boleh dipenuhi subtitle/helper text yang menjelaskan hal obvious.

Secara khusus:
- Measure Distance/Ukur Jarak: hapus tutorial permanen dan paragraf teknis; pertahankan field, action, hasil, dan satu caveat singkat bila perlu.
- Compare Vendor: hapus subtitle panjang tentang origin→destination, instruksi membandingkan vendor, dan rekomendasi default. Cukup heading + Origin + Destination + Cari Vendor + Hasil Pencarian + empty state singkat.
- Vendor Directory: hapus subtitle `Capability, cakupan, dan kesiapan komersial ditampilkan secara terpisah.` Konsepnya tetap benar di model data, tetapi tidak perlu menjadi teks permanen.

Business rule tetap berjalan di logic walaupun copy penjelasannya dihapus.

### 2. Account area harus terlihat fungsional
Area kanan atas `Tim Logistik` harus terlihat sebagai identitas account/workspace, bukan dekorasi.

Arah:
- avatar/icon;
- `Tim Logistik` sebagai primary label;
- `Akses internal` sebagai secondary label;
- hover/click affordance hanya jika memang ada action;
- jangan membuat fake dropdown.

### 3. Dashboard map dan Coverage Map harus beda fungsi
Dashboard boleh punya peta, tetapi hanya sebagai **Coverage Snapshot/overview**.

Dashboard map:
- memberi gambaran dalam 2–3 detik;
- lebih sederhana;
- tidak membawa full filter/exploration/detail panel;
- punya CTA seperti `Buka Coverage Map` / `Lihat Semua`.

Coverage Map:
- full geographic exploration;
- search kota/kabupaten/provinsi;
- zoom/pan;
- progressive labels;
- filter;
- click wilayah;
- detail panel;
- clustering/decluttering;
- gap coverage dan single-vendor risk;
- CTA ke Compare Vendor/Vendor Directory.

Jika kedua map terasa sama, kurangi fungsi Dashboard map. Jangan menghapus Coverage Map hanya karena Dashboard punya preview map.

### 4. Coverage Map jangan penuh tulisan
- map dominan;
- label kota/kabupaten harus terbaca sesuai zoom;
- jangan permanent tooltip panjang;
- jangan permanent vendor labels;
- legend compact;
- detail muncul setelah selection;
- metadata geografis/technical detail pindahkan ke tooltip/help/documentation bila perlu.

---

## Dashboard
Dashboard adalah overview, bukan tempat menaruh semua data.

Pertahankan:
- KPI penting;
- coverage snapshot;
- insight cepat;
- quick action;
- ringkasan data health.

Jangan menduplikasi full functionality dari Coverage Map, Compare Vendor, atau halaman spesialis lain.

Untuk setiap card/chart/section, tanyakan:
- apakah ini membantu user memahami kondisi dalam beberapa detik?
- apakah informasi ini sudah ada di halaman lain?
- apakah cukup penting untuk mengambil ruang Dashboard?

Jika tidak, kecilkan, pindahkan, atau hapus.

---

## Compare Vendor
Primary job: mencari vendor berdasarkan **Origin + Destination** dan membandingkan vendor yang punya route evidence relevan.

Tampilkan hasil yang membantu keputusan:
- nama vendor;
- mode/service;
- vehicle/armada;
- lead time;
- status operasional;
- commercial readiness;
- distance jika relevan;
- rate hanya jika akses internal/role sudah aman.

Jangan menyimpulkan vendor tidak bisa melayani hanya karena tidak punya KHS/rate.

---

## Coverage Map
Primary question:
> “Daerah mana yang sudah punya vendor, seberapa kuat coverage-nya, dan siapa vendornya ketika wilayah dipilih?”

Aturan:
- gunakan peta geografis Indonesia nyata;
- map dominan;
- actual data only;
- jangan mengarang coverage;
- progressive zoom untuk label;
- overlay tidak menutup geographic context;
- clustering/decluttering untuk marker banyak;
- search lokasi focus ke wilayah;
- detail panel ringkas setelah selection;
- legend kecil;
- jangan berubah menjadi Route Search;
- CTA boleh membawa context ke Compare Vendor.

---

## Vendor Directory
Gunakan tabel/list vertikal, satu vendor per baris.

Target kolom:
- Vendor
- Status
- Kelompok
- Layanan
- Base / Branch
- Cakupan Area
- KHS / Commercial Status
- Aksi

Pisahkan `Base / Branch` dan `Cakupan Area`.

Jika Cakupan Area kosong, gunakan `Belum diisi di Vendor Master`; jangan menyimpulkan tidak punya coverage.

---

## Load Planner
Jangan rekomendasikan armada hanya dari volume.

Pertimbangkan:
- panjang/lebar/tinggi barang;
- qty;
- volume total;
- berat/payload;
- dimensi bak;
- stacking bila relevan.

Hasil adalah alat bantu planning, bukan jaminan muat lapangan.

---

## Armada Guide
Gunakan satu master referensi untuk:
- jenis armada;
- dimensi bak;
- volume teoritis;
- payload;
- body type;
- kegunaan;
- keterbatasan/loading notes.

Jangan hard-code angka referensi yang sama di banyak tempat.

---

## Data Health
Technical/audit detail sebaiknya diarahkan ke sini.

Contoh issue:
- cakupan kosong;
- lead time kosong;
- PIC/contact belum lengkap;
- legal entity mismatch;
- quotation belum approved;
- duplicate vendor;
- route tanpa origin/destination lengkap.

Jangan diam-diam mengisi data kosong dengan asumsi.

---

## Data model & commercial rules
Sumber utama: Google Sheet `Logistics Coverage Hub - Central Master`.

Pisahkan:
1. **Capability** — vendor bisa melakukan apa.
2. **Coverage** — area/rute yang dilayani.
3. **Commercial/KHS** — kontrak/quotation/negosiasi/rate.

Approved rate adalah data terkunci:
- jangan hitung ulang;
- jangan rounding tanpa instruksi eksplisit;
- jangan overwrite karena quotation/counter baru;
- setiap perubahan komersial harus traceable.

Model route selalu mempertahankan **Origin + Destination**. Jangan infer route hanya dari destination.

Vendor ID adalah internal stable key. Jangan mengubah Vendor ID hanya karena nama/legal entity vendor diperbaiki.

---

## Security
- Jangan commit rate, PIC, nomor telepon, email, alamat sensitif, atau snapshot data operasional ke repo publik.
- Jangan kirim seluruh field sensitif ke browser lalu menyembunyikannya dengan CSS/JS.
- Filter data sensitif di server-side Apps Script.
- Jangan menambah field rate ke response browser tanpa requirement eksplisit dan authorization yang benar.
- Perubahan UI tidak boleh melemahkan access control.

---

## Arsitektur saat ini
Production: **Google Apps Script Web App**.

Flow:
User → LogiScope → Apps Script server-side → Central Master Google Sheet.

- `Code.gs`: logic server-side.
- `Index.html`: UI internal.
- GitHub: source/handoff, bukan URL operasional final.

Jangan mengganti arsitektur hanya untuk memperbaiki UX.

---

## Visual direction
- sidebar navy gelap;
- content area terang/putih;
- biru sebagai primary action;
- teal/cyan secondary accent;
- status color konsisten;
- spacing lega;
- body/table sekitar 13–14 px desktop;
- desktop/laptop kantor adalah prioritas;
- card bukan default solution;
- jangan nested card berlebihan;
- jangan gunakan banyak warna hanya untuk terlihat menarik.

Eye-catching berarti hierarchy kuat dan informasi mudah dipindai, bukan ramai.

---

## Definition of done
Sebelum menyatakan pekerjaan UI selesai, cek:

### UX
- primary job halaman jelas dalam 3 detik;
- tidak ada informasi redundant tanpa alasan;
- explanatory copy minimal;
- detail sekunder muncul saat dibutuhkan;
- account area terlihat fungsional;
- Dashboard map dan Coverage Map tidak double fungsi;
- body text nyaman dibaca;
- laptop layout tetap usable.

### Data
- tidak ada data kosong yang ditebak;
- approved rate tidak berubah;
- origin→destination logic tetap benar;
- capability, coverage, commercial status tetap terpisah;
- tidak ada sensitive field baru yang bocor ke browser.

### Engineering
- perubahan incremental;
- preserve behavior yang benar;
- tidak menambah dependency tanpa kebutuhan nyata;
- tidak overengineering;
- laporkan file yang diubah, behavior yang dipertahankan, dan trade-off penting.

Sebelum final response, review acceptance criteria di `UX_PRODUCT_RULES.md` dan `UI_AUDIT_DECISIONS.md`.