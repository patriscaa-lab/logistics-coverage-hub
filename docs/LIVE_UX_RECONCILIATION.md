# Rekonsiliasi live versi 8 — 3 November 2026

Kelima file source editor dicocokkan dengan snapshot deployment versi 8; seluruhnya sama. Source lengkap dan konfigurasi privat hanya disimpan lokal.

## Delta
Code.gs: hanya komposisi HTML doGet. Index.html: copy, lifecycle peta, penyederhanaan panel jarak. MapTools.html: disclosure Ukur Jarak, label, selection. Tambahan CoverageUX.html dan Geography.html (alias referensi live). AccessMapTools.gs dan appsscript.json identik.

## Konflik dengan PR #4
Backend live digabung dan memiliki konfigurasi privat; tidak diganti backend PR #4. Live tidak mengirim canViewRates sehingga indikator UI memakai flag hasPrice yang sudah disanitasi server. Flow selectRoutePair dan dua endpoint jarak live dipertahankan. Geografi dan font 16px live dipertahankan. Validasi relasi snapshot dan refresh guard PR #4 yang berbeda tidak dipindahkan sebagai perubahan UX.

## Behavior yang dipertahankan
Approved rate string, Vendor ID, pasangan origin-destination berarah, capability, coverage, commercial/KHS, Central Master → publisher → salinan operasional, sanitasi dan kontrol akses, runtime manifest serta Script Properties. Tidak ada pengisian data kosong atau perubahan spreadsheet.

## Validasi
54/54 test referensi PR #4 lulus; 10/10 test kandidat live lulus. Browser sintetis pada 1440, 1280, 1024 mencakup Dashboard, Compare Vendor, Vendor Directory, Coverage Map, Ukur Jarak, Load Planner, Armada Guide, Data Health. Tidak ada error browser. Paket generator menghasilkan tujuh file yang identik byte dengan kandidat yang diuji. Pengujian Gmail Fiera langsung dan API Google produksi belum dijalankan pada kandidat.

## Status
Kandidat dan generator delta lokal siap untuk review lanjutan. Branch review final: codex/live-v8-ux-final. Belum deploy atau merge. Folder apps-script lama dalam repository adalah referensi PR #4; JANGAN deploy folder tersebut sebagai hasil rekonsiliasi. Gunakan tools/port-live-ux.cjs --baseline <ekspor-live> --out <direktori-baru>; generator menolak hash baseline berbeda dan output yang sudah ada. Source live harus diperiksa lagi sebelum deployment.
