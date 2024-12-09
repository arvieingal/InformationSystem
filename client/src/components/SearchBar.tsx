import React from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onSearch(query);
  };

  return (
    <div className='w-full flex items-center justify-center'>
      <input
        type="text"
        placeholder="Search ......."
        className="w-full border border-[#CCCCCC] rounded-md focus:outline-none py-[8px] px-4"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar; 