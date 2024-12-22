import React, { useState } from 'react';

const Search = (props) => {
      const [search, setSearch] = useState('');
    
    return(
    <>
        <label htmlFor="search">חפש</label>
        <input
            type="text"
            placeholder="search..."
            value={props.search}
            onChange={(e) => props.setSearch(e.target.value)} // עדכון בזמן חיפוש
            style={{ padding: '5px', marginBottom: '10px' }}
        />
    </>
    )
};

export default Search;