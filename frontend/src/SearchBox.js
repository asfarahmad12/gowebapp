// SearchBox.js
import React, { useState } from 'react';

const SearchBox = ({ items, onFilter }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onFilter(value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBox;