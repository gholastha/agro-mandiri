# Dokumen Persyaratan Produk (PRD): E-Commerce Agro Mandiri

## 1. Pendahuluan

### 1.1. Tujuan Proyek
Agro Mandiri adalah platform e-commerce yang dirancang untuk memasarkan produk pertanian Indonesia dalam kategori **Pupuk**, **Pestisida**, **Benih**, dan **Peralatan**. Tujuannya adalah untuk menyediakan solusi belanja edukatif yang mudah digunakan yang mendukung petani dan penjual melalui teknologi modern, dengan fokus pada pengalaman pengguna yang optimal dan skalabilitas bisnis.

### 1.2. Cakupan
PRD ini meliputi:
- Fitur inti untuk **Sisi Klien** (Halaman Arahan, Daftar Produk, Detail Produk, Keranjang Belanja, Pengiriman, Profil Pengguna).
- Fitur **Dasbor Admin** untuk manajemen produk, pesanan, dan analitik.
- Fitur tambahan yang direkomendasikan untuk meningkatkan UX dan daya saing.
- Spesifikasi teknis berdasarkan teknologi Next.js, Supabase, Tailwind CSS, Zod, dan Zustand.
- Keterbatasan: Tidak menggunakan kerangka kerja KkAM, berfokus pada pengembangan tanpa integrasi IoT atau perangkat keras.

### 1.3. Persona Pengguna
| Persona | Deskripsi | Kebutuhan Utama |
|-------------------|----------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| Petani Pemula | Petani dengan pengalaman terbatas, membutuhkan panduan produk dan aplikasi | Kalkulator dosis, UI sederhana, pendidikan melalui Bagian Pengetahuan. |
| Petani Berpengalaman | Petani profesional, berfokus pada efisiensi dan kualitas produk | Filter produk tingkat lanjut, pelacakan pengiriman, opsi pembayaran fleksibel. |
| Penjual | Pemasok produk pertanian (pupuk, benih, dll.) | Manajemen produk, laporan penjualan, integrasi logistik. |
| Admin | Manajer platform | Dasbor analitis, manajemen pengguna, log audit untuk keamanan. |

## 2. Fitur dan Spesifikasi

### 2.1. Sisi Klien

#### 2.1.1. Halaman Arahan
- **Deskripsi**: Halaman beranda dengan elemen promosi dan navigasi intuitif.
- **Komponen**:
- **Header**: Logo, Bilah Pencarian, Daftar Keinginan, Keranjang Belanja, Avatar Pengguna (Profil, Keluar).
- **Menu Navigasi Mega**: Beranda, Produk (Pupuk, Pestisida, Benih, Peralatan), Wawasan, Tentang, Layanan.
- **Hero Image Slider**: 3-5 slide dengan CTA (misalnya, "Belanja Sekarang").
- **Bagian Kategori**: Ikon dan deskripsi singkat untuk setiap kategori.
- **Produk Unggulan, Penawaran Khusus, Bagian Pengetahuan, Testimoni, Footer**.
- **Manfaat**: Menarik perhatian pengguna, membuat navigasi lebih mudah, dan mempromosikan produk unggulan.
- **Spesifikasi Teknis**:
- Frontend: Next.js (App Router) dengan Tailwind CSS dan shadcn/ui untuk komponen.
- Backend: Supabase untuk mengambil data produk unggulan dan konten Pengetahuan.
- SEO: Metadata dinamis untuk setiap slide dan kategori menggunakan Next.js.
- **Wireframe (Tekstual)**:
```
[Header: Logo | Bilah Pencarian | Daftar Keinginan | Keranjang | Avatar]
[Mega Menu: Beranda | Produk > Pupuk, Pestisida, Benih, Peralatan | Wawasan | Tentang | Layanan]
[Hero Slider: Slide 1 (Tombol CTA) | Slide 2 | [Slide 3]
[Bagian Kategori: 4 Kartu dengan Ikon (Pupuk, Pestisida, Benih, Peralatan)]
[Produk Unggulan: Kisi 6 Kartu Produk]
[Penawaran Khusus: 3 Spanduk Promosi]
[Pengetahuan: 3 Pratinjau Artikel]
[Testimoni: 3 Kutipan Pengguna dengan Peringkat]
[Footer: Tautan, Info Kontak, Media Sosial]
```
- **Kriteria Penerimaan**:
- Halaman dimuat dalam <2 detik.
- Bilah Pencarian mendukung pelengkapan otomatis dengan hasil dalam <1 detik.
- Slider Hero berubah setiap 5 detik dengan transisi yang mulus.

#### 2.1.2. Daftar Produk
- **Deskripsi**: Halaman untuk menampilkan produk dengan opsi pencarian, pengurutan, dan pemfilteran.
- **Komponen**:
- **Hero**: Spanduk promosi kategori.
- **Pencarian Produk**: Input dengan pelengkapan otomatis.
- **Urutkan Produk**: Opsi urutkan (Harga: Rendah-Tinggi, Peringkat, Terbaru).
- **Filter Produk (Baru)**: Filter berdasarkan harga, merek, jenis (misalnya, pupuk organik), dan spesifikasi (misalnya, NPK).
- **Tampilan Produk**: Kisi/Thumbnail dengan Kartu Produk (Daftar Keinginan, Tambahkan ke Keranjang, Peringkat, Lencana).
- **Manfaat**: Memudahkan pengguna menemukan produk sesuai kebutuhan mereka.
- **Spesifikasi Teknis**:
- Frontend: Zustand untuk filter dan urutkan status, Next.js untuk rendering dinamis.
- Backend: Supabase untuk kueri produk dengan filter dan paginasi.
- **Wireframe (Tekstual)**:
```
[Hero: Spanduk Kategori]
[Bilah Pencarian | Urutkan Dropdown | Filter Sidebar (Harga, Merek, Jenis, Spesifikasi)]
[Kotak Produk: 3xN Kartu Produk (Gambar, Nama, Harga, Peringkat, Daftar Keinginan, Tambahkan ke Keranjang)]
[Penomoran Halaman: Sebelumnya | 1, 2, 3... | Berikutnya]
```
- **Kriteria Penerimaan**:
- Filter dan penyortiran diterapkan dalam <1 detik.
- Mendukung minimal 50 produk per halaman