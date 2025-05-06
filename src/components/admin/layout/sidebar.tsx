'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  FolderTree, 
  ShoppingCart,
  Users,
  FileText,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuthContext } from '@/context/auth-context';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Produk',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Kategori',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    title: 'Pesanan',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Pelanggan',
    href: '/admin/customers',
    icon: Users,
  },
  {
    title: 'Konten',
    href: '/admin/content',
    icon: FileText,
  },
  {
    title: 'Pengaturan',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuthContext();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex h-full w-64 flex-col bg-background border-r">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">Agro Mandiri</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-secondary/70 hover:text-secondary-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-destructive/50 hover:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </div>
  );
}
