# Knowledge Base: Agro Mandiri E-Commerce

## 1. Overview
**Judul**: Agro Mandiri E-Commerce Platform  
**Deskripsi**: Platform e-commerce untuk produk pertanian Indonesia (Fertilizer, Pesticide, Seed, Equipment) dengan fokus pada pengalaman pengguna, edukasi petani, dan skalabilitas bisnis.  
**Teknologi**:
- Frontend: Next.js (App Router), Tailwind CSS, shadcn/ui.
- Backend: Supabase.
- Validation: Zod.
- State Management: Zustand.
**Status**: Dalam pengembangan, tanpa framework KkAM.

## 2. Modul dan Fitur

### 2.1. Client Side
| Modul             | Deskripsi                                                                 | Komponen Utama                                                                 |
|-------------------|---------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| Landing Page      | Halaman utama dengan promosi dan navigasi                                | Header, Mega Menu, Hero Slider, Category Section, Featured Products, Knowledge. |
| Product Listing   | Daftar produk dengan pencarian dan filter                                | Search Bar, Sort, Filter (Harga, Merek, Tipe), Product Card.                   |
| Product Details   | Informasi lengkap produk dengan alat bantu                               | Breadcrumb, Product Info, Kalkulator Dosis, Ulasan, Related Products.          |
| Shopping Cart     | Pengelolaan item sebelum checkout                                        | Checkout Stepper, Cart Items, Save Cart, Total Price.                          |
| Shipping          | Pengaturan pengiriman dan pembayaran                                     | Shipping Form, Pelacakan Real-Time, Payment Options, Invoice.                  |
| User Profile      | Manajemen akun dan aktivitas pengguna                                    | Akun, Alamat, Wishlist, Loyalitas, Notifikasi, Pendaftaran Penjual.           |

### 2.2. Admin Dashboard
| Modul                     | Deskripsi                                                  | Komponen Utama                                              |
|---------------------------|------------------------------------------------------------|-------------------------------------------------------------|
| Summarize                 | Ringkasan data penjualan dan stok                          | Grafik, Statistik.                                          |
| Product/Category Mgmt     | Pengelolaan produk dan kategori                            | CRUD untuk produk dan kategori.                             |
| Order/User Mgmt           | Pemantauan pesanan dan pengguna                            | Daftar pesanan, profil pengguna.                            |
| SEO Mgmt                  | Optimasi mesin pencari                                     | Metadata editor.                                            |
| Report and Analytics      | Laporan performa                                           | Penjualan, produk populer, export CSV.                      |
| Manajemen Logistik (Baru) | Koordinasi pengiriman                                      | Integrasi logistik, tarif pengiriman.                       |
| Audit Log (Baru)          | Catatan aktivitas admin                                    | Log dengan timestamp dan detail pengguna.                   |
| Konten Edukasi (Baru)     | Pengelolaan artikel Knowledge                              | Editor WYSIWYG, kategori artikel.                           |

### 2.3. Fitur Teknis
- **PWA**: Akses offline dan instalasi aplikasi.
- **Notifikasi Push**: Web push untuk promo dan status pesanan.
- **Personalisasi**: Rekomendasi produk berbasis AI.

## 3. Spesifikasi Teknis
- **Database**: Supabase (PostgreSQL) untuk produk, pengguna, pesanan, ulasan, dan log.
- **API**: REST API dari Supabase untuk semua interaksi backend.
- **Frontend**: Next.js dengan SSR untuk SEO, Tailwind CSS untuk styling responsif.
- **State Management**: Zustand untuk keranjang, filter, dan UI state.
- **Validasi**: Zod untuk input pengguna (misalnya, form pengiriman).
- **Integrasi**:
  - Payment Gateway: Midtrans/Xendit.
  - Logistik: JNE/SiCepat (API pelacakan).
  - Push Notification: Firebase.

## 4. Panduan Pengembangan
- **Struktur Kode**:
  - `/pages`: Rute Next.js (misalnya, `/products`, `/cart`).
  - `/components`: Komponen shadcn/ui (misalnya, ProductCard, CheckoutStepper).
  - `/lib`: Utilitas seperti koneksi Supabase dan validasi Zod.
  - `/stores`: Zustand stores untuk state management.
- **Best Practices**:
  - Gunakan TypeScript untuk type safety.
  - Implementasikan lazy loading untuk Product Listing.
  - Tambahkan unit test untuk kalkulator dosis dan validasi form.
- **Dokumentasi**:
  - API: Dokumentasikan endpoint Supabase di `/docs/api`.
  - Komponen: Deskripsikan penggunaan di `/docs/components`.

## 5. Pembaruan dan Maintenance
- **Frekuensi Pembaruan**: Setiap sprint (2 minggu) untuk fitur baru.
- **Proses Pembaruan**:
  1. Validasi fitur baru dengan stakeholder (petani, penjual, admin).
  2. Update knowledge base di sistem manajemen pengetahuan.
  3. Backup database sebelum deploy fitur baru.
- **Kontak**:
  - Tim Teknis: [email tim dev].
  - Tim Bisnis: [email tim produk].

## 6. Referensi
- **Wireframe**: [Link ke Figma atau deskripsi textual di PRD].
- **API Docs**: Supabase dashboard atau `/docs/api`.
- **UI Library**: shadcn/ui documentation.