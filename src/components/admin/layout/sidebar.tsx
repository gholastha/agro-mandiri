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
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuthContext();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className={cn(
      "flex h-full flex-col bg-background border-r transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          {isCollapsed ? (
            <span className="text-xl">AM</span>
          ) : (
            <span className="text-xl">Agro Mandiri</span>
          )}
        </Link>
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {menuItems.map((item, index) => {
            // Special check for Dashboard item to avoid it being active for all admin pages
            const isDashboard = item.href === '/admin';
            
            // If it's the dashboard, it's only active when the path is exactly '/admin'
            // For other items, we use the normal check (exact match or child paths)
            const isActive = isDashboard
              ? pathname === '/admin'
              : pathname === item.href || pathname?.startsWith(`${item.href}/`);
            
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
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-destructive/50 hover:text-destructive-foreground"
          title={isCollapsed ? "Keluar" : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Keluar</span>}
        </button>
      </div>
    </div>
  );
}
