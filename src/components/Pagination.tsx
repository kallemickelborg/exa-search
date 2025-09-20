import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({ currentPage, hasNextPage, onPageChange, disabled = false }: PaginationProps) {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    // Always show first page
    if (currentPage > 1) {
      pages.push(1);
    }

    // Add dots if there's a gap
    if (currentPage > 3) {
      pages.push('...');
    }

    // Add pages around current page
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(currentPage + 1, currentPage + (hasNextPage ? 1 : 0));

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Add next page if it exists and isn't already included
    if (hasNextPage && !pages.includes(currentPage + 1)) {
      pages.push(currentPage + 1);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={disabled || currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages.map((page, index) => (
        <Button
          key={index}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={disabled || typeof page !== 'number'}
          className="h-8 min-w-8 px-2"
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || !hasNextPage}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
