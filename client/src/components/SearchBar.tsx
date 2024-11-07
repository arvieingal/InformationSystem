import React from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <div className='w-full px-4'>
    <input
      type="text"
      placeholder="Search ......."
      className="w-[98%] border border-[#CCCCCC] rounded-md focus:outline-none py-[8px] px-4"
      onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar; 