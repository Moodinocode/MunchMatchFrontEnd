import { useState } from 'react';

export default function SlidingPagination({ 
  currentPage = 1, 
  totalPages = 20, 
  onPageChange 
}) {
  
  // Calculate the window of 4 pages to show
  const getPageWindow = () => {
    let start = Math.max(1, currentPage - 1);
    let end = start + 3;
    
    // If we're near the end, adjust the window
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - 3);
    }
    
    // If we're at the beginning, make sure we show 4 pages if possible
    if (start === 1 && totalPages >= 4) {
      end = Math.min(4, totalPages);
    }
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };
  
  const visiblePages = getPageWindow();
  
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  const handlePageClick = (page) => {
    onPageChange(page);
  };
  
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div className="join">
        <button 
          className="join-item btn btn-square" 
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          ←
        </button>
        
        {visiblePages.map(page => (
          <input
            key={page}
            className="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label={page.toString()}
            checked={currentPage === page}
            onChange={() => handlePageClick(page)}
          />
        ))}
        
        <button 
          className="join-item btn btn-square" 
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          →
        </button>
      </div>
      
      <div className="text-sm text-gray-600">
        Current page: {currentPage} / {totalPages}
      </div>
    </div>
  );
}