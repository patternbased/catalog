/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import ReactGA from 'react-ga';
import isEqual from 'lodash/isEqual';

import BasicFilter from 'components/filters/basic';
import FlowFilter from 'components/filters/flow';
import DurationFilter from 'components/filters/duration';
import Button from 'components/button';
import Preset from 'components/preset';
import SearchBar from 'components/search-bar';

import { setFilter, resetFilter, resetAllFilters } from 'actions/filters';
import { setState } from 'actions/general';
import { addToQueue, setCurrentSong } from 'actions/library';
import { BASIC_FILTERS, PRESETS, INSTRUMENTS } from 'utils/constants';

import { api } from '../../services';

import './style.scss';

const generateSearchResults = (songList, artists, writers) => {
    let allResults = [];
    if (artists) {
        artists.forEach((artist) => {
            allResults.push({ type: 'project', value: artist.name });
        });
    }
    if (writers) {
        writers.forEach((writer) => {
            allResults.push({ type: 'artist', value: writer.name });
        });
    }
    if (songList) {
        songList.forEach((song) => {
            allResults.push({ type: 'song', value: song.title, id: song.pbId });
        });
    }
    INSTRUMENTS.forEach((instrument) => {
        allResults.push({ type: 'inst.', value: instrument });
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
function FiltersPanel({ visible, style, showSearch, onSearchSelected }) {
    const [similarPresets, setSimilarPresets] = useState([]);
    const [selectedSearch, setSelectedSearch] = useState([]);
    const [artists, setArtists] = useState([]);
    const [writers, setWriters] = useState([]);

    const panelClass = useMemo(
        () =>
            classnames('filters-panel', {
                'filters-panel--visible': visible,
                'filters-panel--searched': showSearch,
            }),
        [visible, showSearch]
    );

    useEffect(() => {
        api.get('/api/all-artists').then((res) => {
            if (res.artists) {
                setArtists(res.artists);
            }
        });
        api.get('/api/all-writers').then((res) => {
            if (res.writers) {
                setWriters(res.writers);
            }
        });
    }, []);

    const dispatch = useDispatch();
    const defaultFilters = useSelector(selectors.filters.getDefault);
    const appliedFilters = useSelector(selectors.filters.getApplied);
    const songList = useSelector(selectors.library.getAll);
    const playlist = useSelector(selectors.library.getCurrentPlaylist);

    const wereFiltersChanged = useMemo(() => Object.keys(appliedFilters).length > 0, [appliedFilters]);

    const [changedFilters, setChangedFilters] = useState(appliedFilters);

    useEffect(() => {
        if (!isEqual(changedFilters, appliedFilters)) {
            setChangedFilters(appliedFilters);
        }
    }, [appliedFilters]);

    const changeSlider = (name) => (values) => {
        const copyFilters = { ...changedFilters };
        copyFilters[name] = values;
        setChangedFilters(copyFilters);
    };

    const applyFilters = (name) => {
        dispatch(setFilter(name, changedFilters[name]));
        ReactGA.event({
            category: 'Filters panel',
            action: 'Filter used',
            label: `Filter ${name}`,
        });
    };

    const toggleFlow = useCallback(
        (shape) => {
            const flowsCopy = appliedFilters['flow'] ? [...appliedFilters['flow']] : [];
            if (flowsCopy.includes(shape)) {
                dispatch(
                    setFilter(
                        'flow',
                        flowsCopy.filter((x) => x !== shape)
                    )
                );
                ReactGA.event({
                    category: 'Filters panel',
                    action: 'Clear filter',
                    label: `Filter Flow ${shape}`,
                });
            } else {
                dispatch(setFilter('flow', flowsCopy.concat(shape)));
                ReactGA.event({
                    category: 'Filters panel',
                    action: 'Filter used',
                    label: `Filter Flow ${shape}`,
                });
            }
        },
        [appliedFilters]
    );

    const toggleDuration = useCallback(
        (shape) => {
            const durationCopy = appliedFilters['duration'] ? [...appliedFilters['duration']] : [];
            if (durationCopy.includes(shape)) {
                dispatch(
                    setFilter(
                        'duration',
                        durationCopy.filter((x) => x !== shape)
                    )
                );
                ReactGA.event({
                    category: 'Filters panel',
                    action: 'Clear filter',
                    label: `Filter Duration ${shape}`,
                });
            } else {
                durationCopy.push(shape);
                dispatch(setFilter('duration', durationCopy));
                ReactGA.event({
                    category: 'Filters panel',
                    action: 'Filter used',
                    label: `Filter Duration ${shape}`,
                });
            }
        },
        [appliedFilters]
    );

    const cancelFilter = useCallback(
        (name) => {
            const copyFilters = { ...changedFilters };
            copyFilters[name] = defaultFilters[name];
            setChangedFilters(copyFilters);
            dispatch(resetFilter(name));
            ReactGA.event({
                category: 'Filters panel',
                action: 'Clear filter',
                label: `Filter ${name}`,
            });
        },
        [appliedFilters]
    );

    const applyPreset = (filters, name) => {
        Object.keys(filters).forEach((filter) => {
            dispatch(setFilter(filter, filters[filter]));
        });
        ReactGA.event({
            category: 'Filters panel',
            action: 'Similar Preset clicked',
            label: `Preset ${name}`,
        });
    };

    useEffect(() => {
        if (wereFiltersChanged) {
            const allPresets = Object.keys(PRESETS).map((preset) => {
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

    const searchList = useMemo(() => generateSearchResults(songList, artists, writers), [songList, artists, writers]);

    const selectResult = (item) => {
        if (item.type === 'song') {
            window.location = `/song/${item.id}-${item.value.toLowerCase().split(' ').join('-')}`;
            ReactGA.event({
                category: 'Search',
                action: 'Search suggestion selected',
                label: `Selected song ${item.value}`,
            });
        } else {
            const selectedSearchCopy = [...selectedSearch];
            setSelectedSearch(selectedSearchCopy.concat(item));
            dispatch(setFilter('search', selectedSearchCopy.concat(item)));
            if (item.type === 'inst.') {
                ReactGA.event({
                    category: 'Search',
                    action: 'Search suggestion selected',
                    label: `Selected Instrument ${item.value}`,
                });
            } else {
                ReactGA.event({
                    category: 'Search',
                    action: 'Search suggestion selected',
                    label: `Selected suggestion ${item.type} - ${item.value}`,
                });
            }
        }
        onSearchSelected();
    };

    const onCancelSelected = (value) => {
        let selectedSearchCopy = [...selectedSearch];
        selectedSearchCopy = selectedSearchCopy.filter((x) => x.value !== value);
        setSelectedSearch(selectedSearchCopy);
        if (selectedSearchCopy.length === 0) {
            dispatch(resetFilter('search'));
        } else {
            dispatch(setFilter('search', selectedSearchCopy));
        }
        ReactGA.event({
            category: 'Search',
            action: 'Clear search',
            label: `Clear search ${value}`,
        });
    };

    const addListToQueue = () => {
        dispatch(setState('songPlaying', true));
        dispatch(setCurrentSong(playlist[0]));
        dispatch(addToQueue({ list: playlist, name: createPlaylistName() }));
    };

    const createPlaylistName = () => {
        let label = '';
        if (appliedFilters) {
            Object.keys(appliedFilters).map((filter) => {
                switch (filter) {
                    case 'rhythm':
                        label += '<strong>RTM</strong>';
                        break;
                    case 'speed':
                        label += '<strong>SPD</strong>';
                        break;
                    case 'experimental':
                        label += '<strong>EXP</strong>';
                        break;
                    case 'mood':
                        label += '<strong>MOD</strong>';
                        break;
                    case 'grid':
                        label += '<strong>GRD</strong>';
                        break;
                    case 'duration':
                        label += '<strong>DUR</strong>';
                        break;
                    default:
                        break;
                }
                label += ` ${appliedFilters[filter][0]}-${appliedFilters[filter][1]}, `;
            });
        }
        return label;
    };

    return (
        <div>
            <div className={panelClass} style={style}>
                <div className="filters-panel__container">
                    <div className="filters-panel__search">
                        {showSearch && <SearchBar onSelect={(val) => selectResult(val)} listItems={searchList} />}
                        {wereFiltersChanged && playlist && (
                            <div className="desktop-hide">
                                <div className="filters-panel__results">
                                    <div>
                                        <img
                                            src="/assets/images/table/results-play.png"
                                            className="table__filters__icon"
                                            onClick={() => addListToQueue()}
                                        />

                                        <div className="filters-panel__results__tracks">
                                            <span>{playlist.length}</span> Tracks
                                        </div>
                                    </div>
                                    <Button
                                        width={60}
                                        height={32}
                                        onClick={() => {
                                            setChangedFilters({});
                                            dispatch(resetAllFilters());
                                            setSimilarPresets([]);
                                            ReactGA.event({
                                                category: 'Filter panel',
                                                action: 'Clear filters',
                                                label: 'Mobile Clear all',
                                            });
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        )}
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
                                            <p className="filters-panel__search__selected-item-name">{item.value}</p>
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

                    <div className="filters-panel__filters">
                        {BASIC_FILTERS.map((filter, index) => (
                            <div key={index}>
                                <BasicFilter
                                    name={filter}
                                    isOpened={true}
                                    values={changedFilters[filter] || defaultFilters[filter]}
                                    onRangeChange={changeSlider(filter)}
                                    onRangeApply={() => applyFilters(filter)}
                                    onFilterCancel={() => cancelFilter(filter)}
                                />
                            </div>
                        ))}
                        <FlowFilter
                            values={appliedFilters['flow'] || defaultFilters['flow']}
                            onToggleFlow={toggleFlow}
                            onFilterCancel={() => cancelFilter('flow')}
                        />
                        <DurationFilter
                            values={appliedFilters['duration'] || defaultFilters['duration']}
                            onToggleDuration={toggleDuration}
                            onFilterCancel={() => cancelFilter('duration')}
                        />
                        {wereFiltersChanged && (
                            <div className="filters-panel__button">
                                <Button
                                    onClick={() => {
                                        setChangedFilters({});
                                        dispatch(resetAllFilters());
                                        setSimilarPresets([]);
                                        ReactGA.event({
                                            category: 'Filter panel',
                                            action: 'Clear filters',
                                            label: 'Clear all',
                                        });
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
                                <div key={index} onClick={() => applyPreset(preset.filters, preset.name)}>
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
    presets.forEach((preset) => {
        const pFilter = preset.filters;
        let similarCount = 0;
        Object.keys(pFilter).forEach((filterName) => {
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
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    style: PropTypes.object,
    showSearch: PropTypes.bool,
    onSearchSelected: PropTypes.func,
};

FiltersPanel.defaultProps = {
    visible: false,
    style: {},
    showSearch: false,
    onSearchSelected: () => {},
};

export default memo(FiltersPanel);
