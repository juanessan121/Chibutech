import React from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <div className="search-bar">
      <Search className="search-icon" size={20} />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder || 'Buscar...'}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
