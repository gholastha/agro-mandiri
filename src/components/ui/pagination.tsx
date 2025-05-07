import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  ...props
}: PaginationProps) {
  // Create page numbers for pagination
  const generatePagination = () => {
    // Always include first and last page
    const firstPage = 1;
    const lastPage = totalPages;
    
    // Calculate range of visible pages
    const leftSiblingIndex = Math.max(currentPage - siblingCount, firstPage);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, lastPage);
    
    // Include dots if necessary
    const shouldShowLeftDots = leftSiblingIndex > firstPage + 1;
    const shouldShowRightDots = rightSiblingIndex < lastPage - 1;
    
    // Generate the array of page numbers to show
    const pages: (number | string)[] = [];
    
    // Always include first page
    pages.push(firstPage);
    
    // Add left dots if needed
    if (shouldShowLeftDots) {
      pages.push("left-dots");
    }
    
    // Add range of pages around current page
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== firstPage && i !== lastPage) {
        pages.push(i);
      }
    }
    
    // Add right dots if needed
    if (shouldShowRightDots) {
      pages.push("right-dots");
    }
    
    // Always include last page
    if (lastPage !== firstPage) {
      pages.push(lastPage);
    }
    
    return pages;
  };

  const pages = generatePagination();

  return (
    <nav 
      className={cn("flex justify-center", className)}
      aria-label="Pagination"
      {...props}
    >
      <div className="flex items-center space-x-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-1.5">
          {pages.map((page, i) => {
            if (typeof page === "string") {
              return (
                <Button
                  key={`${page}-${i}`}
                  variant="ghost"
                  size="icon"
                  disabled
                  className="px-4"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page)}
                aria-current={currentPage === page ? "page" : undefined}
                className="px-4"
              >
                {page}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}

// Summary text that shows info about pagination
export function PaginationSummary({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  className,
}: {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  className?: string;
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  return (
    <div className={cn("text-sm text-muted-foreground", className)}>
      Menampilkan {startItem}-{endItem} dari {totalItems} produk
      {totalPages > 1 && ` (Halaman ${currentPage} dari ${totalPages})`}
    </div>
  );
}
