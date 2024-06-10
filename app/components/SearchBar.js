// components/SearchBar.js
import { useState } from 'react';
import { TextField } from '@mui/material';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <TextField
      label="Search Messages"
      fullWidth
      margin="normal"
      value={query}
      onChange={handleChange}
    />
  );
};

export default SearchBar;
