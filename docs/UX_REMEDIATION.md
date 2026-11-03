# Audit dan perbaikan UX LogiScope — 3 November 2026

## Sumber dan baseline

- Instruksi dibaca lengkap sebelum perubahan: AGENTS.md, PROJECT_CONTEXT.md, UX_PRODUCT_RULES.md, UI_AUDIT_DECISIONS.md pada main `87a3e5a214bbdfa36dc23a80f11a44e2bbebc5dc`. MASTER_GOVERNANCE.md tidak tersedia pada tree tersebut.
- main hanya berisi konteks, keputusan UX, dan landing; tidak memuat aplikasi Apps Script. Branch awal `codex/apps-script-internal` masih pada `91e68e4`; PR #1, #2, dan #3 masih terbuka saat audit.
- Source aplikasi dimulai dari PR #3, commit `56f321a3494740a0ba5b368b60055c0ea0ce4d8d`. Semua 23 blob salinan lokal cocok dengan SHA objek Git remote. Baseline **51/51 tes lulus**.
- Pekerjaan pada branch terpisah `codex/ux-coverage-cleanup`, dengan keputusan main terbaru dibawa ke branch tersebut. Tidak mengubah main atau menggabungkan PR.

## Temuan dan implementasi

| Komponen | Temuan | Perubahan |
| --- | --- | --- |
| Index.html | Dashboard/Coverage memindahkan workspace yang sama; subtitle berulang | Workspace penuh menetap di Coverage Map. Snapshot terpisah di Dashboard; subtitle Compare, Direktori, Dashboard, Planner, dan Armada diringkas/dibuang. |
| Account | Label hilang pada breakpoint laptop | Avatar + Tim Logistik + Akses internal tetap terbaca, tanpa dropdown atau action palsu; refresh dan Data Health terpisah. |
| MapTools.html | Tutorial, caveat panjang, tooltip dan koordinat dominan | Ukur Jarak menjadi disclosure native, field/action/hasil tetap ada; petunjuk hanya ketika memilih titik atau error. Nama lokasi tetap digunakan, titik bebas diberi label Titik asal/Titik tujuan. |
| CoverageUX.html | Full map tanpa pemisahan tugas | Search kota/kabupaten/provinsi, filter coverage/moda/vendor, detail setelah selection, CTA vendor/compare, legend ringkas, marker dikelompokkan pada zoom rendah. |
| Geography.html | Referensi wilayah ada pada source lokal lama tetapi belum di branch aplikasi | Referensi publik Natural Earth admin-1 dan mapping kota-wilayah dipisahkan dari data operasional; tidak menghasilkan coverage baru. |
| Dashboard | Statistik sedikit mengambil kolom besar | Statistik layanan menjadi strip ringkas; deskripsi shortcut dan promo sidebar dibuang. KPI, status komersial dan ringkasan Data Health dipertahankan. |

Peta tetap menggunakan Leaflet 1.9.4 dan geometri yang sudah ada, tanpa provider tile baru atau dependensi production baru. Atribusi geografis tetap kecil pada peta. Overlay provinsi semi-transparan; label geografis memakai progressive zoom. Harga ditandai dengan ring hijau hanya jika indikator server dan role mengizinkan. Coverage/count menggunakan vendor aktif unik pada **tujuan** rute; kota asal tidak otomatis dianggap tujuan ter-cover. Klaim tertulis master tetap terpisah dari bukti rute.

Leaflet diinisialisasi setelah halaman Coverage terlihat. Animasi zoom awal dinonaktifkan agar pemilihan lokasi saat transisi tidak diabaikan. Dashboard memakai instance peta overview sendiri dengan interaksi dimatikan serta CTA Buka Coverage Map.

## Behavior yang dipertahankan

- Tidak ada perubahan pada approved rate, Vendor ID, Central Master, publisher, model rute, sanitasi server, role atau allowlist.
- Pencarian tetap pasangan Origin + Destination berarah; swap, perbandingan maksimal tiga vendor, detail vendor, dan invalidasi hasil/request lama tetap berjalan.
- Capability, coverage, dan kesiapan komersial tetap berbeda; rate kosong bukan larangan melayani. Tidak ada lead time, harga, atau coverage baru yang ditebak.
- Konfirmasi lead time kosong dan informasi master armada yang belum tervalidasi tetap ditampilkan saat relevan.
- Ukur bebas tetap memakai jarak lurus dan endpoint Google Directions yang sudah ada. Pengukuran tidak membuat bukti rute vendor.

## Validasi acceptance criteria

- **54/54 tes Node lulus**: seluruh baseline ditambah proyeksi coverage tujuan, filter/role indikator harga dan decluttering. Tes doGet diperbarui untuk urutan empat modul UI, dengan authorize tetap lebih dahulu.
- Browser Chromium lokal, data sintetis: lebar **1440×900, 1280×800, 1024×768**, tanpa page error/overflow horizontal.
- Diperiksa: Dashboard tanpa workspace/ukur penuh; identitas account; hasil dan empty Compare Vendor; search kota dan provinsi; zoom Kediri benar-benar mencapai level 8; detail tersembunyi sebelum selection dan ditutup ketika filter berubah; pengukuran; empty data dan harga tanpa role.
- Screenshot Dashboard, Coverage, Compare hasil/kosong dan Ukur Jarak diperiksa secara visual. Tidak menggunakan data vendor atau tarif produksi.
- Bug yang ditemukan selama QA (fitBounds di container tersembunyi dan fokus lokasi saat animasi awal) sudah diperbaiki, kemudian suite browser diulang.

## Menjalankan ulang QA

Tes utama: `node --test` dari root source.

QA browser opsional: `node tools/browser-ux.cjs`, dengan Playwright tersedia pada resolver Node (atau env `PLAYWRIGHT_MODULE`). Siapkan Leaflet resmi 1.9.4 berupa `leaflet-1.9.4.js` dan `leaflet-1.9.4.css` pada `qa-assets/` atau direktori `LEAFLET_QA_DIR`. Browser yang sesuai Playwright dapat ditentukan dengan `QA_BROWSER_EXECUTABLE`; hasil ditulis ke `artifacts/ux-audit/` atau `QA_OUTPUT_DIR`. Semua fixture sintetis dan angka jarak pada runner adalah simulasi untuk QA, bukan hasil Google Maps produksi.

## Batas verifikasi dan deployment

**Perubahan UX ini belum dipasang ke Apps Script live.** Deployment terakhir yang diverifikasi pada pekerjaan sebelumnya adalah versi 8. Repo memuat Code/Snapshot/Identity/MapTools, sedangkan Code/Index live memiliki tambahan lama seperti Distances, skala font dan rendering provinsi yang belum diekspor penuh. Membaca editor sebelumnya menghasilkan source terpotong; kesamaan byte seluruh runtime tidak diketahui. Folder lokal lama juga bukan baseline resmi.

Code.gs di branch ini hanya mengubah penyusunan output HTML agar memuat Index, MapTools, Geography, CoverageUX. Snapshot.gs, Identity.gs, MapTools.gs, manifest dan publisher identik dengan baseline. Pemasangan source lengkap membutuhkan seluruh file tersebut; jangan menimpa Code/Index live secara buta dari PR ini. Langkah lanjutan: ekspor source live lengkap, bandingkan terhadap branch ini, pertahankan konfigurasi privat dan fitur runtime yang valid, lalu uji deployment kandidat dengan kedua akun sebelum mengganti versi production. Ini langkah rekonsiliasi source, bukan perubahan sharing atau harga.

Batas geografis adalah referensi Natural Earth lama (33 wilayah), bukan master administratif terkini seluruh kabupaten Indonesia. Search/label memakai referensi yang tersedia; lokasi tanpa koordinat tetap dapat memiliki bukti coverage dan diberi state koordinat belum tersedia. Blank/abu-abu berarti belum terdata pada sumber yang tersedia, bukan pasti tidak dilayani.
