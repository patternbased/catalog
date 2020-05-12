/* eslint-disable max-lines-per-function */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import selectors from 'selectors';
import classnames from 'classnames';
import { PRESETS } from 'utils/constants';

import Header from 'components/header';
import Preset from 'components/preset';
import SongsTable from 'components/songs-table';

import { getSongList, setCurrentSong, setCurrentQueue, setCurrentPlaylist } from 'actions/library';
import { setFilter } from 'actions/filters';
import { setState } from 'actions/general';

import qs from 'query-string';
import { api } from '../../services';

import './style.scss';

/**
 * Component to handle the home page
 * @returns {React.Component}
 */
function HomePage({ history }) {
    const [tablePlaylist, setTablePlaylist] = useState([]);
    const [popularPresets, setPopularPresets] = useState(null);
    const dispatch = useDispatch();
    const sharedItem = qs.parse(location.search);

    const filtersPanelState = useSelector(selectors.general.get('filtersOpened'));
    const presetsPanelState = useSelector(selectors.general.get('presetsOpened'));
    const reqSuggestionsOpened = useSelector(selectors.general.get('reqSuggestionsOpened'));

    const songList = useSelector(selectors.library.getAll);
    const [featuredTracks, setFeaturedTracks] = useState([]);

    const filtersValues = useSelector(selectors.filters.getApplied);

    useEffect(() => {
        !songList && dispatch(getSongList());
        if (!popularPresets) {
            api.get('/api/popular-presets').then((res) => {
                if (res.presets) {
                    const popular = [];
                    res.presets.map((preset) => {
                        popular.push({ name: preset.name, details: PRESETS[preset.name] });
                    });
                    setPopularPresets(window.innerWidth < 1025 ? popular.slice(0, 6) : popular);
                }
            });
        }
    }, []);

    useEffect(() => {
        if (sharedItem.shareId && songList) {
            api.get(`/api/shared-list/${sharedItem.shareId}`).then((res) => {
                const shared = res.shared[0];
                const sharedSongs = songList.filter((s) => shared.songs.includes(s.pbId));
                switch (shared.type) {
                    case 'queue':
                        dispatch(setCurrentQueue(sharedSongs));
                        dispatch(setState('queueOpened', true));
                        break;
                    case 'search':
                        Object.keys(shared.filters).forEach((filter) => {
                            dispatch(setFilter(filter, shared.filters[filter]));
                        });
                        break;
                    case 'similar':
                        Object.keys(shared.filters).forEach((filter) => {
                            dispatch(setFilter(filter, shared.filters[filter]));
                        });
                        break;
                    case 'song':
                        history.push(
                            `/song/${sharedSongs[0].pbId}-${sharedSongs[0].title.toLowerCase().split(' ').join('-')}`
                        );
                        break;
                    default:
                        break;
                }
            });
        }
        if (songList) {
            setFeaturedTracks(
                songList
                    .sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate))
                    .reverse()
                    .slice(0, 10)
            );
        }
    }, [songList]);

    useEffect(() => {
        if (!sharedItem.ids && songList) {
            const filtered = _filterSongs(songList, filtersValues);
            setTablePlaylist(filtered);
            dispatch(setCurrentPlaylist(filtered));
        }
    }, [filtersValues, songList]);

    const homeClass = useMemo(
        () =>
            classnames('app-container', {
                'app-container--pushed': filtersPanelState || presetsPanelState,
            }),
        [filtersPanelState, presetsPanelState]
    );

    const applyPreset = (filters, name) => {
        Object.keys(filters).forEach((filter) => {
            dispatch(setFilter(filter, filters[filter]));
        });
        fetch('/api/increment-preset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ preset: name }),
        });
        dispatch(setState('filtersOpened', true));
    };

    const playSong = (song) => {
        dispatch(setCurrentSong(song));
        dispatch(setState('songPlaying', true));
    };

    return (
        <>
            <Header />
            <div className={homeClass}>
                <main className="home">
                    {tablePlaylist && tablePlaylist.length >= 10 ? (
                        <SongsTable list={tablePlaylist} onSelect={(val) => playSong(val)} listName={sharedItem.name} />
                    ) : tablePlaylist && tablePlaylist.length > 0 && tablePlaylist.length < 10 ? (
                        <>
                            <SongsTable
                                list={tablePlaylist}
                                onSelect={(val) => playSong(val)}
                                listName={sharedItem.name}
                                short={true}
                                extraClass="table-short"
                            />
                            {popularPresets && (
                                <div className="popular-presets">
                                    <div className="popular-presets__title">Popular Search Presets</div>
                                    <div className="popular-presets__presets">
                                        {popularPresets.map((preset, index) => (
                                            <div
                                                key={index}
                                                onClick={() => applyPreset(preset.details.filters, preset.name)}
                                            >
                                                <Preset name={preset.name} width={253} height={105} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="short-search">
                                <div className="short-search__overlay">
                                    <div className="short-search__overlay__content">
                                        <div className="short-search__content">
                                            Tell us about your project and let us find you the perfect music.
                                        </div>
                                        <div
                                            className="short-search__feature short-search__feature--linked"
                                            onClick={() =>
                                                dispatch(setState('reqSuggestionsOpened', !reqSuggestionsOpened))
                                            }
                                        >
                                            <img
                                                className="short-search__image"
                                                src="/assets/images/feature-suggestion.png"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="featured">
                                <div className="popular-presets__title">Featured Tracks</div>
                                <SongsTable
                                    list={featuredTracks}
                                    onSelect={(val) => playSong(val)}
                                    listName={sharedItem.name}
                                    page="home"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="hero">
                                <div className="hero__overlay">
                                    <div
                                        className="hero__feature hero__feature--linked"
                                        onClick={() => dispatch(setState('filtersOpened', !filtersPanelState))}
                                    >
                                        <img className="hero__image" src="/assets/images/feature-filters.png" />
                                        <div className="hero__name">Filters</div>
                                    </div>
                                    <div
                                        className="hero__feature hero__feature--linked"
                                        onClick={() => dispatch(setState('presetsOpened', !presetsPanelState))}
                                    >
                                        <img className="hero__image" src="/assets/images/feature-presets.png" />
                                        <div className="hero__name">Presets</div>
                                    </div>
                                    <div
                                        className="hero__feature hero__feature--linked"
                                        onClick={() =>
                                            dispatch(setState('reqSuggestionsOpened', !reqSuggestionsOpened))
                                        }
                                    >
                                        <img className="hero__image" src="/assets/images/feature-suggestion.png" />
                                        <div className="hero__name">Suggestions</div>
                                    </div>
                                </div>
                            </div>
                            {popularPresets && (
                                <div className="popular-presets">
                                    <div className="popular-presets__title">Popular Search Presets</div>
                                    <div className="popular-presets__presets">
                                        {popularPresets.map((preset, index) => (
                                            <div
                                                key={index}
                                                onClick={() => applyPreset(preset.details.filters, preset.name)}
                                            >
                                                <Preset name={preset.name} width={253} height={105} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="featured">
                                <div className="popular-presets__title">Featured Tracks</div>
                                <SongsTable
                                    list={featuredTracks}
                                    onSelect={(val) => playSong(val)}
                                    listName={sharedItem.name}
                                    page="home"
                                />
                            </div>
                        </>
                    )}
                </main>
            </div>
        </>
    );
}

HomePage.displayName = 'HomePage';

export default withRouter(HomePage);

const _filterSongs = (songs, filters) => {
    if (Object.keys(filters).length > 0) {
        return songs
            .filter((song) => {
                let similar = 0;
                if (_isInRange(song.experimental, filters.experimental)) {
                    similar += 1;
                }
                if (_isInRange(song.grid, filters.grid)) {
                    similar += 1;
                }
                if (_isInRange(song.mood, filters.mood)) {
                    similar += 1;
                }
                if (_isInRange(song.rhythm, filters.rhythm)) {
                    similar += 1;
                }
                if (_isInRange(song.speed, filters.speed)) {
                    similar += 1;
                }
                if (filters.flow) {
                    filters.flow.map((f) => {
                        const filterValue = f.toLowerCase();
                        if (filterValue === song.arc.toLowerCase()) {
                            similar += 1;
                        }
                    });
                }
                if (filters.instruments) {
                    filters.instruments.map((filter) => {
                        const filterVal = filter.replace(/\s/g, '').toLowerCase();
                        const songInstr = song.instruments.filter(
                            (s) => s.replace(/\s/g, '').toLowerCase() === filterVal
                        );
                        if (songInstr.length > 0) {
                            similar += 1;
                        }
                    });
                }
                if (filters.duration) {
                    const durations = song.length.split(':');
                    if (parseInt(durations[0]) > 0) {
                        durations.splice(1, 1);
                    } else {
                        durations.shift();
                    }
                    const songDuration = parseFloat(durations.join('.'));
                    if (_isInRange(songDuration, filters.duration)) {
                        similar += 1;
                    }
                }
                if (filters.search) {
                    filters.search.map((filter) => {
                        const filterVal = filter.value.toLowerCase();
                        switch (filter.type) {
                            case 'song':
                                if (song.title.toLowerCase().includes(filterVal)) {
                                    similar += 1;
                                }
                                break;
                            case 'artist':
                                if (song.artistName.toLowerCase().includes(filterVal)) {
                                    similar += 1;
                                }
                                break;
                            case 'keyword':
                                if (
                                    song.title.toLowerCase().includes(filterVal) ||
                                    song.description.toLowerCase().includes(filterVal)
                                ) {
                                    similar += 1;
                                }
                                break;
                            default:
                                break;
                        }
                    });
                }
                return similar === Object.keys(filters).length;
            })
            .sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate))
            .reverse();
    } else {
        return [];
    }
};

const _isInRange = (value, range) => {
    if (range) {
        return value >= range[0] && value <= range[1];
    }
    return false;
};
