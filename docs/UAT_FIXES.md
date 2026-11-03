# Perbaikan UAT PR #5

Delta dari kandidat pertama: MapTools.html menyembunyikan dan mengosongkan diagnosis setelah render sukses, serta mengabaikan hasil diagnosis async yang sudah usang. Diagnosis error dan backend tetap ada. CoverageUX.html menaikkan snapshot ke 400px, fractional zoom, fit terhadap boundary aktual, dan resize/refocus setelah navigasi. Tidak ada perubahan backend/business rule/config/data.

Validasi: 10 test live lulus; browser 1440/1280/1024 tanpa error/overflow; success tanpa panel, DATA_ACCESS_DENIED tetap tampil, recovery menyembunyikan panel; snapshot 400px. Hasil generator identik dengan tujuh file teruji.

Staging Version 1: ganti hanya MapTools.html dan CoverageUX.html dari paket UAT2 pada proyek STAGING. Save. Deploy > Manage deployments > pilih deployment staging > Edit > Version: New version > description UAT2 > Deploy. Catat nomor versi aktual; URL tetap sama. Jangan mengubah execute-as/access/Script Properties. Jangan membuka deployment live. Uji ulang dengan hard refresh, termasuk akun Fiera langsung. Belum merge/deploy live.
