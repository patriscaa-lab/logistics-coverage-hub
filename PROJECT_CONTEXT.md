# LogiScope — Project Context

Dokumen ini adalah memori proyek untuk membantu Codex memahami konteks LogiScope tanpa perlu membaca seluruh riwayat percakapan.

> Urutan baca yang diharapkan: `AGENTS.md` terlebih dahulu untuk aturan kerja, lalu `PROJECT_CONTEXT.md` untuk konteks produk, data, keputusan, dan arah pengembangan.

## 1. Ringkasan produk

**LogiScope** adalah aplikasi internal untuk membantu tim Logistik mengambil keputusan operasional dengan cepat. Produk ini bukan sekadar database vendor, tetapi alat bantu keputusan logistik.

Pertanyaan utama yang harus bisa dijawab LogiScope:
- Vendor mana yang bisa melayani rute tertentu?
- Apa mode/armada yang tersedia?
- Berapa lead time-nya?
- Bagaimana status kerja sama atau kesiapan komersialnya?
- Bagaimana coverage vendor di Indonesia?
- Apakah ada area yang hanya bergantung pada satu vendor?
- Berapa volume total barang berdasarkan dimensi dan qty?
- Armada apa yang secara dimensi, volume, dan payload paling masuk akal?
- Data master mana yang masih belum lengkap atau bermasalah?

Nama produk final: **LogiScope**.

## 2. Pengguna utama

Pengguna utama adalah tim Logistik internal PT Prasetia Dwidharma, terutama untuk kebutuhan harian seperti:
- mencari vendor berdasarkan rute;
- membandingkan vendor;
- mengecek coverage;
- memahami lead time;
- membantu planning armada;
- memahami karakteristik kendaraan;
- mengecek kualitas master data.

Aplikasi harus terasa cepat, praktis, mudah dipahami, dan nyaman digunakan oleh user non-teknis.

## 3. Modul utama final

Sidebar utama hanya menampilkan enam modul:

1. **Dashboard**
2. **Compare Vendor**
3. **Coverage Map**
4. **Load Planner**
5. **Armada Guide**
6. **Data Health**

Jangan memenuhi sidebar dengan terlalu banyak menu. Fitur pendukung seperti Vendor Directory, route search, vendor detail, dan search/filter ditempatkan di dalam modul yang paling relevan.

## 4. Dashboard

Tujuan Dashboard adalah memberi gambaran kondisi Logistik dalam beberapa detik.

Elemen yang diinginkan:
- KPI total vendor;
- vendor Aktif;
- vendor Freeze;
- vendor Belum Pernah Kerja Sama;
- vendor Tidak Aktif;
- jumlah kota/area dengan coverage terkonfirmasi;
- single-vendor risk;
- status KHS/commercial readiness;
- ringkasan kualitas data;
- shortcut ke Compare Vendor, Coverage Map, Load Planner, Armada Guide, dan Data Health;
- peta Indonesia sebagai visual hero utama jika cocok dengan layout.

Dashboard bukan tempat menampilkan tabel panjang.

## 5. Compare Vendor

Ini adalah salah satu modul terpenting.

### 5.1 Route Search
User memilih:
- Origin
- Destination

Lalu sistem menampilkan vendor yang memang punya route evidence yang relevan.

Hasil minimal:
- Nama vendor
- Mode/service
- Armada/vehicle type
- Lead time
- Status vendor
- Status kesiapan komersial
- Estimasi jarak jika tersedia

Jangan menganggap vendor tidak bisa melayani hanya karena tidak punya KHS atau harga.

### 5.2 Vendor Comparison
User dapat memilih beberapa vendor untuk dibandingkan dalam satu tampilan.

Perbandingan dapat mencakup:
- lead time;
- jenis layanan;
- armada;
- coverage;
- status vendor;
- status KHS/commercial readiness;
- catatan operasional;
- tarif hanya jika akses internal berbasis role memang sudah aman.

### 5.3 Vendor Directory
Vendor Directory berada di bawah Compare Vendor atau halaman turunannya.

Tampilkan semua vendor, termasuk yang belum punya KHS.

Gunakan list/tabel vertikal, satu vendor per baris.

Kolom ideal:
- Vendor
- Status
- Kelompok
- Layanan
- Base / Branch
- Cakupan Area
- KHS / Commercial Status
- Aksi

Filter status:
- Semua Status
- Aktif
- Freeze
- Belum Pernah Kerja Sama
- Tidak Aktif

Filter kelompok:
- Ekspedisi / Transport
- Asuransi & Support
- Internal / Self Pickup / Mitra
- Semua Kelompok

`Base / Branch` dan `Cakupan Area` harus menjadi kolom terpisah.

Jika `Cakupan Area` kosong, tampilkan **Belum diisi di Vendor Master**. Jangan menyimpulkan vendor tidak punya coverage.

## 6. Coverage Map

Coverage Map menggunakan peta geografis Indonesia sungguhan.

Tujuan:
- melihat distribusi vendor;
- melihat kota/area dengan banyak pilihan vendor;
- melihat single-vendor city;
- melihat gap coverage;
- membantu strategi penambahan vendor.

Aturan:
- jangan gunakan bentuk pulau schematic;
- jangan membuat coverage berdasarkan tebakan;
- gunakan actual route evidence dan/atau structured coverage data;
- origin dan destination terpilih harus terlihat berbeda;
- route line boleh ditampilkan;
- estimasi kilometer boleh ditampilkan jika sumber perhitungannya wajar;
- estimasi road distance untuk rute lintas pulau/multimodal tidak boleh dianggap sebagai basis tarif resmi.

## 7. Load Planner

Load Planner menghitung kebutuhan muatan berdasarkan data barang.

### Input minimum
- Nama/material
- Panjang per unit
- Lebar per unit
- Tinggi per unit
- Qty
- Berat per unit jika ada
- Opsi stacking jika relevan

### Perhitungan
- Volume per unit = panjang × lebar × tinggi
- Volume total = volume per unit × qty
- Berat total = berat per unit × qty
- Dimensi terpanjang

Gunakan satuan yang jelas dan lakukan konversi ke m³/kg jika input berbeda.

### Output
- total qty;
- total volume;
- total berat;
- rekomendasi armada;
- alasan rekomendasi;
- warning jika barang terlalu panjang/lebar/tinggi;
- warning jika payload terlampaui;
- indikator apakah kapasitas armada terlalu kecil, cukup, atau terlalu besar.

Jangan merekomendasikan armada hanya berdasarkan volume. Wajib mempertimbangkan:
- dimensi fisik bak;
- payload;
- volume;
- keterbatasan stacking;
- bentuk barang jika datanya tersedia.

Hasil Load Planner adalah alat bantu planning, bukan jaminan muat di lapangan.

Idealnya setelah rekomendasi armada muncul, user dapat menuju **Compare Vendor** untuk mencari vendor yang memiliki armada tersebut.

## 8. Armada Guide

Armada Guide adalah knowledge base kendaraan untuk edukasi tim.

Tiap armada idealnya memiliki:
- Nama armada
- Kategori
- Panjang bak
- Lebar bak
- Tinggi bak
- Volume teoritis
- Payload umum/maksimum
- Tipe body: bak terbuka, box, wingbox, container, dll.
- Kegunaan umum
- Contoh barang yang cocok
- Catatan loading
- Keterbatasan dimensi
- Ilustrasi sederhana jika tersedia

Master Armada Guide harus menjadi referensi yang dapat dipakai oleh Load Planner.

Jangan hard-code angka armada di banyak tempat. Gunakan satu master referensi.

## 9. Data Health

Data Health membantu Supervisor melihat kualitas master data.

Contoh issue yang harus bisa terdeteksi:
- Cakupan Area kosong
- Lead time kosong
- Route ada tetapi status komersial belum jelas
- Vendor aktif tetapi PIC/contact belum lengkap
- Legal entity mismatch
- Quotation belum approved
- Data armada belum lengkap
- Duplikasi vendor
- Data status tidak konsisten
- Route tanpa origin/destination lengkap

Data Health tidak boleh diam-diam memperbaiki atau menebak data. Tampilkan issue agar bisa ditindaklanjuti.

## 10. Struktur data utama

Sumber utama saat ini adalah Google Sheet **Logistics Coverage Hub - Central Master**.

Sheet penting:
- `Vendor Master`
- `Route & Rate Master`
- `Approved Rate Audit`
- `Data Quality`

Gunakan Google Sheet sebagai source of truth operasional sampai ada keputusan arsitektur baru.

Jangan menaruh snapshot data operasional sensitif di repository publik.

## 11. Route & Rate Master

Model route harus selalu mempertahankan pasangan:
- Origin
- Destination

Jangan menentukan route hanya dari destination.

Field yang secara konsep sudah ada mencakup:
- Route ID
- Vendor ID
- Vendor Name
- Vendor Match Status
- Route No
- Slot Armada
- Area
- Origin Province
- Origin City
- Destination Province
- Destination City
- Mode
- Service
- Vehicle Type
- Length
- Width
- Height
- Max Payload
- Max Volume
- Lead Time Min
- Lead Time Max
- Rate Basis
- beberapa field komersial/rate
- Approval Status
- Source Confirmation
- Source Price Status
- Price Locked
- Source File
- Source Sheet
- Source Row
- Source Snapshot

Field rate sensitif tidak boleh otomatis dikirim ke browser.

## 12. Vendor Master

Vendor Master memuat vendor transport maupun entitas support/internal.

Status yang digunakan:
- Aktif
- Freeze
- Belum Pernah Kerja Sama
- Tidak Aktif

Jangan gunakan status KHS sebagai penentu apakah vendor boleh muncul di directory.

Pisahkan tiga konsep:
1. **Capability** — vendor bisa melakukan apa.
2. **Coverage** — area/rute yang dilayani.
3. **Commercial** — status kontrak/quotation/rate.

Kelompok utama:
- Ekspedisi / Transport
- Asuransi & Support
- Internal / Self Pickup / Mitra

Entitas internal, asuransi, customer pickup, implementation partner, dan penjualan material tidak boleh masuk ke hasil route-search normal kecuali benar-benar merupakan transport provider untuk route itu.

## 13. Commercial Status

Gunakan label yang mudah dipahami user:
- **Available & Contracted**
- **Available — Partial Contract**
- **Available — Rate Pending**
- **Quotation Only**

Jangan gunakan istilah seperti `Not Approved` tanpa konteks karena dapat membuat user mengira vendor tidak mampu melayani route.

Approved rate harus diperlakukan sebagai data terkunci.

Aturan penting:
- jangan hitung ulang approved price;
- jangan rounding nilai approved tanpa instruksi eksplisit;
- jangan mengganti approved rate hanya karena ada quotation/counter baru;
- perubahan rate harus traceable ke sumber dan approval.

## 14. Arsitektur aplikasi saat ini

Production yang dipilih saat ini: **Google Apps Script Web App**.

Konsep:

User → LogiScope Web App → Apps Script server-side → Central Master Google Sheet

Ekspektasi:
- `Code.gs` menjalankan logic server-side;
- `Index.html` menjadi UI;
- data sensitif difilter server-side;
- ada tombol `Refresh Data`;
- tidak bergantung pada snapshot static untuk operasi harian.

GitHub dipakai sebagai repository pengembangan/handoff ke Codex, bukan sebagai URL operasional user.

## 15. Keamanan

Prioritas:
- Jangan commit rate, PIC, nomor telepon, email, alamat sensitif, atau snapshot operasional ke repo publik.
- Jangan kirim seluruh kolom komersial dari Apps Script ke browser hanya untuk kemudian disembunyikan dengan CSS/JS.
- Filter field sensitif di server-side.
- Production sebaiknya dibatasi ke user internal seketat konfigurasi Google/Workspace memungkinkan.
- Jangan menganggap landing page publik sebagai mekanisme security.

Catatan penting: deployment Apps Script yang dapat diakses `Anyone with Google account` belum setara dengan organization-only access.

## 16. Arah visual final

User sudah memilih design direction yang eye-catching dan profesional.

### Karakter desain
- modern internal SaaS/logistics dashboard;
- navy gelap;
- biru terang;
- teal/cyan sebagai secondary accent;
- area konten putih/very light gray;
- card putih dengan border/shadow lembut;
- rounded corners secukupnya;
- spacious dan tidak padat;
- tetap terlihat serius untuk penggunaan kantor.

### Layout utama
- sidebar kiri navy gelap;
- hanya satu navigasi utama di sidebar;
- jangan duplikasi menu di header;
- header/top bar hanya untuk branding, search, refresh, notifikasi/utilitas, profile;
- desktop/laptop kantor adalah prioritas;
- tetap responsive.

### Typography
- body/table sekitar 13–14 px desktop;
- hindari text 7–9 px;
- KPI angka besar;
- heading section jelas;
- kontras tinggi;
- mudah dibaca lama.

### Dashboard visual
- KPI cards di atas;
- peta Indonesia sebagai hero visual;
- simple charts untuk vendor status, coverage, KHS, dan data completeness;
- quick action cards;
- informasi utama harus bisa dipahami dalam 2–3 detik.

### Status color
- Hijau: aktif/healthy
- Amber: freeze/pending/warning
- Merah: issue/tidak aktif
- Abu-abu: unknown/data kosong

Jangan gunakan terlalu banyak warna sekaligus.

## 17. UX principles

- User harus tahu harus klik apa tanpa training panjang.
- Filter harus terlihat jelas.
- Empty state harus memberi petunjuk.
- Loading state harus stabil dan tidak membuat layout lompat.
- Hindari card grid untuk 100+ vendor; gunakan tabel/list.
- Data penting jangan tersembunyi di hover-only interaction.
- Prioritaskan scanability dan decision making.

## 18. Prinsip pengembangan

- Kerjakan bertahap dan mudah diuji.
- Jangan ubah approved rate sebagai efek samping perubahan UI.
- Jangan mengarang data yang kosong.
- Jangan mencampur status vendor dengan status komersial.
- Jangan mencampur base/branch dengan coverage.
- Jangan mencampur support/internal entity dengan transport vendor dalam route-search.
- Gunakan Bahasa Indonesia untuk komunikasi dan dokumentasi, kecuali istilah Inggris memang lebih natural untuk nama fitur.

## 19. Prioritas implementasi

Jika harus dikerjakan bertahap, prioritas yang disarankan:

### Phase 1
- Shell UI LogiScope
- Sidebar dan design system
- Dashboard
- Compare Vendor
- Vendor Directory
- Route Search

### Phase 2
- Coverage Map
- Vendor detail
- City/area insight

### Phase 3
- Armada Guide master
- Load Planner
- Integrasi Load Planner → Compare Vendor

### Phase 4
- Data Health
- penyempurnaan role/security
- UX polish

## 20. Definisi sukses

LogiScope dianggap berhasil jika user tim Logistik mulai menggunakan kalimat seperti:

> “Coba cek LogiScope.”

Artinya LogiScope sudah menjadi tempat utama untuk mencari informasi dan mengambil keputusan awal terkait vendor, coverage, armada, dan planning pengiriman.

