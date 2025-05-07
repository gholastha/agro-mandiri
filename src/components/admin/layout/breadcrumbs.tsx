import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

// Map of path segments to more readable names
const pathNames: Record<string, string> = {
  'admin': 'Dashboard',
  'products': 'Produk',
  'categories': 'Kategori',
  'orders': 'Pesanan',
  'customers': 'Pelanggan',
  'settings': 'Pengaturan',
  'content': 'Konten',
  'new': 'Tambah Baru',
  'edit': 'Edit',
  'view': 'Detail',
  'dashboard': 'Dashboard',
};

// We can add icon mapping in the future if needed
// For now, we use a simpler approach with just text

interface PageBreadcrumbsProps {
  overrideItems?: BreadcrumbItem[];
  currentPageLabel?: string;
  className?: string;
}

export function PageBreadcrumbs({ overrideItems, currentPageLabel, className }: PageBreadcrumbsProps) {
  const pathname = usePathname();
  
  // If override items are provided, use those instead of generating from the path
  if (overrideItems) {
    return <Breadcrumb items={overrideItems} className="mb-4" />;
  }
  
  // Generate breadcrumb items from the current path
  const pathSegments = pathname.split('/').filter(segment => segment);
  
  const breadcrumbItems: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    // Build the href for this breadcrumb item
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    
    // Determine if this is the current (last) item
    const isCurrent = index === pathSegments.length - 1;
    
    // For the current page, use the provided label if available
    const label = isCurrent && currentPageLabel 
      ? currentPageLabel 
      : pathNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    return {
      label,
      href,
      isCurrent,
    };
  });
  
  // If we're on a page with an ID (like /admin/products/abc123), extract the ID
  // and make it a shorter representation in the breadcrumb
  if (breadcrumbItems.length > 0) {
    const lastItem = breadcrumbItems[breadcrumbItems.length - 1];
    const parts = lastItem.href.split('/');
    const lastPart = parts[parts.length - 1];
    
    // If the last part looks like an ID (long string), make it shorter
    if (lastPart.length > 8 && !pathNames[lastPart]) {
      breadcrumbItems[breadcrumbItems.length - 1] = {
        ...lastItem,
        label: lastItem.label === lastPart ? `ID: ${lastPart.substring(0, 6)}...` : lastItem.label
      };
    }
  }
  
  return <Breadcrumb items={breadcrumbItems} className={cn("mb-4", className)} />;
}
