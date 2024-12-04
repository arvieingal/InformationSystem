import React from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    console.log("SearchBar input:", query);
    onSearch(query);
  };

  return (
    <div className='w-full'>
      <input
        type="text"
        placeholder="Search ......."
        className="w-[98%] border border-[#CCCCCC] rounded-md focus:outline-none py-[8px] px-4"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar; 