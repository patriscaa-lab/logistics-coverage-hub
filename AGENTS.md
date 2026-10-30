# LogiScope — Handoff untuk Codex

## Tujuan
Bangun dan pelihara **LogiScope**, aplikasi internal untuk tim Logistik PT Prasetia Dwidharma. Aplikasi ini ditujukan untuk penggunaan operasional harian, bukan sebagai demo publik.

## Branding final
- Nama produk: **LogiScope**.
- Jangan gunakan nama `Logistics Coverage Hub` sebagai nama utama di UI final; nama tersebut hanya boleh muncul sebagai deskripsi jika diperlukan.
- Gunakan nama **LogiScope** pada header, title browser, dokumentasi produk, dan materi internal.
- URL yang dilihat user tidak boleh membawa nama personal user atau branding GitHub.
- URL final yang diinginkan: custom domain/subdomain yang rapi seperti `logistics.prasetia.co.id` atau domain perusahaan lain yang tersedia.

## Modul utama LogiScope
Menu utama final:
1. **Dashboard**
2. **Compare Vendor**
3. **Coverage Map**
4. **Load Planner**
5. **Armada Guide**
6. **Data Health**

Fungsi pencarian route, vendor detail, dan vendor directory tetap penting, tetapi tidak harus menjadi menu utama tersendiri. Fitur tersebut boleh ditempatkan di dalam Dashboard, Compare Vendor, atau halaman pendukung yang paling natural.

## Definisi tiap modul
### Dashboard
- Ringkasan vendor aktif, freeze, belum pernah kerja sama, tidak aktif.
- Ringkasan kota/area coverage.
- Single-vendor risk.
- KHS/commercial readiness.
- Shortcut pencarian origin → destination.
- Insight cepat kondisi data logistics.

### Compare Vendor
Untuk route seperti `Jakarta → Surabaya`, tampilkan vendor yang punya bukti route terkonfirmasi dan bandingkan:
- Nama vendor.
- Mode/service.
- Vehicle/armada.
- Lead time.
- Status kesiapan komersial.
- Estimasi jarak.
- Harga hanya jika user secara eksplisit meminta role-based internal view.

Jangan menyimpulkan vendor tidak melayani hanya karena tidak punya KHS/harga.

### Coverage Map
- Gunakan peta geografis Indonesia sungguhan.
- Visualisasikan coverage berdasarkan data aktual.
- Tampilkan gap coverage, single-vendor city, dan area dengan banyak vendor.
- Jangan mengarang coverage jika `Cakupan Area`/route evidence kosong.
- Origin dan destination aktif harus terlihat berbeda.
- Tampilkan garis route dan estimasi km jika memungkinkan.

### Load Planner
Modul untuk membantu planning muatan berdasarkan dimensi barang dan qty.

Input minimal:
- Nama/material.
- Panjang × lebar × tinggi per unit.
- Qty.
- Berat per unit jika tersedia.
- Opsi stacking bila relevan.

Hitung:
- Volume per unit (m³).
- Volume total (m³).
- Berat total.
- Dimensi terpanjang.

Output:
- Rekomendasi jenis armada berdasarkan volume, payload, dan dimensi bak.
- Warning jika barang terlalu panjang/tinggi/lebar untuk armada tertentu.
- Jangan hanya memakai volume; cek juga payload dan batas dimensi fisik.
- Rekomendasi harus diposisikan sebagai alat bantu planning, bukan jaminan muat tanpa pengecekan lapangan.

### Armada Guide
Knowledge base armada untuk edukasi tim.

Tampilkan minimal:
- Jenis armada.
- Panjang × lebar × tinggi bak.
- Volume teoritis.
- Payload maksimum/umum.
- Jenis bak: bak terbuka, box, wingbox, container, dll.
- Contoh barang yang cocok.
- Keterbatasan/catatan loading.
- Ilustrasi sederhana jika tersedia.

Armada Guide harus bisa dipakai Load Planner sebagai master referensi.

### Data Health
Tampilkan gap data secara eksplisit, misalnya:
- Cakupan Area kosong.
- Lead time kosong.
- Vendor belum punya PIC/contact.
- Legal entity mismatch.
- Quotation tanpa approval.
- Vendor route ada tetapi commercial status belum jelas.
- Data armada belum lengkap.

Tujuan Data Health adalah membantu Supervisor Logistik memperbaiki master data, bukan menyembunyikan kekurangan data.

## Keputusan arsitektur saat ini
- Aplikasi production: Google Apps Script Web App.
- Sumber data utama: Google Sheet `Logistics Coverage Hub - Central Master`.
- GitHub Pages bukan aplikasi production dan tidak boleh menjadi URL operasional yang dilihat user.
- Google Apps Script tetap menjadi runtime backend/frontend sampai ada keputusan baru yang eksplisit.

## Struktur data / sheet sumber
Central Master minimal memiliki tab:
- `Vendor Master`
- `Route & Rate Master`
- `Approved Rate Audit`
- `Data Quality`

Jangan mengubah harga approved kecuali diminta secara eksplisit. Pertahankan nilai sumber apa adanya; jangan hitung ulang atau membulatkan nilai komersial approved.

## Aturan keamanan
- Jangan pernah mengekspos kolom KHS/rate ke browser kecuali user secara eksplisit meminta tampilan internal berbasis role.
- Repository publik/static tidak boleh menyimpan snapshot Vendor Master, snapshot route, PIC, nomor telepon, email, alamat, atau commercial rate.
- Apps Script boleh membaca seluruh data Sheet di server-side, tetapi response ke browser harus sudah disanitasi.
- Nama vendor, capability, coverage, lead time, dan status operasional boleh tampil di aplikasi internal.
- PIC/contact detail bersifat internal-only.
- Production harus dibatasi ke tim Logistik seketat mungkin sesuai konfigurasi akun Google/Workspace yang tersedia.

## Capability vendor vs status komersial
Jangan mewajibkan vendor punya KHS atau harga supaya muncul di Vendor Directory.

Pisahkan konsep berikut:
1. Capability — vendor melayani apa.
2. Coverage — vendor melayani area/rute mana.
3. Commercial/KHS — apakah ada kontrak/quotation/negosiasi.

Label komersial yang disukai:
- `Available & Contracted`
- `Available — Partial Contract`
- `Available — Rate Pending`
- `Quotation Only`

Hindari label UI `Not Approved` jika bisa diganti dengan istilah operasional yang lebih jelas.

## Pengelompokan dan status vendor
Filter Kelompok:
- Ekspedisi / Transport
- Asuransi & Support
- Internal / Self Pickup / Mitra
- Semua Kelompok

Filter Status:
- Semua Status
- Aktif
- Freeze
- Belum Pernah Kerja Sama
- Tidak Aktif

Asuransi, Mobil Operasional, customer/self pickup, implementation partner, dan entitas penjualan material tidak boleh bercampur ke hasil normal route search kecuali memang benar-benar merupakan transport provider untuk route tersebut.

## UX Vendor List
- Gunakan list/tabel vertikal, satu vendor per baris.
- Jangan gunakan kartu padat multi-kolom untuk 100+ vendor.
- Font harus nyaman dibaca; hindari body text 7–9 px.
- Target body/table text sekitar 13–14 px pada desktop.
- Header tabel harus punya baris sendiri dan sticky di bagian atas container tabel.
- Kolom yang direkomendasikan: Vendor, Status, Kelompok, Layanan, Base / Branch, Cakupan Area, KHS, Aksi.
- `Base / Branch` dan `Cakupan Area` harus dipisah, jangan digabung.
- Jika `Cakupan Area` kosong, tampilkan `Belum diisi di Vendor Master`; jangan simpulkan bahwa vendor tidak punya coverage.

## Arah visual
User ingin tampilan seperti produk logistik internal yang matang dan profesional, bukan prototype polos.
- Navigasi utama hanya di sidebar; jangan duplikasi menu yang sama di top bar.
- Top bar hanya berisi branding LogiScope, search, dan utilitas/profile.
- KPI cards di bagian atas.
- Map Indonesia besar sebagai hero visual jika konteks halaman memerlukan.
- Hierarki visual kuat, spacing lega, typography mudah dibaca, palette biru/navy corporate.

## Ekspektasi implementasi Google Apps Script
- `Code.gs` membaca Central Master di server-side.
- `Index.html` adalah UI internal.
- Sediakan tombol `Refresh Data` agar perubahan di Central Master bisa dibaca ulang tanpa membuat snapshot static baru.
- Hindari mengirim field rate ke JavaScript browser.
- Jika memungkinkan, lakukan filter/aggregation data sensitif di server-side.

## Cara kerja
- Lakukan perubahan secara incremental dan mudah diuji.
- Jangan pernah mengubah approved price saat migrasi UI/data.
- Saat memodifikasi route data, pertahankan model origin + destination; jangan menyimpulkan route hanya dari destination.
- Tampilkan kelemahan data quality secara eksplisit, jangan diam-diam mengisi kekosongan dengan asumsi.
- Gunakan Bahasa Indonesia untuk komunikasi, penjelasan, dokumentasi internal, dan label UI sejauh tetap natural dan jelas.
