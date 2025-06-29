import React, { FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <nav className={`flex justify-center ${className}`} aria-label="Pagination">
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
            currentPage === 1
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="flex items-center justify-center w-10 h-10 text-gray-500">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
                  currentPage === page
                    ? 'border-purple-500 bg-purple-500 text-white'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
            currentPage === totalPages
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }`}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;