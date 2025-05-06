import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 p-8">
      <div className="flex flex-col items-center justify-center text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Agro Mandiri</h1>
          <p className="text-xl text-muted-foreground">
            Portal Pertanian Indonesia
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/admin">
            <Button size="lg">
              Dashboard Admin
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Login
            </Button>
          </Link>
        </div>

        <div className="text-sm text-muted-foreground max-w-xl">
          <p>
            Platform e-commerce untuk produk pertanian dengan kategori: pupuk, pestisida, benih, dan peralatan pertanian.
            Untuk petani Indonesia yang modern.
          </p>
        </div>
      </div>
    </div>
  );
}
