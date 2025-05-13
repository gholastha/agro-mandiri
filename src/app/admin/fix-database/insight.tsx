'use client';

import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sprout, 
  Droplets, 
  Leaf,
  Shovel,
  BookOpen,
  PanelRightOpen,
  AlertCircle
} from 'lucide-react';

export default function InsightContent() {
  return (
    <div className="py-4">
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Ikhtisar Proyek</TabsTrigger>
          <TabsTrigger value="features">Fitur Insight</TabsTrigger>
          <TabsTrigger value="categories">Kategori Insight</TabsTrigger>
          <TabsTrigger value="issues">Isu & Solusi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ikhtisar Proyek Agro Mandiri</CardTitle>
              <CardDescription>
                Informasi umum tentang proyek
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Proyek</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>E-Commerce platform produk pertanian Indonesia yang berfokus pada Pupuk, Pestisida, Benih, dan Peralatan.</p>
                    <div className="flex gap-2 mt-2">
                      <Sprout className="text-green-600 w-5 h-5" />
                      <Droplets className="text-blue-600 w-5 h-5" />
                      <Leaf className="text-green-700 w-5 h-5" />
                      <Shovel className="text-orange-700 w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Teknologi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Next.js (App Router)</li>
                      <li>Tailwind CSS + shadcn/ui</li>
                      <li>Supabase Backend</li>
                      <li>Zod untuk validasi</li>
                      <li>Zustand untuk state management</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Status Implementasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Admin Dashboard</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Manajemen produk (perlu perbaikan)</li>
                        <li>Manajemen kategori</li>
                        <li>Manajemen konten (baru diimplementasikan)</li>
                        <li>Pengaturan</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Sisi Client</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Landing page (dalam pengembangan)</li>
                        <li>Daftar produk (dalam pengembangan)</li>
                        <li>Detail produk (dalam pengembangan)</li>
                        <li>Keranjang belanja (dalam pengembangan)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Fitur Insight</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Artikel pertanian</li>
                        <li>Rekomendasi produk</li>
                        <li>Tips & Trik</li>
                        <li>Studi kasus</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fitur Insight Agro Mandiri</CardTitle>
              <CardDescription>
                Menyajikan pengetahuan pertanian berkualitas kepada pelanggan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="text-primary w-5 h-5" />
                      <CardTitle className="text-lg">Artikel Informatif</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">Artikel mendalam tentang praktik pertanian, penggunaan produk, dan tren industri.</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Informasi terkini tentang pertanian</li>
                      <li>Penjelasan teknis penggunaan produk</li>
                      <li>Perbandingan produk</li>
                      <li>Studi kasus sukses</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <PanelRightOpen className="text-primary w-5 h-5" />
                      <CardTitle className="text-lg">Kategorisasi Cerdas</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">Artikel dikelompokkan berdasarkan kategori produk untuk membantu pelanggan menemukan informasi yang relevan.</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Terhubung dengan kategori produk</li>
                      <li>Penandaan dengan metadata khusus</li>
                      <li>Penelusuran berdasarkan topik</li>
                      <li>Rekomendasi otomatis untuk produk terkait</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Cara Penggunaan Fitur Insight</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      <p className="font-semibold">Buat konten insight baru</p>
                      <p className="text-sm">Buka &quot;Admin&quot; ➔ &quot;Konten&quot; ➔ klik tombol &quot;Tambah Konten&quot;.</p>
                    </li>
                    <li>
                      <p className="font-semibold">Atur sebagai insight pertanian</p>
                      <p className="text-sm">Pada tab &quot;Informasi Dasar&quot;, centang &quot;Artikel ini berkaitan dengan wawasan pertanian&quot; dan pilih kategori produk yang relevan.</p>
                    </li>
                    <li>
                      <p className="font-semibold">Tulis konten berkualitas</p>
                      <p className="text-sm">Pada tab &quot;Konten&quot;, gunakan editor untuk menulis artikel dengan pengetahuan terkini dan berguna.</p>
                    </li>
                    <li>
                      <p className="font-semibold">Optimasi SEO</p>
                      <p className="text-sm">Pada tab &quot;SEO&quot;, masukkan meta title dan meta description untuk meningkatkan visibilitas di mesin pencari.</p>
                    </li>
                    <li>
                      <p className="font-semibold">Publikasikan dan tinjau</p>
                      <p className="text-sm">Centang &quot;Publikasikan Sekarang&quot; untuk membuat artikel langsung tersedia atau biarkan tidak dicentang untuk menyimpan sebagai draft.</p>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kategori Insight Pertanian</CardTitle>
              <CardDescription>
                Insight dikelompokkan berdasarkan empat kategori utama produk Agro Mandiri
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-green-600">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Sprout className="text-green-600 w-5 h-5" />
                      <CardTitle className="text-lg">Insight Pupuk</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">Pengetahuan tentang penggunaan berbagai jenis pupuk dan dampaknya pada tanaman.</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Jenis pupuk (organik, anorganik)</li>
                      <li>Manfaat dan aplikasi spesifik</li>
                      <li>Dosis dan waktu penggunaan</li>
                      <li>Studi kasus keberhasilan</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-blue-600">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Droplets className="text-blue-600 w-5 h-5" />
                      <CardTitle className="text-lg">Insight Pestisida</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">Pengetahuan tentang manajemen hama dan penggunaan pestisida yang aman dan efektif.</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Jenis pestisida (insektisida, fungisida, herbisida)</li>
                      <li>Penggunaan yang tepat dan aman</li>
                      <li>Manajemen hama terpadu</li>
                      <li>Alternatif ramah lingkungan</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-green-700">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Leaf className="text-green-700 w-5 h-5" />
                      <CardTitle className="text-lg">Insight Benih</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">Pengetahuan tentang berbagai varietas benih dan teknik penyemaian.</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Varietas unggul</li>
                      <li>Teknik penyemaian</li>
                      <li>Keuntungan varietas tertentu</li>
                      <li>Rekomendasi berdasarkan lokasi/iklim</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-orange-700">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Shovel className="text-orange-700 w-5 h-5" />
                      <CardTitle className="text-lg">Insight Peralatan</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">Pengetahuan tentang peralatan pertanian dan penggunaannya yang efektif.</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Jenis alat dan fungsi utamanya</li>
                      <li>Cara penggunaan optimal</li>
                      <li>Pemeliharaan peralatan</li>
                      <li>Perbandingan spesifikasi</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Isu Teknis & Solusi</CardTitle>
              <CardDescription>
                Masalah teknis terkini dan langkah-langkah untuk menyelesaikannya
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-red-500 w-5 h-5" />
                    <CardTitle className="text-lg">Masalah Update Produk</CardTitle>
                  </div>
                </CardHeader>
              </Card>
              
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-orange-500 w-5 h-5" />
                    <CardTitle className="text-lg">Masalah Upload Gambar</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Tidak dapat menambahkan gambar produk saat membuat produk baru atau mengupdate produk.</p>
                  
                  <h4 className="font-semibold mb-2">Masalah Detail:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                    <li>Tombol upload tidak ada saat menambahkan produk baru</li>
                    <li>Error saat mengupload gambar pada halaman edit produk</li>
                    <li>Kemungkinan masalah konfigurasi storage bucket Supabase</li>
                  </ul>
                  
                  <h4 className="font-semibold mb-2">Solusi yang Direkomendasikan:</h4>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Periksa konfigurasi bucket penyimpanan di Supabase</li>
                    <li>Verifikasi komponen upload dapat menerima file dengan benar</li>
                    <li>Perbaiki fungsi penanganan image upload</li>
                    <li>Implementasikan alur dua langkah (simpan produk, kemudian tambahkan gambar)</li>
                  </ol>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Langkah Selanjutnya</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      <p className="font-semibold">Prioritaskan penyelesaian masalah admin dashboard</p>
                      <p className="text-sm">Perbaiki masalah keyword/keywords dan upload gambar untuk mengaktifkan CRUD lengkap untuk produk.</p>
                    </li>
                    <li>
                      <p className="font-semibold">Selesaikan implementasi Insight Pertanian</p>
                      <p className="text-sm">Populasikan dengan konten pertanian yang informatif dan terstruktur dengan baik berdasarkan kategori produk.</p>
                    </li>
                    <li>
                      <p className="font-semibold">Lanjutkan ke pengembangan sisi klien</p>
                      <p className="text-sm">Setelah fungsionalitas admin dashboard berfungsi penuh, pindah ke implementasi landing page, halaman produk, dan keranjang belanja.</p>
                    </li>
                  </ol>
                  
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => window.location.href = '/admin/content'}>
                      Buka Manajemen Konten
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
