# Agro Mandiri Mobile Wireframe: Mobile-First Design with Loyalty Badges

## 1. Pendahuluan
Dokumen ini menyediakan wireframe textual untuk antarmuka mobile Agro Mandiri E-Commerce, dengan fokus pada estetika **clean design** dan integrasi **lencana loyalitas pelanggan** untuk pengguna biasa, petani, dan penjual. Wireframe dirancang untuk layar mobile (320px-768px), mengutamakan navigasi sentuh-friendly, performa cepat, dan elemen visual yang membangkitkan rasa bangga pengguna.

### 1.1. Tujuan Wireframe
- Menyajikan tata letak mobile-first yang intuitif, bersih, dan estetis.
- Mengintegrasikan lencana loyalitas sebagai elemen visual yang menonjol untuk meningkatkan identitas dan retensi pengguna.
- Memastikan UI mendukung koneksi 3G dan perangkat low-end (misalnya, Android dengan 2GB RAM).

### 1.2. Estetika dan Lencana Loyalitas
- **Estetika Umum**:
  - **Palet Warna**:
    - **Hijau Daun (#2E7D32)**: Warna utama untuk elemen aktif (tombol, ikon, latar belakang utama).
    - **Putih Bersih (#FFFFFF)**: Latar belakang dominan untuk kesan bersih.
    - **Emas (#FFD700)**: Aksen untuk lencana, CTA, dan elemen premium.
    - **Cokelat (#6D4C41)**: Digunakan hanya sebagai **border tipis** (1-2px) atau **corak subtle** (misalnya, garis pemisah, outline ikon), dengan opacity rendah (0.3-0.5) agar tidak dominan namun tetap terasa.
  - **Font**: Inter (modern, readable), ukuran minimal 16px untuk aksesibilitas.
  - **Elemen Visual**: Ikon pertanian (daun, biji, traktor), rounded corners (8px), subtle shadows (opacity 0.2) untuk depth.
  - **Animasi**: Transisi halus (fade-in untuk lencana, swipe untuk slider) dengan latensi <100ms.
- **Lencana Loyalitas**:
  - **Pengguna Biasa**: Lencana "Pembeli Setia" (ikon keranjang dengan aksen emas).
  - **Petani**: Lencana "Petani Hebat" (ikon daun dengan badge level: Pemula, Pro, Master).
  - **Penjual**: Lencana "Penjual Unggul" (ikon toko dengan bintang emas).
  - **Penempatan**: Di samping User Avatar (Header), User Profile, Product Details (ulasan dan penjual).
  - **Efek**: Lencana memiliki animasi hover (pulse effect) dan tooltip (latar putih, border cokelat tipis) yang menjelaskan level/manfaat.
- **Clean Design**:
  - Mengutamakan ruang putih (padding 16px+) untuk kesan lapang.
  - Warna cokelat hanya untuk border (misalnya, card outline) atau corak (misalnya, garis pemisah dengan opacity 0.3).
  - Hijau dan putih mendominasi untuk menjaga UI terasa segar dan modern.

## 2. Wireframe Mobile

### 2.1. Landing Page
- **Deskripsi**: Halaman utama dengan promosi, navigasi, dan lencana loyalitas.
- **Tata Letak**:
  ```
  [Header]
  | Logo (Agro Mandiri, 40px) | Search Icon | Wishlist | Cart | Avatar + Lencana |
  | Border Bottom: Cokelat (#6D4C41, 1px, opacity 0.5) |
  [Hamburger Menu (on tap)]
  | Home | Products > Fertilizer, Pesticide, Seed, Equipment | Insights | About | Services |
  | Latar: Putih | Border Item: Cokelat (opacity 0.3) |
  [Hero Slider]
  | Slide 1: Promo Pupuk (Full-Width Image, CTA: "Beli Sekarang") |
  | Swipeable, Dots Indicator (Emas) |
  [Category Section]
  | 2x2 Grid: Fertilizer (Icon Daun), Pesticide (Icon Semprotan), Seed (Icon Biji), Equipment (Icon Traktor) |
  | Card: Latar Putih, Border Cokelat (1px, opacity 0.5), Hover Animation |
  [Featured Products]
  | Vertical Scroll: 6 Product Cards (Image, Name, Price, Rating, Lencana Penjual) |
  | Card: Latar Putih, Border Cokelat (opacity 0.3), Add to Cart (Hijau) |
  [Special Offers]
  | Banner: "Diskon 20% untuk Petani Hebat" (Latar Hijau, CTA Emas) |
  | Border: Cokelat (opacity 0.5) |
  [Knowledge Section]
  | 2 Article Previews: Image, Title, Snippet (e.g., "Cara Memilih Pupuk") |
  | Card: Latar Putih, Divider Cokelat (opacity 0.3) |
  [Testimonials]
  | Swipeable: 1 Quote (User Name, Lencana, Rating, Text) |
  | Card: Latar Putih, Border Cokelat (opacity 0.5) |
  [Footer]
  | Collapsed: Links (Home, Contact), Social Icons (Hijau) |
  | Divider: Cokelat (opacity 0.3) |
  ```
- **Estetika**:
  - **Hero Slider**: Gambar produk dengan overlay hijau transparan (0.2), teks putih bold, CTA emas, border cokelat tipis di sekitar CTA.
  - **Category Cards**: Ikon besar (48px), latar putih, border cokelat (1px, opacity 0.5), teks hijau.
  - **Lencana**: Di Header (samping Avatar, 24px) dan Product Cards (samping nama penjual, 16px), dengan tooltip putih dan border cokelat (opacity 0.5).
  - **Animasi**: Slider swipe dengan fade, lencana pulse saat load, cards fade-in saat scroll.
- **Catatan Mobile-First**:
  - Header: Ikon 32px, padding 12px untuk sentuhan.
  - Hamburger Menu: Slide-in, latar putih, divider cokelat (opacity 0.3).
  - Product Cards: Tinggi 280px, teks 14px untuk hemat ruang.

### 2.2. Product Listing
- **Deskripsi**: Halaman daftar produk dengan pencarian, filter, dan lencana penjual.
- **Tata Letak**:
  ```
  [Hero]
  | Full-Width Banner: Category Image (e.g., Pupuk) |
  | Border Bottom: Cokelat (opacity 0.5) |
  [Search & Filter]
  | Search Bar (Mic Icon) | Sort Dropdown | Filter Toggle (Hijau) |
  | Border: Cokelat (1px, opacity 0.5) |
  [Filter Panel (on toggle)]
  | Price Slider | Brand Checkbox | Type Dropdown (e.g., Organik) | Apply Button (Emas) |
  | Latar: Putih | Divider: Cokelat (opacity 0.3) |
  [Product List]
  | Single-Column: Product Cards (Image, Name, Price, Rating, Lencana Penjual) |
  | Card: Latar Putih, Border Cokelat (opacity 0.3), Wishlist, Add to Cart (Hijau) |
  [Load More]
  | Button: "Tampilkan Lebih Banyak" (Latar Emas, Border Cokelat opacity 0.5) |
  ```
- **Estetika**:
  - **Search Bar**: Latar putih, border cokelat (opacity 0.5), ikon mikrofon hijau.
  - **Filter Panel**: Latar putih, divider cokelat (opacity 0.3), tombol Apply emas.
  - **Product Cards**: Gambar (150x150px), lencana penjual (16px, sudut kanan atas), rating bintang emas, border card cokelat (opacity 0.3).
  - **Animasi**: Filter panel slide-in, cards fade-in saat scroll.
- **Catatan Mobile-First**:
  - Filter Toggle: Ikon 32px, collapsable, padding 16px.
  - Product Cards: Single-column, tombol Add to Cart lebar penuh.

### 2.3. Product Details
- **Deskripsi**: Halaman detail produk dengan kalkulator dosis dan lencana.
- **Tata Letak**:
  ```
  [Breadcrumb]
  | Home > Fertilizer > Product (Scrollable, 12px) |
  | Divider: Cokelat (opacity 0.3) |
  [Image Carousel]
  | Swipeable Images (Full-Width, Zoom on Tap) |
  | Border Bottom: Cokelat (opacity 0.5) |
  [Product Info]
  | Name (Bold, 20px) | Price | Rating (Bintang Emas) |
  | Dropdown: Variants (e.g., 1kg, 5kg) | Quantity Input |
  | Lencana Penjual (Top-Right, 16px, Tooltip: Putih, Border Cokelat opacity 0.5) |
  [Fixed Bottom Bar]
  | Add to Cart | Wishlist | WhatsApp (Icons + Text, Emas) |
  | Latar: Hijau Tua | Border Top: Cokelat (opacity 0.5) |
  [Tabs]
  | Description | Type | Benefits | Application | Reviews |
  | Reviews: User Name, Lencana (e.g., Petani Pro), Rating, Text, Photo |
  | Tab Border: Cokelat (opacity 0.3) |
  [Kalkulator Dosis]
  | Input: Land Area (Numeric), Crop Type (Dropdown) |
  | Button: "Hitung" (Emas) | Result: Card Putih, Border Cokelat (opacity 0.5) |
  [Related Products]
  | Horizontal Scroll: 4 Product Cards (Lencana Penjual) |
  | Card Border: Cokelat (opacity 0.3) |
  ```
- **Estetika**:
  - **Image Carousel**: Overlay hijau (0.1), dots indicator emas, border cokelat (opacity 0.5).
  - **Fixed Bottom Bar**: Latar hijau tua, tombol emas, border top cokelat (opacity 0.5).
  - **Kalkulator Dosis**: Form putih, border cokelat (opacity 0.5), result card hijau muda.
  - **Lencana**: Di Reviews, lencana pengguna (misalnya, Petani Hebat) dengan ikon daun, tooltip putih dengan border cokelat.
  - **Animasi**: Carousel swipe, tab switch fade, lencana pulse saat tap.
- **Catatan Mobile-First**:
  - Bottom Bar: Fixed, tinggi 60px, tombol lebar.
  - Tabs: Horizontal scroll, teks 14px.
  - Kalkulator: Keyboard numerik otomatis.

### 2.4. Shopping Cart
- **Deskripsi**: Halaman pengelolaan keranjang dengan lencana loyalitas.
- **Tata Letak**:
  ```
  [Breadcrumb]
  | Home > Cart (Scrollable) |
  | Divider: Cokelat (opacity 0.3) |
  [Checkout Stepper]
  | Cart > Shipping > Payment (Compact, Emas Indicator) |
  | Border Bottom: Cokelat (opacity 0.5) |
  [Cart Items]
  | List: Product Image (80x80px), Name, Quantity, Price, Lencana Penjual |
  | Quantity: +/- Buttons | Card Border: Cokelat (opacity 0.3) |
  [Save Cart]
  | Button: "Simpan untuk Nanti" (Outline Hijau, Border Cokelat opacity 0.5) |
  [Total Price]
  | Card: Subtotal, Tax, Total (Emas) | Border: Cokelat (opacity 0.5) |
  [Checkout Button]
  | Fixed Bottom: "Lanjut ke Checkout" (Emas, Border Cokelat opacity 0.5) |
  ```
- **Estetika**:
  - **Stepper**: Ikon lingkaran hijau, garis emas, border cokelat (opacity 0.5).
  - **Cart Items**: Card putih, lencana penjual kecil, border cokelat (opacity 0.3).
  - **Total Price**: Card putih, teks emas, border cokelat (opacity 0.5).
  - **Animasi**: Stepper highlight saat tap, checkout button ripple.
- **Catatan Mobile-First**:
  - Stepper: Ikon 24px, teks 12px.
  - Quantity Buttons: 40x40px untuk sentuhan.

### 2.5. Shipping
- **Deskripsi**: Halaman pengiriman dan pembayaran dengan lencana.
- **Tata Letak**:
  ```
  [Breadcrumb]
  | Home > Cart > Shipping |
  | Divider: Cokelat (opacity 0.3) |
  [Checkout Stepper]
  | Cart > Shipping > Payment |
  | Border Bottom: Cokelat (opacity 0.5) |
  [Shipping Form]
  | Input: Name, Address, Phone (Numeric Keyboard) |
  | Dynamic Assist: Autocomplete Address, Phone Validation |
  | Checkbox: Save to Profile | Border: Cokelat (opacity 0.5) |
  [Pelacakan Real-Time]
  | Button: "Cek Status Pengiriman" (Hijau) |
  [Payment Options]
  | Radio Buttons: E-Wallet, Cicilan, COD (Icons Hijau) |
  | Border: Cokelat (opacity 0.3) |
  [Total Price]
  | Card: Subtotal, Shipping, Total (Emas) | Border: Cokelat (opacity 0.5) |
  [Pay Button]
  | Fixed Bottom: "Bayar Sekarang" (Emas, Border Cokelat opacity 0.5) |
  ```
- **Estetika**:
  - **Form**: Input putih, border cokelat (opacity 0.5), ikon validasi hijau.
  - **Payment Options**: Ikon 48px, radio button hijau, divider cokelat (opacity 0.3).
  - **Pay Button**: Latar emas, teks putih, border cokelat (opacity 0.5).
  - **Animasi**: Form feedback (shake jika error), pay button scale.
- **Catatan Mobile-First**:
  - Form: Input tinggi 48px untuk sentuhan.
  - Pay Button: Fixed, lebar penuh.

### 2.6. User Profile
- **Deskripsi**: Halaman manajemen akun dengan lencana loyalitas menonjol.
- **Tata Letak**:
  ```
  [Header]
  | Back Arrow | User Profile Title |
  | Border Bottom: Cokelat (opacity 0.5) |
  [Profile Info]
  | Avatar (80x80px) | Name | Lencana (e.g., Petani Pro, Tooltip: Putih, Border Cokelat) |
  | Poin Loyalitas: "500 Poin" (Emas, Card, Border Cokelat opacity 0.5) |
  [Tabs]
  | Account | Address | Cart | Wishlist | History | Tracking | Seller |
  | Tab Border: Cokelat (opacity 0.3) |
  [Account]
  | Input: Name, Email, Phone | Border: Cokelat (opacity 0.5) |
  [Address]
  | List: Saved Addresses | Add Button (Hijau) |
  [Poin Loyalitas]
  | Progress Bar: Level Pemula > Pro (Emas) | Benefits List |
  | Border: Cokelat (opacity 0.5) |
  [Notifikasi]
  | Toggle: Promo, Order Status (Hijau) | Divider: Cokelat (opacity 0.3) |
  [Seller Registration]
  | Button: "Daftar sebagai Penjual" (Outline Emas, Border Cokelat opacity 0.5) |
  ```
- **Estetika**:
  - **Profile Info**: Avatar dengan border emas, lencana besar (48px), tooltip putih dengan border cokelat.
  - **Poin Loyalitas**: Progress bar hijau, aksen emas, border cokelat (opacity 0.5).
  - **Tabs**: Rounded, latar hijau muda saat aktif, border cokelat (opacity 0.3).
  - **Animasi**: Tab switch slide, lencana tooltip fade-in.
- **Catatan Mobile-First**:
  - Tabs: Horizontal scroll, ikon 16px.
  - Lencana: Tooltip responsif saat tap.

### 2.7. Admin Dashboard (Mobile View)
- **Deskripsi**: Dashboard admin dengan lencana penjual.
- **Tata Letak**:
  ```
  [Header]
  | Logo | Hamburger Menu |
  | Border Bottom: Cokelat (opacity 0.5) |
  [Hamburger Menu]
  | Summarize | Products | Categories | Orders | Users | SEO | Analytics | Logistics | Audit | Content |
  | Latar: Putih | Divider: Cokelat (opacity 0.3) |
  [Summarize]
  | Card: Sales Graph (Responsive) | Stok Alert | User Activity |
  | Border: Cokelat (opacity 0.5) |
  [Product Management]
  | List: Product Cards (Name, Price, Lencana Penjual) | Add Button (Hijau) |
  | Border: Cokelat (opacity 0.3) |
  [Analytics]
  | Card: Sales Report | Export CSV Button (Emas) |
  | Border: Cokelat (opacity 0.5) |
  [Audit Log]
  | List: Activity (Admin Name, Action, Timestamp) |
  | Divider: Cokelat (opacity 0.3) |
  [Content Management]
  | List: Articles | Add Article Button (Hijau) |
  | Border: Cokelat (opacity 0.5) |
  ```
- **Estetika**:
  - **Summarize**: Graph hijau/putih, card putih, border cokelat (opacity 0.5).
  - **Product Cards**: Lencana penjual kecil (16px), tombol edit emas, border cokelat (opacity 0.3).
  - **Animasi**: Graph zoom-in, menu slide-in.
- **Catatan Mobile-First**:
  - Hamburger Menu: Lebar 80% layar, divider cokelat (opacity 0.3).
  - Cards: Single-column, tinggi 180px.

## 3. Catatan Implementasi
- **Teknologi**:
  - Frontend: Next.js (App Router), Tailwind CSS (mobile-first, `sm:` jarang), shadcn/ui.
  - Animasi: Framer Motion untuk pulse, fade, slide.
  - Lencana: SVG icons, styled dengan Tailwind.
- **Performa**:
  - Next.js Image untuk kompresi gambar.
  - Lazy load Product Cards dan Related Products.
  - Cache lencana di local storage.
- **Aksesibilitas**:
  - Kontras: Minimal 4.5:1 (putih pada hijau tua).
  - ARIA labels untuk lencana (e.g., "Lencana Petani Pro").
  - Keyboard numerik untuk form.
- **Warna Cokelat**:
  - Kode: `#6D4C41`, opacity 0.3-0.5.
  - Penggunaan: Border (1-2px), divider, outline ikon.
  - Tailwind: `border-brown-700/30`, `divide-brown-700/30`.
- **Testing**:
  - Uji pada Android low-end (Chrome Mobile, 3G).
  - Pastikan border cokelat terlihat subtle namun jelas.

## 4. Contoh Lencana Loyalitas
- **Pembeli Setia**:
  - Ikon: Keranjang dengan bintang emas.
  - Tooltip: "Diskon 3% setiap pembelian!" (Putih, border cokelat opacity 0.5).
  - Warna: Emas (#FFD700), border hijau.
- **Petani Hebat**:
  - Ikon: Daun, badge level (Pemula: Perak, Pro: Emas, Master: Hijau Tua).
  - Tooltip: "Petani Pro: Diskon 5% + Prioritas Pengiriman."
  - Animasi: Pulse saat level naik.
- **Penjual Unggul**:
  - Ikon: Toko dengan bintang emas.
  - Tooltip: "Penjual Unggul: Produk Dipromosikan!" (Putih, border cokelat opacity 0.5).
  - Warna: Emas, aksen hijau.

## 5. Referensi
- **Palet Warna**: Hijau (#2E7D32), Putih (#FFFFFF), Emas (#FFD700), Cokelat (#6D4C41, opacity 0.3-0.5).
- **Font**: Inter (Google Fonts, 16px+).
- **Inspirasi UI**: Elemen pertanian Indonesia (daun, tanah).
- **Dokumentasi**: shadcn/ui, Tailwind CSS, Next.js.