import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

/**
 * Search Bar component
 * @param {Array} listItems array of objects of type { type: inst./artist/song, value: dataName }
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

    const selectFromList = (result) => {
        onSelect(result);
        setSearchTerm('');
    };

    return (
        <div className="search">
            <input
                className="search-input"
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                autoFocus
            />

            {searchResults.length > 0 && (
                <>
                    <ul className="search__results">
                        {searchResults.map((result, index) => (
                            <li key={index} className="search__results-item" onClick={() => selectFromList(result)}>
                                {result.type === 'keyword' ? (
                                    <img className="search__results-item--new" src="/assets/images/search.png" />
                                ) : (
                                    <span className="search__results-item--type">{result.type}</span>
                                )}
                                <span dangerouslySetInnerHTML={{ __html: result.displayValue }}></span>
                            </li>
                        ))}
                    </ul>
                    <div className="search__results__overlay" />
                </>
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
    items.forEach((item) => {
        if (item.value.toLowerCase().includes(lowerCaseTerm)) {
            let copy = { ...item };
            const index = item.value.toLowerCase().indexOf(lowerCaseTerm);
            const result = `${item.value.substr(0, index)}<b>${item.value.substr(
                index,
                searchTerm.length
            )}</b>${item.value.substr(index + searchTerm.length)}`;
            copy.displayValue = result;
            copy.value = item.value;
            results.push(copy);
        }
    });

    results.push({ type: 'keyword', displayValue: searchTerm, value: searchTerm });

    return results;
};

export default memo(SearchBar);
