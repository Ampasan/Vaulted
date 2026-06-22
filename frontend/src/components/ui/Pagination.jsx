import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const getPageNumbers = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  return [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems = 0,
  className = '',
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cx(
        'flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-[#dcd9ce]',
        className
      )}
    >
      <p className="text-[11px] font-mono tracking-[0.15em] uppercase text-gray-500">
        Page {currentPage} of {totalPages}
        {totalItems > 0 && (
          <span className="text-gray-400 ml-2">({totalItems} items)</span>
        )}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="gap-1 px-4"
        >
          <ChevronLeft size={14} strokeWidth={2} />
          Prev
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            const prevPage = pages[index - 1];
            const showEllipsis = prevPage && page - prevPage > 1;

            return (
              <span key={page} className="flex items-center gap-1">
                {showEllipsis && (
                  <span className="px-2 text-[11px] font-mono text-gray-400">...</span>
                )}
                <button
                  type="button"
                  onClick={() => onPageChange(page)}
                  aria-current={page === currentPage ? 'page' : undefined}
                  className={cx(
                    'min-w-[36px] h-9 px-2 text-[11px] font-bold tracking-[0.15em] uppercase transition-colors',
                    page === currentPage
                      ? 'bg-black text-white'
                      : 'text-gray-500 hover:text-black hover:bg-cream-light'
                  )}
                >
                  {page}
                </button>
              </span>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="gap-1 px-4"
        >
          Next
          <ChevronRight size={14} strokeWidth={2} />
        </Button>
      </div>
    </nav>
  );
};

export default Pagination;
