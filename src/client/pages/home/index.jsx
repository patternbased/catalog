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
    const dispatch = useDispatch();
    const songList = useSelector(selectors.library.getAll);

    useEffect(() => {
        !songList && dispatch(getSongList());
    }, []);

    return (
        <main className="home">
            {songList && <SongsTable list={songList} />}
            {selectedSong !== null && <MusicPlayer song={selectedSong} />}
        </main>
    );
}

HomePage.displayName = 'HomePage';

export default HomePage;
