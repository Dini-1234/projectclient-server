import React, { useState } from 'react';

const Search = (props) => {

    return (
        <>
      {/* <label className="searchText" htmlFor="search">Search</label> */}
            <input
                type="text"
                placeholder="search..."
                value={props.search}
                onChange={(e) => props.setSearch(e.target.value)}
                style={{ padding: '5px', marginBottom: '10px' }}
            />
        </>
    );
};

export default Search;