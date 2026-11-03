# Pemeriksaan akses dan alat ukur peta — 3 November 2026

Branch: `codex/fix-gmail-map-tools`, dibuat dari `8bd9ea56e247adb5ca3b6b977cb08c0e2671127b` (PR #2). Baseline sebelum perubahan: 44 tes lulus. `main` tidak diubah atau digabung.

## Bukti dan batas akses

- Pembacaan metadata Drive masih mencatat akun Fiera sebagai Viewer proyeksi operasional; tidak ada sharing tambahan yang dibuat.
- Gmail pribadi memperlakukan variasi titik sebagai akun sama. `Identity.gs` menerapkan aturan ini pada allowlist dan role komersial. Domain perusahaan, alamat plus, serta domain mirip tidak disamakan. Tidak ada akun nyata pada source/test.
- Log pemilik memperlihatkan `doGet` berhasil diikuti `getHubData` gagal. Detail kegagalan pengguna lain tidak tersedia dari sesi pemilik. Ini tidak membuktikan penyebab final.
- `diagnoseHubAccess()` membedakan sesi/allowlist, izin Google, akses data, layanan, dan snapshot. Respons hanya kode status dan alamat sesi sendiri; tidak berisi allowlist, spreadsheet ID, harga, atau payload.
- Keberhasilan login/pembacaan oleh akun kedua wajib diuji dari akun tersebut; uji sebagai pemilik bukan pengganti.

## Modul peta yang terpisah

`MapTools.html` ditambahkan ke output `doGet()` setelah `Index`. Ia menambah kontrol label lokasi, pilihan kota/kabupaten, pemilihan dua titik peta, zoom/geser, garis pengukuran, dan dua kartu jarak. Garis pada peta adalah garis lurus. Jarak jalan berasal dari Google Maps Directions DRIVING dan ditampilkan sebagai angka dengan tautan pemeriksaan sumber; geometri jalan Google tidak digambar pada peta non-Google.

Pengukuran bebas tidak membuat bukti rute vendor. Rute driving tidak menjamin akses kendaraan berat, dapat memakai ferry, dan bukan dasar tarif. Bila tidak ada rute atau layanan gagal, road ditandai belum tersedia; tidak dihitung dengan pengali dari jarak lurus. Respons lama diabaikan setelah titik berubah. Cache dan lock dibatasi per pengguna.

Label menggunakan referensi kota/kabupaten yang tersedia pada aplikasi. Pada zoom nasional hanya label utama yang tidak saling menimpa ditampilkan; perbesar atau pilih nama untuk melihat detail. Lokasi di luar referensi dapat dipilih sebagai koordinat peta, tanpa mengarang nama administratifnya.

## Rekonsiliasi runtime

Editor live masih berisi source yang lebih baru dari baseline repo (termasuk endpoint `getRouteDistances`). Pembacaan editor memiliki batas truncation, sehingga kesamaan seluruh file tidak diklaim. Perubahan live harus dibatasi pada penambahan modul serta hunk identitas/doGet yang dicocokkan secara eksplisit; jangan menimpa seluruh Index/Code dari branch ini. Backup versi deployment sebelumnya dan catat hasil pengujian. Penyesuaian font/warna/provinsi yang sudah ada di live dipertahankan.

Pemasangan source lengkap dari repo membutuhkan `Identity.gs`, `MapTools.gs`, dan `MapTools.html` bersama file web lainnya. Untuk pemasangan modular pada live, `Identity.gs` dan `MapTools.gs` dapat digabung dalam satu file script, tetapi jangan mendefinisikannya dua kali. Publisher tidak memakai MapTools/Maps. Nilai harga/master dan izin spreadsheet tidak diubah oleh modul ini.

## Verifikasi setelah pemasangan

Pada 3 November 2026 deployment yang sama berhasil diperbarui menjadi versi 8. Ditambahkan `AccessMapTools.gs` (gabungan Identity dan MapTools) serta `MapTools.html`. Hunk live yang dicocokkan: tiga normalisasi daftar akun, satu normalisasi identitas sesi, dan satu ekspresi output doGet. Index live tidak ditimpa; konfigurasi execute-as-user dan Google-account access tetap sama. Versi 7 tetap tersedia untuk rollback.

Pengujian melalui UI produksi pada akun pemilik: data 105 vendor berhasil dimuat; label kota dan kabupaten tampil setelah zoom; Jakarta–Kota Kediri menghasilkan 597,5 km garis lurus dan 708,3 km driving. Pilihan dua koordinat bebas menghasilkan 402,1 km lurus dan 557,8 km driving; garis ukur tampil, reset bekerja, dan peta dapat digeser tanpa mengubah titik terpilih. Nilai driving adalah hasil saat pengujian dan dapat berubah. Seluruh 51 tes lokal lulus (baseline 44). Hasil pemuatan dari akun kedua masih menunggu konfirmasi pengguna; keberhasilan akun pemilik tidak membuktikan masalah akun kedua selesai.
