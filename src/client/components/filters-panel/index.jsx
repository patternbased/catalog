/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import selectors from 'selectors';

import BasicFilter from 'components/filters/basic';
import FlowFilter from 'components/filters/flow';
import InstrumentsFilter from 'components/filters/instruments';
import Button from 'components/button';
import Preset from 'components/preset';
import SearchBar from 'components/search-bar';

import { setFilter, resetFilter, resetAllFilters } from 'actions/filters';
import { clearQueue } from 'actions/library';
import { BASIC_FILTERS, PRESETS, ARTISTS, SONGS, INSTRUMENTS } from 'utils/constants';

import './style.scss';

const generateSearchResults = () => {
    let allResults = [];
    ARTISTS.forEach(artist => {
        allResults.push({ type: 'artist', value: artist });
    });
    SONGS.forEach(song => {
        allResults.push({ type: 'song', value: song });
    });
    INSTRUMENTS.forEach(instrument => {
        allResults.push({ type: 'instrument', value: instrument });
    });
    return allResults;
};

/**
 * Filters panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @param {Boolean} showSearch boolean to determine if search input is opened/closed
 * @returns {React.Component}
 */
function FiltersPanel({ visible, style, showSearch }) {
    const [similarPresets, setSimilarPresets] = useState([]);
    const [selectedSearch, setSelectedSearch] = useState([]);

    const panelClass = useMemo(
        () =>
            classnames('filters-panel', {
                'filters-panel--visible': visible,
            }),
        [visible]
    );

    const dispatch = useDispatch();
    const defaultFilters = useSelector(selectors.filters.getDefault);
    const appliedFilters = useSelector(selectors.filters.getApplied);

    const wereFiltersChanged = useMemo(() => Object.keys(appliedFilters).length > 0, [appliedFilters]);

    const changeSlider = useCallback(
        name => values => {
            dispatch(setFilter(name, values));
        },
        [appliedFilters]
    );

    const toggleFlow = useCallback(
        shape => {
            const flowsCopy = appliedFilters['flow'] ? [...appliedFilters['flow']] : [];
            if (flowsCopy.includes(shape)) {
                dispatch(
                    setFilter(
                        'flow',
                        flowsCopy.filter(x => x !== shape)
                    )
                );
            } else {
                dispatch(setFilter('flow', flowsCopy.concat(shape)));
            }
        },
        [appliedFilters]
    );

    const selectInstrument = useCallback(
        instrument => {
            const instrumentsCopy = appliedFilters['instruments'] ? [...appliedFilters['instruments']] : [];
            dispatch(setFilter('instruments', instrumentsCopy.concat(instrument)));
        },
        [appliedFilters]
    );

    const removeInstrument = useCallback(
        instrument => {
            const instrumentsCopy = appliedFilters['instruments'] ? [...appliedFilters['instruments']] : [];
            dispatch(
                setFilter(
                    'instruments',
                    instrumentsCopy.filter(x => x !== instrument)
                )
            );
        },
        [appliedFilters]
    );

    const cancelFilter = useCallback(
        name => {
            dispatch(resetFilter(name));
        },
        [appliedFilters]
    );

    const applyPreset = filters => {
        Object.keys(filters).forEach(filter => {
            dispatch(setFilter(filter, filters[filter]));
        });
    };

    useEffect(() => {
        if (wereFiltersChanged) {
            const allPresets = Object.keys(PRESETS).map(preset => {
                return {
                    name: preset,
                    filters: PRESETS[preset].filters,
                    similarity: 0,
                };
            });
            const similar = _getSimilarPresets(allPresets, appliedFilters);
            setSimilarPresets(similar);
        }
    }, [appliedFilters]);

    const searchList = useMemo(() => generateSearchResults(), []);

    const selectResult = item => {
        if (item.type === 'instrument') {
            const instrumentsCopy = [...appliedFilters['instruments']];
            dispatch(setFilter('instruments', instrumentsCopy.concat(item.value)));
        } else {
            const selectedSearchCopy = [...selectedSearch];
            setSelectedSearch(selectedSearchCopy.concat(item));
            dispatch(setFilter('search', selectedSearchCopy.concat(item)));
        }
    };

    const onCancelSelected = value => {
        const selectedSearchCopy = [...selectedSearch];
        setSelectedSearch(selectedSearchCopy.filter(x => x.value !== value));
        dispatch(
            setFilter(
                'search',
                selectedSearchCopy.filter(x => x.value !== value)
            )
        );
    };

    return (
        <div>
            <div className={panelClass} style={style}>
                <div className="filters-panel__container">
                    {showSearch && (
                        <div className="filters-panel__search">
                            <SearchBar onSelect={val => selectResult(val)} listItems={searchList} />
                            {appliedFilters.search && (
                                <div className="filters-panel__search__selected">
                                    {appliedFilters.search.map((item, index) => (
                                        <div className="filters-panel__search__selected-item" key={index}>
                                            <div className="filters-panel__search__selected-item-wrapper">
                                                {item.type === 'keyword' ? (
                                                    <img
                                                        className="filters-panel__search__selected-item-new"
                                                        src="/assets/images/search-tag.png"
                                                    />
                                                ) : (
                                                    <span className="filters-panel__search__selected-item-type">
                                                        {item.type}
                                                    </span>
                                                )}
                                                <p className="filters-panel__search__selected-item-name">
                                                    {item.value}
                                                </p>
                                            </div>
                                            <img
                                                className="filters-panel__search__selected-item-close"
                                                src="/assets/images/close.png"
                                                onClick={() => onCancelSelected(item.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <div className="filters-panel__filters">
                        {BASIC_FILTERS.map((filter, index) => (
                            <div key={index}>
                                <BasicFilter
                                    name={filter}
                                    isOpened={filter === 'duration' ? false : true}
                                    values={appliedFilters[filter] || defaultFilters[filter]}
                                    onRangeChange={changeSlider(filter)}
                                    onFilterCancel={() => cancelFilter(filter)}
                                />
                            </div>
                        ))}
                        <FlowFilter
                            values={appliedFilters['flow'] || defaultFilters['flow']}
                            onToggleFlow={toggleFlow}
                            onFilterCancel={() => cancelFilter('flow')}
                        />
                        <InstrumentsFilter
                            values={appliedFilters['instruments'] || defaultFilters['instruments']}
                            onSelectInstrument={selectInstrument}
                            onCancelInstrument={removeInstrument}
                            onFilterCancel={() => cancelFilter('instruments')}
                        />
                        {wereFiltersChanged && (
                            <div className="filters-panel__button">
                                <Button
                                    onClick={() => {
                                        dispatch(resetAllFilters());
                                        setSimilarPresets([]);
                                        dispatch(clearQueue());
                                    }}
                                >
                                    Clear All
                                </Button>
                            </div>
                        )}
                    </div>
                    {similarPresets.length > 0 && (
                        <div className="filters-panel__presets">
                            <p className="filters-panel__presets-title">Similar presets</p>
                            {similarPresets.map((preset, index) => (
                                <div key={index} onClick={() => applyPreset(preset.filters)}>
                                    <Preset name={preset.name} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const _getSimilarPresets = (presets, filters) => {
    const similarPresets = [];
    presets.forEach(preset => {
        const pFilter = preset.filters;
        let similarCount = 0;
        Object.keys(pFilter).forEach(filterName => {
            if (filters[filterName]) {
                if (
                    pFilter[filterName][0] === filters[filterName][0] &&
                    pFilter[filterName][1] === filters[filterName][1]
                ) {
                    similarCount += 1;
                }
            }
        });
        if (similarCount >= 1) {
            preset.similarity = similarCount;
            similarPresets.push(preset);
        }
    });
    return similarPresets.sort((a, b) => a.similarity - b.similarity).splice(0, 4);
};

FiltersPanel.displayName = 'FiltersPanel';

FiltersPanel.propTypes = {
    visible: PropTypes.bool,
    style: PropTypes.object,
    showSearch: PropTypes.bool,
};

FiltersPanel.defaultProps = {
    visible: false,
    style: {},
    showSearch: false,
};

export default memo(FiltersPanel);
