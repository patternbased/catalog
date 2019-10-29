import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import classnames from 'classnames';

import MusicPlayer from 'components/music-player';
import { getSongList } from 'actions/library';
import SongsTable from 'components/songs-table';

import './style.scss';

/**
 * Component to handle the home page
 * @returns {React.Component}
 */
function HomePage() {
    const [selectedSong, setSelectedSong] = useState(null);
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [selectedSongIndex, setSelectedSongIndex] = useState(null);
    const [nextSong, setNextSong] = useState(null);
    const dispatch = useDispatch();
    const songList = useSelector(selectors.library.getAll);
    const filtersValues = useSelector(selectors.filters.getApplied);
    const filtersPanelState = useSelector(selectors.general.get('filtersOpened'));
    const presetsPanelState = useSelector(selectors.general.get('presetsOpened'));

    useEffect(() => {
        !songList && dispatch(getSongList());
    }, []);

    useEffect(() => {
        songList && setFilteredSongs(_filterSongs(songList, filtersValues));
    }, [filtersValues]);

    const selectSong = song => {
        setSelectedSongIndex(filteredSongs.indexOf(song));
        setSelectedSong(song);
        setNextSong(filteredSongs[selectedSongIndex + 1]);
    };

    const goToNextSong = () => {
        const sel = selectedSongIndex;
        setSelectedSongIndex(sel + 1);
        setSelectedSong(filteredSongs[sel + 1]);
        setNextSong(filteredSongs[sel + 2]);
    };

    const goToPrevSong = () => {
        const sel = selectedSongIndex;
        setSelectedSongIndex(sel - 1);
        setSelectedSong(filteredSongs[sel - 1]);
        setNextSong(filteredSongs[sel - 2]);
    };

    const homeClass = useMemo(
        () =>
            classnames('app-container', {
                'app-container--pushed': filtersPanelState || presetsPanelState,
            }),
        [filtersPanelState, presetsPanelState]
    );

    return (
        <>
            <div className={homeClass}>
                <main className="home">
                    {filteredSongs.length > 0 && (
                        <SongsTable
                            list={filteredSongs}
                            onSelect={val => selectSong(val)}
                            currentSongIndex={selectedSongIndex}
                        />
                    )}
                </main>
            </div>
            {selectedSong !== null && (
                <MusicPlayer
                    song={selectedSong}
                    onNext={() => goToNextSong()}
                    onPrev={() => goToPrevSong()}
                    nextSong={nextSong}
                />
            )}
        </>
    );
}

HomePage.displayName = 'HomePage';

export default HomePage;

const _filterSongs = (songs, filters) => {
    return songs.filter(song => {
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
        if (_isInRange(song.speed, filters.duration)) {
            similar += 1;
        }
        if (filters.flow && filters.flow.includes(song.arc.toLowerCase())) {
            similar += 1;
        }
        return similar === Object.keys(filters).length;
    });
};

const _isInRange = (value, range) => {
    if (range) {
        if (value > 0 && range[0] === 0 && (![10, 20].includes(value) && [10, 20].includes(range[1]))) {
            return false;
        }
        return value >= range[0] && value <= range[1];
    }
    return false;
};
