# Logistics Coverage Hub

Portal internal Logistik PT Prasetia Dwidharma. Konteks dan aturan produk utama berada pada `AGENTS.md`.

## Implementasi

- `apps-script/Code.gs`: backend baca-saja Central Master, allowlist akun, proyeksi field aman, validasi bukti rute, agregasi kualitas data.
- `apps-script/Index.html`: dashboard, peta Leaflet, pencarian origin → destination, direktori tabel, detail dan perbandingan maksimal tiga vendor.
- `apps-script/appsscript.json`: manifest dengan scope Sheets baca-saja; default deployment hanya pemilik.
- `tests/backend.test.cjs`: pengujian memakai data sintetis, tidak menyimpan snapshot internal.
- `index.html`: landing lama. Bukan aplikasi operasional.

Jalankan pengujian dari root repo:

```sh
node --test tests/backend.test.cjs
```

## Menyiapkan Apps Script

1. Gunakan editor proyek Apps Script operasional yang sudah ada. Cadangkan source dan catat versi deployment sebelumnya sebelum mengganti kode. Salinan source lama ditemukan di Downloads, tetapi kesesuaiannya dengan versi live masih perlu diperiksa di editor asli. API UI baru memakai `getHubData()` dan `searchRoutes({origin,destination})`; ganti backend dan frontend bersama-sama, jangan mencampur versi.
2. Masukkan `Code.gs`, `Index.html`, dan `appsscript.json` dari folder `apps-script/`. Jangan upload `index.html` landing sebagai UI Apps Script.
3. Di Project Settings → Script Properties, isi `CENTRAL_MASTER_ID` dengan ID Central Master yang terverifikasi dan `ALLOWED_EMAILS` dengan daftar email tim Logistik dipisahkan koma. Jangan simpan daftar akun, ID data operasional, atau token ke repo publik.
4. Uji dulu dengan akses hanya pemilik. Backend memerlukan header baris 4 yang sesuai dengan Central Master; tidak membuat atau mengubah tab/sel apa pun.
5. Untuk penggunaan tim pada Google Workspace yang sama, administrator dapat memilih eksekusi sebagai pemilik dan akses terbatas organisasi, lalu tetap membatasi daftar akun di server. Jangan aktifkan akses anonim. Identitas yang kosong selalu ditolak. Pastikan akun pemilik dapat membaca Sheet.
6. Uji memakai akun tim yang diizinkan, akun organisasi di luar allowlist, serta sesi tanpa login. Jika identitas pengguna tidak tersedia pada konfigurasi akun tersebut, hentikan go-live dan tinjau konfigurasi identitas bersama administrator; jangan menghapus pemeriksaan akses.
7. Perbarui deployment yang sudah ada dengan versi baru setelah UAT, supaya URL operasional tetap konsisten. Simpan nomor versi sebelumnya untuk rollback.

Email pengguna aktif dapat kosong pada konteks tertentu, terutama web app yang berjalan dengan otorisasi developer. Lihat [dokumentasi Session Google](https://developers.google.com/apps-script/reference/base/session). Kode tidak pernah menggunakan effective user sebagai pengganti identitas pengunjung.

## Aturan interpretasi data

- Join berdasarkan Vendor ID, bukan tebakan nama vendor.
- Status sumber yang saat ini dikenali: `APPROVED` + `Setuju`; `COUNTER / NOT APPROVED` + `Tidak Setuju`; dan `VENDOR OFFER - APPROVAL NOT RECORDED` + `No approval column in source`.
- Dua status terakhir menunjukkan bukti quotation/negosiasi, **bukan persetujuan harga atau kesiapan pemesanan**. UI menampilkan peringatan konfirmasi operasional. Nilai baru/ambigu, ID duplikat, atau origin/destination kosong dikecualikan dan dihitung pada kualitas data.
- Rekomendasi default hanya vendor transport berstatus Aktif. Direktori tetap mencakup vendor tanpa kontrak dan vendor di kelompok/status lain.
- Tipe vendor yang belum dikenal menjadi `Perlu klasifikasi`, bukan otomatis transport.
- Base/Branch tidak dipakai untuk menyimpulkan origin atau coverage. Coverage mentah tidak dipakai untuk membuat pasangan rute.
- Kesiapan komersial diturunkan dari status persetujuan, tanpa mengirim kolom KHS atau nominal apa pun. Approved price tidak dibaca untuk perhitungan dan tidak ditulis ulang.
- Refresh membaca langsung Sheet; tidak ada cache/snapshot vendor di file statis.
- Marker hanya memakai kota pada rute yang lolos filter dan cocok persis dengan referensi koordinat publik pada UI. Kota lain dihitung sebagai belum terpetakan. Jarak merupakan haversine garis lurus antarpusat kota, bukan jarak berkendara atau dasar penetapan harga.
- Leaflet dimuat dari unpkg dan tile dari OpenStreetMap. Jaringan pengguna harus dapat mengakses keduanya. Tile tidak menerima nama vendor; penyedia tile dapat melihat alamat IP dan wilayah peta yang dimuat. Untuk skala internal besar, administrator perlu menilai layanan tile yang sesuai.

## Review dan batas verifikasi

Source yang ditemukan pada branch utama sebelum pekerjaan ini hanya landing dan `AGENTS.md`. Salinan `Code (1).gs` dan `Index (1).html` kemudian ditemukan di folder Downloads dan direview. Belum dapat dipastikan bahwa salinan tersebut identik dengan deployment live. Implementasi baru mengikuti header dan nilai status yang diperiksa langsung pada Central Master, tanpa mengubah Sheet.

Temuan review salinan sebelumnya: pemeriksaan akses bersifat opsional bila `ALLOWED_DOMAIN` kosong; pencarian belum menyaring kelompok/status vendor di backend; bootstrap menggabungkan semua rute ke metrik tanpa validasi bukti; detail mengirim kontak dan informasi KHS; banyak label UI berukuran 8–10 px. Source baru memperketat akses dan whitelist, memvalidasi bukti/status, memakai tabel 14 px, dan menambah perbandingan. Kontak tidak ditampilkan pada versi ini; penambahan kontak memerlukan rancangan akses khusus yang disepakati.

Pengujian lokal mencakup akses, kebocoran field, pasangan rute, status vendor, data kosong/ambigu, refresh, quotation, serta sintaks UI/manifest. Pengujian lokal tidak menggantikan UAT di runtime Google.

Sebelum production: verifikasi identitas pada deployment asli, jumlah hasil terhadap Sheet terbaru, filter/status vendor, pemuatan peta, fungsi Refresh Data, navigasi keyboard/mobile, serta penolakan akun di luar allowlist. Tidak ada custom domain atau deployment Google yang otomatis dibuat oleh paket ini. Custom domain memerlukan keputusan dan konfigurasi infrastruktur perusahaan; jangan menjanjikan pemetaan domain langsung ke Apps Script tanpa validasi.
