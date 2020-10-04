/* eslint-disable max-lines-per-function */
import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import Header from 'components/header';
import SongsTable from 'components/songs-table';
import selectors from 'selectors';

import { setState } from 'actions/general';
import { getSongList, setCurrentSong } from 'actions/library';

import BandcampSvg from 'assets/images/artist/Single-Artist_BC.svg';
import SpotifySvg from 'assets/images/artist/Single-Artist_SP.svg';
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

    const songList = useSelector(selectors.library.getAll);
    const filtersPanelState = useSelector(selectors.general.get('filtersOpened'));
    const presetsPanelState = useSelector(selectors.general.get('presetsOpened'));

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
            api.get(`/api/artist/${artistName}`).then((res) => {
                setArtist(res.artist);
                if (res.artist.featuredTracks) {
                    api.get(`/api/artist-featured/${res.artist.featuredTracks}`).then((resp) => {
                        setFeaturedTracks(resp.songs);
                    });
                }
            });
        }
    }, [artistName]);

    useEffect(() => {
        if (songList && artist) {
            const artistSongs = songList.filter((s) => s.artistName.toLowerCase() === artist.name.toLowerCase());
            artistSongs.length && setAllArtistTracks(artistSongs);
            if (!featuredTracks && artistSongs.length) {
                setFeaturedTracks(
                    artistSongs
                        .sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate))
                        .reverse()
                        .slice(0, 6)
                );
            }
        }
    }, [songList, artist]);

    const playSong = (song) => {
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
                                    <div className="artist__pb">PB Project</div>
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
                                        <a href={artist.spotify} target="_blank" rel="noopener noreferrer">
                                            <SpotifySvg />
                                        </a>
                                    </div>
                                    <div className="artist__bio">{artist.bio}</div>
                                </div>
                            </div>
                            <div className="artist__info desktop-hide">
                                <div className="artist__pb">PB Project</div>
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
                        {featuredTracks && (
                            <div className="artist__section">
                                <div className="artist__table">
                                    <div className="artist__table__title">Featured Tracks</div>
                                    <SongsTable list={featuredTracks} onSelect={(val) => playSong(val)} page="home" />
                                </div>
                            </div>
                        )}
                        <div className="artist__section">
                            <div className="artist__table__title">You May Also Like</div>
                            <div className="artist__similar">
                                {artist.relatedArtists.map((related, index) => (
                                    <Link
                                        className="artist__similar__single__url"
                                        key={index}
                                        to={`/project/${related.name.toLowerCase().split(' ').join('-')}`}
                                    >
                                        <span
                                            className="artist__similar__single"
                                            style={{ backgroundImage: `url(${related.image})` }}
                                        >
                                            <div>
                                                <div className="artist__similar__overlay" />
                                                {related.name}
                                            </div>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {allArtistTracks && (
                            <div className="artist__section">
                                <div className="artist__table">
                                    <div className="artist__table__title">Full PB Songography</div>
                                    <SongsTable list={allArtistTracks} onSelect={(val) => playSong(val)} page="home" />
                                </div>
                            </div>
                        )}
                    </main>
                )}
            </div>
        </>
    );
}

ArtistPage.displayName = 'ArtistPage';

export default ArtistPage;
