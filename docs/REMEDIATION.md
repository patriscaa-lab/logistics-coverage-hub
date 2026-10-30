# Perubahan dan batas remediasi

## Hasil

- Rute dengan Vendor ID unik tetapi nama sumber bertentangan dikeluarkan dan dihitung sebagai gap. Nama yang kosong tetap dapat dicocokkan melalui ID unik untuk kompatibilitas; ID bersama tetap wajib cocok nama.
- Snapshot ditolak bila memiliki ID vendor/rute duplikat atau kosong, orphan route, nama vendor yang bertentangan, rute vendor nonaktif/nontransport, harga yang terikat ke ID rute lain, atau summary yang tidak cocok dengan data. Publisher melakukan validasi ini sebelum membuka spreadsheet tujuan atau menulis.
- `getHubData()` memberi metadata `canViewRates` setelah snapshot divalidasi. Schema snapshot tersimpan tidak berubah. Akun tanpa role komersial melihat keterangan akses dibatasi, bukan klaim nol vendor berharga. Nilai harga tetap khusus RPC pencarian berizin.
- Mengubah asal/tujuan, memilih marker, menukar arah, atau refresh membuang hasil/perbandingan lama dan mengabaikan respons terlambat. Request lama tidak dapat mengaktifkan tombol saat request baru masih berjalan. Search ditunda selama pembacaan snapshot agar hasil tidak bercampur.
- Konteks `main` dipertahankan. PR #1 tidak diubah, ditutup, atau digabung.

Harga approved tidak dihitung ulang. Remediasi tidak membaca atau menulis Central Master, tidak mengubah sharing/allowlist, tidak memasang trigger, dan tidak melakukan deployment Google.

## Verifikasi

```sh
node --test
```

Hasil akhir: 44 tes lulus, 0 gagal, 0 dibatalkan. Baseline dan pembuktian kegagalan terhadap source lama dicatat di [BASELINE.md](BASELINE.md).

## Rekonsiliasi deployment sebelum pemasangan berikutnya

Deployment adalah sumber terpisah yang status kesamaannya belum diketahui. Riwayat percakapan, nama versi, atau URL yang sama tidak membuktikan byte source sama dengan branch.

1. Ekspor source proyek web, manifest, dan identitas versi deployment secara read-only ke penyimpanan privat. Jangan commit helper konfigurasi, token, Script Properties, atau akun nyata.
2. Catat hash source mentah dan tanggal ekspor; bandingkan file publik dengan commit yang akan dipasang. Proyek live dapat menggabungkan `Code.gs` + `Snapshot.gs` dan helper privat dalam satu file. Tinjau perbedaannya secara eksplisit, jangan otomatis membuang blok yang belum dikenali.
3. Periksa apakah source live memiliki fitur yang belum masuk repo, misalnya jarak road/provinsi berwarna. Bawa perubahan itu ke review terpisah beserta tesnya; jangan menimpa fitur yang belum direkonsiliasi.
4. Validasi snapshot yang sedang digunakan dengan validator baru. Bila ditolak, perbaiki sumber/sinkronisasi melalui publisher pemilik; jangan melonggarkan validator untuk membuat data salah lolos.
5. Pasang backend dan frontend dari commit yang sama setelah review. Pertahankan backup versi untuk rollback serta kontrol akses yang berlaku. Uji akun komersial, akun nonkomersial, akun di luar allowlist, kegagalan snapshot, dan pergantian rute saat request berjalan.

Road distance, penyempurnaan font/warna wilayah dari folder kerja lama, master armada tervalidasi, dan pengujian login akun kedua tidak dinyatakan selesai oleh PR remediasi ini.
