import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';

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
    const filtersValues = useSelector(selectors.filters.getAll);

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
        setSelectedSongIndex(selectedSongIndex + 1);
        setSelectedSong(filteredSongs[selectedSongIndex]);
        setNextSong(filteredSongs[selectedSongIndex + 1]);
    };

    const goToPrevSong = () => {
        setSelectedSongIndex(selectedSongIndex - 1);
        setSelectedSong(filteredSongs[selectedSongIndex]);
        setNextSong(filteredSongs[selectedSongIndex + 1]);
    };

    return (
        <>
            <main className="home">
                {filteredSongs.length > 0 && <SongsTable list={filteredSongs} onSelect={val => selectSong(val)} />}
            </main>
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
        if (filters.flow.includes(song.arc.toLowerCase())) {
            similar += 1;
        }
        return similar > 0;
    });
};

const _isInRange = (value, range) => {
    if (value > 0 && range[0] === 0 && (![10, 20].includes(value) && [10, 20].includes(range[1]))) {
        return false;
    }
    return value >= range[0] && value <= range[1];
};
