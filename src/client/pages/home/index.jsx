import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import classnames from 'classnames';
import { PRESETS } from 'utils/constants';

import Preset from 'components/preset';
import SongsTable from 'components/songs-table';
import MusicPlayer from 'components/music-player';

import { getSongList, setCurrentSong } from 'actions/library';
import { setFilter } from 'actions/filters';
import { setState } from 'actions/general';

import qs from 'query-string';

import './style.scss';

/**
 * Component to handle the home page
 * @returns {React.Component}
 */
function HomePage() {
    const [tablePlaylist, setTablePlaylist] = useState([]);
    const dispatch = useDispatch();
    const sharedItem = qs.parse(location.search);

    const filtersPanelState = useSelector(selectors.general.get('filtersOpened'));
    const presetsPanelState = useSelector(selectors.general.get('presetsOpened'));
    const musicPlayerState = useSelector(selectors.general.get('musicPlayerOpened'));

    const songList = useSelector(selectors.library.getAll);
    const featuredTracks = useSelector(selectors.library.getFeaturedTracks);

    const filtersValues = useSelector(selectors.filters.getApplied);

    useEffect(() => {
        !songList && dispatch(getSongList());
    }, []);

    useEffect(() => {
        if (sharedItem.ids && songList) {
            const pbIds = sharedItem.ids.split(',');
            setTablePlaylist(songList.filter(x => pbIds.includes(x.pbId)));
        }
    }, [songList]);

    useEffect(() => {
        if (!sharedItem.ids) {
            setTablePlaylist(_filterSongs(songList, filtersValues));
        }
    }, [filtersValues]);

    const homeClass = useMemo(
        () =>
            classnames('app-container', {
                'app-container--pushed': filtersPanelState || presetsPanelState,
            }),
        [filtersPanelState, presetsPanelState]
    );

    const applyPreset = filters => {
        Object.keys(filters).forEach(filter => {
            dispatch(setFilter(filter, filters[filter]));
        });
    };

    const playSong = song => {
        dispatch(setCurrentSong(song));
        dispatch(setState('musicPlayerOpened', true));
    };

    return (
        <div className={homeClass}>
            <main className="home">
                {tablePlaylist && tablePlaylist.length > 0 ? (
                    <SongsTable list={tablePlaylist} onSelect={val => playSong(val)} listName={sharedItem.name} />
                ) : (
                    <>
                        <div className="hero">
                            <div className="hero__overlay">
                                <div className="hero__feature">
                                    <img className="hero__image" src="/assets/images/feature-filters.png" />
                                    <div className="hero__name">Filters</div>
                                </div>
                                <div className="hero__feature">
                                    <img className="hero__image" src="/assets/images/feature-presets.png" />
                                    <div className="hero__name">Presets</div>
                                </div>
                                <div className="hero__feature">
                                    <img className="hero__image" src="/assets/images/feature-suggestion.png" />
                                    <div className="hero__name">Suggestions</div>
                                </div>
                            </div>
                        </div>
                        <div className="popular-presets">
                            <div className="popular-presets__title">Popular Search Presets</div>
                            <div className="popular-presets__presets">
                                {Object.keys(PRESETS)
                                    .slice(0, 8)
                                    .map((preset, index) => (
                                        <div key={index} onClick={() => applyPreset(PRESETS[preset].filters)}>
                                            <Preset name={preset} width={253} height={105} />
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="featured">
                            <div className="popular-presets__title">Featured Tracks</div>
                            <SongsTable
                                list={featuredTracks}
                                onSelect={val => playSong(val)}
                                listName={sharedItem.name}
                                page="home"
                            />
                        </div>
                    </>
                )}
            </main>
            {musicPlayerState && <MusicPlayer />}
        </div>
    );
}

HomePage.displayName = 'HomePage';

export default HomePage;

const _filterSongs = (songs, filters) => {
    if (Object.keys(filters).length > 0) {
        return songs
            .filter(song => {
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
                if (filters.flow && filters.flow.includes(song.arc.toLowerCase())) {
                    similar += 1;
                }
                if (filters.search) {
                    filters.search.map(filter => {
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
