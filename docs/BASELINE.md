# Baseline audit repository — 30 Oktober 2026

## Sumber yang diperiksa sebelum perubahan

| Sumber | Commit / status |
| --- | --- |
| `main` | `9db1a03222347304a9084a4ba2cd004f53ab5d07` |
| `codex/apps-script-internal` | `91e68e423cd6a51b20d2bae147838a7c96984113` |
| Merge base kedua branch | `4fadd9b9142d211a27ad3937647ce918ec6d1a7a` |
| PR terbuka | [#1](https://github.com/patriscaa-lab/logistics-coverage-hub/pull/1), head branch aplikasi → `main` |
| Review PR #1 saat audit | Tidak ada review submission atau inline review thread |
| Perbandingan branch | Aplikasi ahead 7 commit, behind 4 commit terhadap `main` |
| Deployment Google | Tidak diekspor/diperiksa pada audit ini; kesamaan source **belum diketahui** |

`main` memuat `AGENTS.md`, `PROJECT_CONTEXT.md`, dan landing `index.html`; tidak memiliki suite tes. Branch aplikasi memiliki 15 berkas: konteks/landing, README, `.gitignore`, empat source web Apps Script, dua source publisher, dan empat berkas tes. Tidak ada package manager atau dependensi tes eksternal.

Working folder lama berada pada `main` lama dengan banyak berkas untracked. Ia bukan baseline. Perubahan lokal seperti `Distances.gs`, warna wilayah, font terbaru, konfigurasi privat, dan preview sintetis tidak disalin ke remediasi. Mereka perlu review tersendiri sebelum digabung atau dipasang.

Git HTTPS native gagal akibat keterbatasan memori Windows (`SEC_E_INSUFFICIENT_MEMORY` / gagal memuat libcurl). Source dibaca melalui arsip GitHub. Seluruh **15 blob** arsip aplikasi dicocokkan dengan SHA-1 objek Git dari tree API pada commit yang dipatok: **0 mismatch**. Tidak ada kredensial atau konfigurasi akun operasional di arsip audit.

## Baseline suite yang sudah ada

Runtime: Node.js `v24.22.1`.

```sh
node --test tests/backend.test.cjs tests/publisher.test.cjs tests/coverage.test.cjs tests/logiscope.test.cjs
```

Hasil sebelum perubahan: **35 tests, 35 pass, 0 fail, 0 cancelled**, exit 0.

Tes tersebut memeriksa role/access, sanitasi harga/kontak, pencocokan rute, publisher, geometri/koordinat, dashboard, dan kalkulasi muatan. Hasil ini bukan pengujian terhadap deployment Google.

## Alasan pemilihan sumber

Branch remediasi `codex/remediate-source-and-validation` dibuat langsung dari `91e68e4`, sumber aplikasi yang dapat direproduksi. Dokumen konteks diselaraskan byte-for-byte dengan `main` yang dipatok. Riwayat `main` diintegrasikan sebagai parent tambahan pada commit remediasi sehingga PR ke `main` tidak mengabaikan empat commit konteks tersebut. Ini tidak mengubah `main` atau melakukan merge PR.

## Pembuktian regresi

Delapan kasus regresi baru pada backend dan state frontend dijalankan terhadap source baseline yang tetap tidak diubah: **28 tests, 20 pass, 8 fail, 0 cancelled**, exit 1. Kegagalan mencakup metadata izin harga, vendor mismatch, relasi snapshot, ringkasan tidak konsisten, dan race pencarian/refresh. Dengan source remediasi, suite penuh menjadi **44 pass, 0 fail**.

Tes frontend memakai VM + DOM/RPC sintetis yang dapat menunda respons. Ini menguji eksekusi state UI, bukan browser atau visual QA. Tidak ada data vendor/harga nyata pada fixture.
