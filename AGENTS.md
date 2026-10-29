# Logistics Coverage Hub — Handoff untuk Codex

## Tujuan
Bangun dan pelihara Logistics Coverage Hub internal untuk tim Logistik PT Prasetia Dwidharma. Aplikasi ini ditujukan untuk penggunaan operasional harian, bukan sebagai demo publik.

## Keputusan arsitektur saat ini
- Aplikasi production: Google Apps Script Web App.
- Sumber data utama: Google Sheet `Logistics Coverage Hub - Central Master`.
- GitHub Pages bukan aplikasi production dan tidak boleh menjadi URL operasional yang dilihat user.
- URL yang dilihat user tidak boleh membawa nama personal user atau branding GitHub.
- URL final yang diinginkan: custom domain/subdomain yang rapi seperti `logistics.prasetia.co.id` atau domain perusahaan lain yang tersedia.
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

## Fungsi utama produk
1. Map coverage Indonesia interaktif.
2. Search route: Origin → Destination.
3. Compare vendor.
4. Vendor detail.
5. Vendor directory/master data view.
6. Coverage gap insight / dashboard.
7. Estimasi jarak dalam km untuk route yang dipilih.

## Perilaku hasil pencarian route
Untuk route seperti `Jakarta → Surabaya`, tampilkan vendor yang punya bukti route terkonfirmasi dan tampilkan:
- Nama vendor.
- Mode/service.
- Vehicle/armada.
- Lead time.
- Status kesiapan komersial.
- Estimasi jarak.

Jangan tampilkan harga secara default.

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
Default Vendor List fokus ke `Ekspedisi / Transport`.

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
- Kolom yang direkomendasikan:
  - Vendor
  - Status
  - Kelompok
  - Layanan
  - Base / Branch
  - Cakupan Area
  - KHS
  - Aksi
- `Base / Branch` dan `Cakupan Area` harus dipisah, jangan digabung.
- Jika `Cakupan Area` kosong, tampilkan `Belum diisi di Vendor Master`; jangan simpulkan bahwa vendor tidak punya coverage.

## Arah visual
User ingin tampilan seperti produk logistik internal yang matang dan profesional, bukan prototype polos.

Home/dashboard harus terasa seperti portal logistik profesional:
- Navigasi utama hanya di sidebar; jangan duplikasi menu yang sama di top bar.
- Top bar hanya berisi branding, search, dan utilitas/profile.
- KPI cards di bagian atas.
- Map Indonesia besar sebagai hero visual.
- Coverage density divisualisasikan dengan warna/marker.
- Route search panel.
- Vendor result cards/list.
- City detail / coverage insight panel.
- Hierarki visual kuat, spacing lega, typography mudah dibaca, palette biru/navy corporate.

## Perilaku map
- Gunakan peta geografis sungguhan, bukan bentuk pulau schematic.
- Tampilkan marker/density hanya berdasarkan data aktual.
- Jangan mengarang coverage untuk vendor yang belum punya `Cakupan Area` terstruktur atau route evidence.
- Origin dan destination aktif harus terlihat berbeda.
- Tampilkan garis route dan estimasi km jika memungkinkan.

## Realitas data quality saat ini
Tidak semua Vendor Master punya structured coverage yang lengkap. UI harus menampilkan gap data ini secara jujur, bukan mengisinya dengan tebakan.

Confirmed route evidence baru tersedia untuk sebagian vendor; Vendor Directory tetap harus menampilkan vendor non-contract/non-KHS berdasarkan capability/status.

## Ekspektasi implementasi Google Apps Script
- `Code.gs` membaca Central Master di server-side.
- `Index.html` adalah UI internal.
- Sediakan tombol `Refresh Data` agar perubahan di Central Master bisa dibaca ulang tanpa membuat snapshot static baru.
- Hindari mengirim field rate ke JavaScript browser.
- Jika memungkinkan, lakukan filter/aggregation data sensitif di server-side.

## Branding / penamaan
Gunakan nama produk `Logistics Coverage Hub`.
Jangan gunakan username GitHub personal user dalam branding operasional atau URL final yang dilihat user.
Jangan jadikan GitHub Pages sebagai solusi production.

## Cara kerja
- Lakukan perubahan secara incremental dan mudah diuji.
- Jangan pernah mengubah approved price saat migrasi UI/data.
- Saat memodifikasi route data, pertahankan model origin + destination; jangan menyimpulkan route hanya dari destination.
- Tampilkan kelemahan data quality secara eksplisit, jangan diam-diam mengisi kekosongan dengan asumsi.
- Gunakan Bahasa Indonesia untuk komunikasi, penjelasan, dokumentasi internal, dan label UI sejauh tetap natural dan jelas.
