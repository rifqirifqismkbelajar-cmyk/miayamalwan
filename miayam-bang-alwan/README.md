# Miayam & Bakso Bang Alwan - Website UMKM

Website promosi lengkap untuk UMKM **Miayam dan Bakso Bang Alwan**.

## Fitur Utama

### Frontend (Pengunjung)
- ✅ Halaman Beranda dengan hero, menu favorit, testimoni
- ✅ Halaman Menu lengkap dengan filter kategori
- ✅ Halaman Tentang Kami
- ✅ Halaman Kontak & Form Pemesanan
- ✅ Keranjang belanja (localStorage)
- ✅ Sistem pemesanan online
- ✅ Desain responsif (mobile & desktop)
- ✅ Warna biru muda yang segar

### Admin Panel
- ✅ Login aman (password: `admin123`)
- ✅ Dashboard statistik (produk, pesanan, pendapatan)
- ✅ CRUD Produk (Tambah, Edit, Hapus)
- ✅ Kelola Pesanan + update status
- ✅ Data tersimpan di browser (localStorage)

## Cara Menjalankan

1. Buka folder `miayam-bang-alwan`
2. Buka file `index.html` di browser (double-click atau drag ke browser)
3. Atau gunakan live server jika ada

**Tidak perlu server backend.** Semua berjalan di browser.

## Akses Admin

1. Klik tombol **Admin** di navbar
2. Password: `admin123`
3. Kelola produk dan pesanan dari dashboard

## Struktur Folder

```
miayam-bang-alwan/
├── index.html          # Beranda
├── menu.html           # Daftar Menu
├── about.html          # Tentang Kami
├── contact.html        # Kontak & Pesan
├── admin.html          # Admin Panel
├── css/
│   └── style.css       # Stylesheet utama
├── js/
│   ├── script.js       # Script frontend
│   └── admin.js        # Script admin
└── README.md
```

## Catatan

- Gambar produk menggunakan Unsplash (butuh koneksi internet)
- Data pesanan & produk disimpan di localStorage browser
- Cocok untuk demo / UMKM skala kecil
- Untuk produksi, disarankan integrasi backend (Firebase, Supabase, dll)

---
Dibuat untuk mendukung UMKM Indonesia 🍜
