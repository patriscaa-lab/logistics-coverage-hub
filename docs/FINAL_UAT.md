# UAT kandidat final

Status: BELUM UAT, termasuk akun Fiera. Jangan merge/deploy sebelum user menyatakan UAT OK. PR final menggantikan jalur review #1–#4; jangan merge PR lama secara terpisah.

Source deployment adalah keluaran tools/port-live-ux.cjs dari baseline live v8 terverifikasi; hash tujuh file dikunci final-delta-manifest.json. apps-script/ root adalah referensi historis PR #4, bukan source deployment.

UAT Google memerlukan staging privat terpisah berisi kandidat dan konfigurasi akses setara. Staging belum dipasang. Preview sintetis tidak membuktikan akses Gmail/Sheet; live v8 lama tidak membuktikan kandidat.

## Owner/admin
- [ ] Login dan Refresh: data dimuat, KPI cocok dengan salinan operasional.
- [ ] Cari rute diketahui dan arah balik; cocokkan Vendor ID, approved rate persis, capability, coverage, commercial/KHS dan armada.
- [ ] Dashboard snapshot; Coverage Map: Kediri/provinsi, zoom/pan/filter/detail; highlight harga berbasis tujuan.
- [ ] Ukur Jarak: lurus dan road; kegagalan provider tidak menghasilkan road palsu.
- [ ] Directory, comparison, Load Planner, Armada Guide, Data Health dan state kosong bekerja.

## Fiera — diuji langsung oleh Fiera
- [ ] Buka URL staging yang nanti diberikan dalam profil Chrome akun Fiera; pastikan akun Google aktif benar. Login dan otorisasi sendiri.
- [ ] Dashboard lalu Refresh: data berhasil dimuat tanpa memakai akun owner.
- [ ] Cari rute yang sama dengan owner: vendor dan harga berizin tampil, approved rate persis.
- [ ] Cari Kediri, zoom, pilih wilayah, ukur dua kota: label/detail tampil, jarak lurus tersedia, road muncul atau pesan kegagalan provider yang jelas.
- [ ] Buka Directory, Load Planner, Armada Guide, Data Health: tidak ada error izin/pemuatan.
Jika gagal kirim screenshot pesan lengkap/halaman terkait dengan tarif atau kontak tidak diperlukan disamarkan; waktu WIB, modul, langkah, browser, apakah aplikasi terbuka tetapi data gagal, dan konfirmasi akun aktif secara privat. Jangan kirim password, OTP, cookie atau token.
Status Fiera: BELUM DIUJI.

## Akun tidak diizinkan
- [ ] Login akun uji di luar allowlist pada staging: ditolak tanpa data vendor/harga. Jangan menambahnya ke allowlist.

## Gate
Setelah UAT OK eksplisit, cek ulang hash baseline live. Bila berubah, rekonsiliasi dahulu. Pertahankan Script Properties, execute-as, scopes, izin Sheet, Central Master; deploy hanya tujuh file ber-hash final. Jangan menjalankan helper konfigurasi/publisher sebagai bagian pemasangan UX.
