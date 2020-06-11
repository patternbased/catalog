/* eslint-disable max-lines-per-function */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';

import Header from 'components/header';
import SongsTable from 'components/songs-table';

import { setCurrentSong } from 'actions/library';
import { setState } from 'actions/general';

/**
 * Component to handle the album page
 * @param {Object} props router props
 * @returns {React.Component}
 */
function AlbumPage(props) {
    const albumId = props.match.params.id;
    let albumName = props.match.params.name;
    const [albumList, setAlbumList] = useState([]);
    const dispatch = useDispatch();

    const songList = useSelector(selectors.library.getAll);

    useEffect(() => {
        let songs = [];
        songs = songList.filter((song) => song.albumId === albumId);
        setAlbumList(songs);
    }, [albumId]);

    const playSong = (song) => {
        dispatch(setCurrentSong(song));
        dispatch(setState('songPlaying', true));
    };

    return (
        <>
            <Header />
            <main className="home">
                <SongsTable list={albumList} onSelect={(val) => playSong(val)} listName={albumName} />
            </main>
        </>
    );
}

AlbumPage.displayName = 'AlbumPage';

export default AlbumPage;
