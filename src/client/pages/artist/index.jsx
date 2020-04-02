/* eslint-disable max-lines-per-function */
import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import Header from 'components/header';
import SongsTable from 'components/songs-table';
import MusicPlayer from 'components/music-player';
import selectors from 'selectors';

import { setState } from 'actions/general';
import { getSongList, setCurrentSong } from 'actions/library';

import BandcampSvg from 'assets/images/artist/Single-Artist_BC.svg';
import FacebookSvg from 'assets/images/artist/Single-Artist_FB.svg';
import InstagramSvg from 'assets/images/artist/Single-Artist_IG.svg';
import SoundCloudSvg from 'assets/images/artist/Single-Artist_SC.svg';
import WebsiteSvg from 'assets/images/artist/Single-Artist_ws.svg';

import { api } from '../../services';

import './style.scss';

/**
 * Component to handle the single song page
 * @param {Object} props router props
 * @returns {React.Component}
 */
function ArtistPage(props) {
    const artistName = props.match.params.name;
    const dispatch = useDispatch();
    const [artist, setArtist] = useState(null);
    const [featuredTracks, setFeaturedTracks] = useState(null);
    const [allArtistTracks, setAllArtistTracks] = useState(null);
    const [songClicked, setSongClicked] = useState(false);

    const songList = useSelector(selectors.library.getAll);
    const filtersPanelState = useSelector(selectors.general.get('filtersOpened'));
    const presetsPanelState = useSelector(selectors.general.get('presetsOpened'));
    const currentSong = useSelector(selectors.library.getCurrentSong);

    const artistClass = useMemo(
        () =>
            classnames('app-container', {
                'app-container--pushed': filtersPanelState || presetsPanelState,
            }),
        [filtersPanelState, presetsPanelState]
    );

    useEffect(() => {
        !songList && dispatch(getSongList());
    }, []);

    useEffect(() => {
        if (artistName) {
            dispatch(setState('filtersOpened', false));

            api.get(`/api/artist/${artistName}`).then(res => {
                setArtist(res.artist);
            });
        }
    }, [artistName]);

    useEffect(() => {
        if (songList && artist) {
            const artistSongs = songList.filter(s => s.artistName.toLowerCase() === artist.name.toLowerCase());
            artistSongs.length && setAllArtistTracks(artistSongs);
            artistSongs.length &&
                setFeaturedTracks(
                    artistSongs
                        .sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate))
                        .reverse()
                        .slice(0, 6)
                );
        }
    }, [songList, artist]);

    const playSong = song => {
        dispatch(setCurrentSong(song));
        setSongClicked(true);
    };

    return (
        <>
            <Header />
            <div className={artistClass}>
                {artist && (
                    <main className="artist">
                        <div className="artist__section">
                            <div className="artist__banner" style={{ backgroundImage: `url('${artist.image}')` }}>
                                <div className="artist__info">
                                    <div className="artist__pb">PB Artist</div>
                                    <div className="artist__name">{artist.name}</div>
                                    <div className="artist__social">
                                        <a href={artist.website} target="_blank" rel="noopener noreferrer">
                                            <WebsiteSvg />
                                        </a>
                                        <a href={artist.bandcamp} target="_blank" rel="noopener noreferrer">
                                            <BandcampSvg />
                                        </a>
                                        <a href={artist.soundcloud} target="_blank" rel="noopener noreferrer">
                                            <SoundCloudSvg />
                                        </a>
                                        <a href={artist.instagram} target="_blank" rel="noopener noreferrer">
                                            <InstagramSvg />
                                        </a>
                                        <a href={artist.facebook} target="_blank" rel="noopener noreferrer">
                                            <FacebookSvg />
                                        </a>
                                    </div>
                                    <div className="artist__bio">{artist.bio}</div>
                                </div>
                            </div>
                        </div>
                        {featuredTracks && (
                            <div className="artist__section">
                                <div className="artist__table">
                                    <div className="artist__table__title">Featured Tracks</div>
                                    <SongsTable list={featuredTracks} onSelect={val => playSong(val)} page="home" />
                                </div>
                            </div>
                        )}
                        <div className="artist__section">
                            <div className="artist__table__title">You May Also Like</div>
                            <div className="artist__similar">
                                <div className="artist__similar__single">
                                    <div className="artist__similar__overlay" />
                                    Hill Sleepers
                                </div>
                                <div className="artist__similar__single">
                                    <div className="artist__similar__overlay" />
                                    Joseph Minadeo
                                </div>
                                <div className="artist__similar__single">
                                    <div className="artist__similar__overlay" />
                                    Insect Sounds
                                </div>
                                <div className="artist__similar__single">
                                    <div className="artist__similar__overlay" />
                                    Puffy Shapes
                                </div>
                            </div>
                        </div>
                        {allArtistTracks && (
                            <div className="artist__section">
                                <div className="artist__table">
                                    <div className="artist__table__title">Full Songography</div>
                                    <SongsTable list={allArtistTracks} onSelect={val => playSong(val)} page="home" />
                                </div>
                            </div>
                        )}
                    </main>
                )}
                {songClicked && currentSong && <MusicPlayer />}
            </div>
        </>
    );
}

ArtistPage.displayName = 'ArtistPage';

export default ArtistPage;