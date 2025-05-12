# Prompt untuk Context7 - Agro Mandiri MVP (Tugas 1-9)
# Salin setiap prompt ke chat Context7 satu per satu.
# Pastikan library_log.txt ada di folder proyek untuk mencatat ID library.

# Tugas 1: Setup Next.js Project with Tailwind CSS and shadcn/ui
use context7 get-library-docs next/14.2/app-router;tailwindcss/3.4/setup;shadcn-ui/0.8/button,card snippets-only language:javascript tokens:3000 taskId:Task1
Buat proyek Next.js dengan Tailwind CSS dan shadcn/ui (komponen Button, Card). Gunakan warna hijau (#2E7D32) untuk tombol, putih (#FFFFFF) untuk latar, emas (#FFD700) untuk aksen, cokelat (#6D4C41, opacity 0.3) untuk border. Pastikan mobile-first (320px-768px). Hasilkan kode untuk folder /app, /components, /lib, /stores dan mockup Figma untuk Button (latar emas, border cokelat opacity 0.5). Catat library di library_log.txt: next/14.2, topik: app-router, tugas: Task1; tailwindcss/3.4, topik: setup, tugas: Task1; shadcn-ui/0.8, topik: button,card, tugas: Task1.

# Tugas 2: Implement Supabase Integration
use context7 get-library-docs supabase-js/2.45/auth,storage snippets-only language:javascript tokens:2000 taskId:Task2
Buat integrasi Supabase untuk autentikasi dan penyimpanan gambar produk. Hasilkan kode untuk tabel users, products, categories di Supabase dan client di Next.js. Pastikan mobile-first. Catat library di library_log.txt: supabase-js/2.45, topik: auth,storage, tugas: Task2.

# Tugas 3: Develop User Authentication and Basic Profile
use context7 get-library-docs supabase-js/2.45/auth snippets-only language:javascript tokens:2000 taskId:Task3
Buat halaman login, register, dan profil dengan Supabase Auth. Profil punya Avatar (80x80px, border emas), Lencana Loyalitas (48x48px, emas, animasi seperti detak jantung), dan Poin (kotak putih, border cokelat opacity 0.5). Gunakan shadcn/ui untuk form dan tombol. Pastikan mobile-first, tombol besar (44x44px). Hasilkan kode Next.js dan mockup Figma untuk profil. Catat library di library_log.txt: supabase-js/2.45, topik: auth, tugas: Task3.

# Tugas 4: Create Product Catalog with Categories
use context7 get-library-docs next/14.2/dynamic-routing;shadcn-ui/0.8/card snippets-only language:javascript tokens:3000 taskId:Task4
Buat halaman katalog produk (/products) dengan kategori (Pupuk, Pestisida, Benih, Peralatan). Gunakan shadcn/ui Card untuk ProductCard (328x280px, border cokelat opacity 0.3) dengan gambar, nama, harga, dan lencana penjual (24x24px, emas). Pastikan mobile-first, satu kolom di layar kecil. Hasilkan kode Next.js, schema Supabase untuk products dan categories, dan mockup Figma. Catat library di library_log.txt: next/14.2, topik: dynamic-routing, tugas: Task4; shadcn-ui/0.8, topik: card, tugas: Task4.

# Tugas 5: Implement Simple Product Search and Filtering
use context7 get-library-docs zustand/4.5/state-management snippets-only language:javascript tokens:2000 taskId:Task5
Buat fitur pencarian produk dan filter berdasarkan kategori dan harga. Gunakan Zustand untuk menyimpan pilihan filter. Tampilkan hasil di halaman /products dengan shadcn/ui Input untuk pencarian. Pastikan mobile-first, input besar (48px). Hasilkan kode Next.js dan mockup Figma untuk pencarian. Catat library di library_log.txt: zustand/4.5, topik: state-management, tugas: Task5.

# Tugas 6: Develop Product Detail Pages
use context7 get-library-docs next/14.2/dynamic-routing;shadcn-ui/0.8/carousel,tabs snippets-only language:javascript tokens:3000 taskId:Task6
Buat halaman detail produk (/products/[id]) dengan carousel gambar (360x200px, overlay hijau opacity 0.1), info produk, dan tombol Tambah ke Keranjang (latar emas, border cokelat opacity 0.5). Gunakan shadcn/ui Carousel dan Tabs (border cokelat opacity 0.3) untuk deskripsi, manfaat, aplikasi. Tambahkan lencana penjual (24x24px, emas). Pastikan mobile-first, tombol fixed di bawah. Hasilkan kode Next.js dan mockup Figma. Catat library di library_log.txt: next/14.2, topik: dynamic-routing, tugas: Task6; shadcn-ui/0.8, topik: carousel,tabs, tugas: Task6.

# Tugas 7: Implement Shopping Cart Functionality
use context7 get-library-docs zustand/4.5/state-management snippets-only language:javascript tokens:2000 taskId:Task7
Buat sistem keranjang belanja dengan Zustand. Halaman /cart menampilkan daftar produk (kotak putih, border cokelat opacity 0.3), total harga (teks emas), dan tombol Checkout (full-width, emas). Tambahkan ikon keranjang di header (24x24px, badge emas). Pastikan mobile-first, simpan keranjang di penyimpanan lokal. Hasilkan kode Next.js dan mockup Figma. Catat library di library_log.txt: zustand/4.5, topik: state-management, tugas: Task7.

# Tugas 8: Develop Checkout Process
use context7 get-library-docs zod/3.23/form-validation snippets-only language:javascript tokens:2000 taskId:Task8
Buat halaman checkout dengan form pengiriman (shadcn/ui Input, 48px) dan validasi menggunakan Zod. Tampilkan langkah (Cart > Shipping > Payment) dan tombol Bayar (latar emas, border cokelat opacity 0.5). Dukung pembayaran COD. Pastikan mobile-first, form satu kolom. Hasilkan kode Next.js, schema Supabase untuk orders, dan mockup Figma. Catat library di library_log.txt: zod/3.23, topik: form-validation, tugas: Task8.

# Tugas 9: Create Basic Admin Dashboard
use context7 get-library-docs next/14.2/dynamic-routing;supabase-js/2.45/auth snippets-only language:javascript tokens:3000 taskId:Task9
Buat dashboard admin dengan menu untuk mengelola produk dan kategori. Gunakan shadcn/ui untuk tabel dan form. Batasi akses hanya untuk admin dengan Supabase Auth. Pastikan mobile-first, menu samping yang bisa disembunyikan. Hasilkan kode Next.js dan mockup Figma. Catat library di library_log.txt: next/14.2, topik: dynamic-routing, tugas: Task9; supabase-js/2.45, topik: auth, tugas: Task9.