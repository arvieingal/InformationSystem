import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className='h-full pt-4'>
      <div className="flex justify-center">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-4 py-2 border rounded-md bg-[#007F73] text-white "
        >
          Previous
        </button>
        <span className="px-4 py-2 ">{currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-4 py-2 border rounded-md bg-[#007F73] text-white w-[7rem]"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination; 