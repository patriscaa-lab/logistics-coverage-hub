# Logistics Coverage Hub

Portal internal Logistik PT Prasetia Dwidharma. `AGENTS.md` adalah konteks utama proyek. Pengguna memakai Gmail biasa, tanpa Google Workspace.

## Arsitektur Gmail

Central Master privat → publisher privat sebagai pemilik → spreadsheet operasional tersanitasi → web app berjalan sebagai pengguna yang login → allowlist akun pada setiap RPC.

Eksekusi sebagai pengguna memerlukan izin pengguna untuk membaca spreadsheet sumber aplikasi. Sumber web app harus salinan operasional, bukan Central Master berisi harga. Lihat [Web Apps Google](https://developers.google.com/apps-script/guides/web) dan [Session Google](https://developers.google.com/apps-script/reference/base/session).

Manifest web memakai `USER_ACCESSING` dan `ANYONE` (pengguna yang login, bukan `ANYONE_ANONYMOUS`). Gerbang login Google tidak menggantikan allowlist aplikasi dan akses Viewer spreadsheet. Akun tim tidak memerlukan akses Central Master maupun editor proyek.

## Source

- `apps-script/Code.gs`: RPC, allowlist, helper privat pembentukan proyeksi.
- `apps-script/Snapshot.gs`: pembacaan salinan dengan pemeriksaan digest dan schema whitelist.
- `apps-script/Index.html`: dashboard, peta, direktori, pencarian, detail dan perbandingan vendor.
- `apps-script/appsscript.json`: scope baca-saja dan identitas pengguna yang mengakses.
  Manifest juga mengaktifkan Advanced Sheets Service v4. Pembacaan web memakai `Sheets.Spreadsheets.Values.get`, karena `SpreadsheetApp.openById` membutuhkan scope Sheets penuh walaupun dipakai hanya untuk membaca. Proyek Cloud default mengaktifkan API melalui advanced service; bila memakai proyek Cloud standar, administrator harus memastikan Sheets API sudah aktif.
- `publisher/Publisher.gs`: sinkronisasi pemilik pada proyek terpisah.
- `publisher/appsscript.json`: scope tulis khusus publisher.
- `tests/backend.test.cjs`: pengujian sintetis; tidak menyimpan snapshot internal.
- `index.html`: landing lama, bukan aplikasi operasional.

## Pemasangan publisher privat

1. Buat spreadsheet kosong khusus operasional, terpisah dari master; akses Restricted. Jangan menyalin seluruh workbook master.
2. Buat proyek Apps Script privat khusus pemilik. Masukkan `publisher/Publisher.gs`, `apps-script/Code.gs`, dan `apps-script/Snapshot.gs`. Gunakan manifest dari folder `publisher/`. Jangan deploy proyek ini sebagai web app atau membagikan editornya ke tim.
3. Isi Script Properties publisher: `PUBLISHER_OWNER_EMAIL`, `CENTRAL_MASTER_ID`, `OPS_SPREADSHEET_ID`. Source dan tujuan harus berbeda. Jangan commit akun, token, atau konfigurasi sumber ke repo publik.
4. Jalankan `syncOperationalSnapshot()` dari editor sebagai pemilik. Skrip membaca master lalu menulis tab `Operational Snapshot` di spreadsheet tujuan. Tidak menulis atau menghitung ulang approved price.
5. Periksa proyeksi sebelum sharing: vendor/rute operasional, agregasi kualitas data, serta harga vendor per armada yang diminta eksplisit pengguna. PIC, telepon, email vendor, alamat, target negosiasi internal Prasetia, dan snapshot sumber tidak disalin. Nilai harga menggunakan string tampilan sumber tanpa hitung ulang/pembulatan.
6. Karena proyeksi kini memuat harga, bagikan sebagai Viewer hanya kepada akun komersial yang disetujui. Jangan masukkan pengguna tanpa izin harga ke spreadsheet ini; role aplikasi tidak membatasi orang yang sudah memiliki akses langsung ke spreadsheet. Jangan aktifkan Anyone with the link. Ikuti persetujuan sharing yang diwajibkan alat.
7. Opsional: jalankan `installOperationalSyncTrigger()` untuk membuat satu trigger sinkronisasi setiap lima menit. Tidak ada trigger yang diaktifkan otomatis saat web app dibuka. Pantau kegagalan di Apps Script.

Payload JSON dipotong maksimal 30.000 karakter per sel. Pembaca memeriksa schema dan SHA-256, sehingga pembacaan parsial ditolak. Publisher memakai Script Lock dan satu operasi penulisan payload beserta metadata. Salinan lama tetap tersedia bila pembentukan proyeksi baru gagal sebelum penulisan. Spreadsheet tujuan harus khusus salinan operasional.

## Pemasangan web app Gmail

1. Cadangkan source serta versi deployment sebelumnya. Pasang semua file dari `apps-script/` pada proyek web yang digunakan. Backend dan frontend harus diganti bersama; RPC baru tidak kompatibel dengan UI lama.
2. Isi Script Properties web: `ALLOWED_EMAILS`, `RATE_VIEWER_EMAILS` (akun komersial yang diizinkan melihat harga; email dipisahkan koma), `OPS_SPREADSHEET_ID`. Dua akun awal yang disetujui pengguna mendapat akses aplikasi dan harga. Jangan isi `CENTRAL_MASTER_ID`; hapus konfigurasi master lama pada proyek web setelah migrasi terverifikasi.
3. Deploy sebagai User accessing the web app, akses Anyone with Google account. Jangan pilih akses anonim atau eksekusi sebagai pemilik untuk alur Gmail ini.
4. Setiap akun tim membuka aplikasi dan menyetujui otorisasi Google yang diperlukan. Tinjau layar persetujuan/verification sesuai konfigurasi proyek; akses Gmail harus diuji di runtime asli.
5. Uji akun yang diizinkan, akun di luar allowlist, akun tanpa izin spreadsheet, serta sesi tanpa login. Uji pula bahwa akun tim tidak dapat membaca Central Master.
6. Setelah UAT, perbarui deployment yang sama agar URL konsisten. Rollback dengan memilih versi deployment sebelumnya. Jangan menghapus kontrol akses sebagai workaround.

Daftar akun nyata berada pada konfigurasi runtime dan sharing Google. Menambah anggota memerlukan allowlist dan akses Viewer; pencabutan harus dilakukan pada keduanya. Salinan yang sudah diunduh tidak dapat ditarik kembali.

## Refresh dan kesegaran data

Refresh Data membaca salinan operasional terbaru, tidak menjalankan pembacaan master sebagai pemilik. UI menampilkan waktu sinkronisasi. Perubahan master terlihat setelah publisher berhasil dijalankan, manual atau melalui trigger opsional. Jangan menjanjikan perubahan master langsung terlihat saat user menekan Refresh.

## Aturan data dan review

Instruksi terbaru pengguna mengaktifkan tampilan harga pada hasil pencarian bagi akun internal berizin. Bootstrap/peta tetap tidak memuat harga. RPC pencarian hanya mengembalikan harga untuk rute terpilih kepada `RATE_VIEWER_EMAILS`. UI menampilkan Approved, Penawaran vendor, Counter vendor, Final vendor, basis, dan armada pada baris masing-masing. Nilai kosong tidak dianggap nol; harga negosiasi tidak dilabeli approved. Konfigurasi tidak pernah memberi akses harga hanya karena akun memakai domain gmail.com.

- Join vendor memakai ID. Origin dan destination harus cocok berpasangan; arah balik terpisah.
- Bukti yang dikenali: `APPROVED` + `Setuju`, `COUNTER / NOT APPROVED` + `Tidak Setuju`, dan `VENDOR OFFER - APPROVAL NOT RECORDED` + `No approval column in source`.
- Dua status terakhir adalah bukti quotation/negosiasi, bukan kesiapan pemesanan. Nilai ambigu, ID duplikat, atau rute tidak lengkap dihitung sebagai gap.
- Hanya vendor transport Aktif masuk rekomendasi. Direktori tetap memuat vendor tanpa kontrak dan status lain.
- Base/Branch dan coverage mentah tidak dipakai untuk mengarang pasangan rute. Coverage kosong tetap dinyatakan belum diisi.
- Leaflet dimuat dari unpkg, tile dari OpenStreetMap. Referensi koordinat hanya menempatkan kota dari bukti rute. Kota yang tidak cocok persis dihitung belum terpetakan.
- Jarak adalah haversine garis lurus antarpusat kota, bukan jarak jalan atau dasar tarif.

Repo awal hanya berisi landing dan AGENTS.md. Salinan source lama di Downloads telah direview: pemeriksaan akses opsional ketika ALLOWED_DOMAIN kosong, pencarian belum menyaring status/kelompok vendor di server, dan banyak label UI kecil. Versi ini memperketat akses/proyeksi, menambah perbandingan, dan memakai body/table 14 px. Detail kontak belum ditampilkan.

## Validasi

```sh
node --test tests/backend.test.cjs tests/publisher.test.cjs
```

Pengujian lokal memakai mock layanan Google. QA visual, otorisasi akun Gmail, izin spreadsheet, sinkronisasi publisher/trigger, dan UAT deployment tetap harus diperiksa di runtime asli. Paket source ini belum mengaktifkan sharing, trigger, deployment Google, atau custom domain.
