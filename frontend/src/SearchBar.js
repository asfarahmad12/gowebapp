import React from 'react';
import './SearchBar.css'; // Import CSS for the SearchBar

const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <input 
      type="text"
      placeholder="Search..."
      className="search-box"
      value={searchQuery}
      onChange={onSearchChange} // Ensure onChange handler is correctly passed
    />
  );
}

export default SearchBar;