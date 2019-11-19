import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

/**
 * Search Bar component
 * @param {Array} listItems array of objects of type { type: instruments/artist/song, value: dataName }
 * @param {Function} onChange action to call when typing in input
 * @returns {React.Component}
 */
function SearchBar({ listItems, onSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (searchTerm !== '') {
            setSearchResults(_findMatches(listItems, searchTerm));
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const selectFromList = result => {
        onSelect(result);
        setSearchTerm('');
    };

    return (
        <div className="search">
            <input
                className="search-input"
                type="text"
                onChange={e => setSearchTerm(e.target.value)}
                value={searchTerm}
                autoFocus
            />

            {searchResults.length > 0 && (
                <ul className="search__results">
                    {searchResults.map((result, index) => (
                        <li key={index} className="search__results-item" onClick={() => selectFromList(result)}>
                            {result.type === 'keyword' ? (
                                <img className="search__results-item--new" src="/assets/images/search.png" />
                            ) : (
                                <span className="search__results-item--type">{result.type}</span>
                            )}
                            {result.value}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

SearchBar.displayName = 'SearchBar';

SearchBar.propTypes = {
    listItems: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
};

const _findMatches = (items, searchTerm) => {
    const results = [];
    const lowerCaseTerm = searchTerm.toLowerCase();
    items.forEach(item => {
        if (item.value.toLowerCase().includes(lowerCaseTerm)) {
            results.push(item);
        }
    });
    if (results.length === 0) {
        results.push({ type: 'keyword', value: searchTerm });
    }
    return results;
};

export default memo(SearchBar);
