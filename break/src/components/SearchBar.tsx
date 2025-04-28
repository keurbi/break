import React from 'react';
import { Bell } from 'lucide-react';

const SearchBar: React.FC = () => {
  return (
    <div className="w-full p-4 flex items-center">
      <input
        type="text"
        placeholder="Rechercher..."
        className="flex-grow p-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary h-12 text-[#7346FF] font-bold text-lg"
      />
      <button className="ml-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 focus:outline-none">
        <Bell color="#7346FF" className="w-6 h-6" /> 
      </button>
    </div>
  );
};

export default SearchBar;
