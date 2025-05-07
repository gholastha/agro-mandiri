import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav 
      className={cn(
        'flex items-center space-x-1.5 text-sm text-muted-foreground py-2', 
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1.5 flex-wrap">
        {/* Home icon (always present) */}
        <li className="flex items-center">
          <Link
            href="/admin"
            className="flex items-center hover:text-foreground transition-colors bg-secondary/30 px-2 py-1 rounded-md"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        
        {/* Chevron after home */}
        <li className="flex items-center">
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        </li>
        
        {/* Breadcrumb items */}
        {items.map((item, index) => (
          <React.Fragment key={item.href}>
            <li className="flex items-center">
              {item.isCurrent ? (
                <span 
                  className="font-medium text-foreground px-2.5 py-1 bg-primary/10 rounded-md" 
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors px-2 py-1 hover:bg-secondary/30 rounded-md"
                >
                  {item.label}
                </Link>
              )}
            </li>
            
            {/* Add chevron between items (but not after the last item) */}
            {index < items.length - 1 && (
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
