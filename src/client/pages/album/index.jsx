/* eslint-disable max-lines-per-function */
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import uuid from 'react-uuid';
import { event } from 'react-ga';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Helmet } from 'react-helmet';
import selectors from 'selectors';

import Header from 'components/header';
import SongsTable from 'components/songs-table';
import Modal from 'components/modal';

import { setCurrentSong, addToQueue } from 'actions/library';
import { setState } from 'actions/general';

import ShareIcon from 'assets/images/share-icon-dark.svg';
import CopyLinkSvg from 'assets/images/copy-link.svg';
import DoneSvg from 'assets/images/done-check.svg';
import PlaySvg from 'assets/images/single-song/Single-Song_Play.svg';
import PauseSvg from 'assets/images/Single-Song_Pause.svg';
import BandcampSvg from 'assets/images/single-song/Single-Song_Bandcamp.svg';
import SpotifySvg from 'assets/images/single-song/Single-Song_Spotify.svg';
import AppleSvg from 'assets/images/single-song/Single-Song_Apple.svg';
import ITunesSvg from 'assets/images/single-song/Single-Song_iTunes.svg';
import SoundCloudSvg from 'assets/images/single-song/Single-Song_SoundCloud.svg';
import GooglePlaySvg from 'assets/images/single-song/Single-Song_GooglePlay.svg';
import VimeoSvg from 'assets/images/single-song/Single-Song_Vimeo.svg';
import AddToQueueSvg from 'assets/images/add-to-queue.svg';
import PlayAll from 'assets/images/PlayResultBtn.svg';

import { api } from '../../services';

import './style.scss';

const baseUrl =
    process.env.NODE_ENV === 'production' ? 'https://catalog.patternbased.com' : 'https://patternbased.herokuapp.com';

/**
 * Component to handle the album page
 * @param {Object} props router props
 * @returns {React.Component}
 */
function AlbumPage(props) {
    const albumId = props.match.params.id;
    let albumName = props.match.params.name;
    const [albumList, setAlbumList] = useState([]);
    const [albumRestList, setAlbumRestList] = useState([]);
    const [album, setAlbum] = useState(null);
    const [shareItem, setShareItem] = useState();
    const [shareOpened, setShareOpened] = useState(false);
    const [shareAlbumLinkCopied, setShareAlbumLinkCopied] = useState(false);
    const [coverHover, setCoverHover] = useState(false);
    const [artistInfo, setArtistInfo] = useState(null);
    const [fullAlbum, setFullAlbum] = useState([]);
    const dispatch = useDispatch();

    const songList = useSelector(selectors.library.getAll);
    const filtersPanelState = useSelector(selectors.general.get('filtersOpened'));
    const presetsPanelState = useSelector(selectors.general.get('presetsOpened'));
    const songIsPlaying = useSelector(selectors.general.get('songPlaying'));

    useEffect(() => {
        let songs = [];
        songs = songList.filter((song) => song.albumId === albumId);
        if (songs.length > 0) {
            songs = songs.sort((a, b) => parseFloat(a.sequence) - parseFloat(b.sequence));
        }
        setFullAlbum(songs);
        setAlbumList(songs.slice(0, 5));
        setAlbumRestList(songs.slice(6));
        if (!album) {
            api.get(`/api/album/${albumName}`).then((res) => {
                setAlbum(res.album);
            });
        }
    }, [albumId]);

    useEffect(() => {
        if (album && !artistInfo) {
            api.get(`/api/artist/${album.artistName.toLowerCase().split(' ').join('-')}`).then((res) => {
                setArtistInfo(res.artist);
            });
        }
    }, [album]);

    const albumClass = useMemo(
        () =>
            classnames('app-container', {
                'app-container--pushed': filtersPanelState || presetsPanelState,
            }),
        [filtersPanelState, presetsPanelState]
    );

    const openShareModal = () => {
        setShareItem(album);
        setShareOpened(true);
    };

    const shareAlbumId = uuid();

    const copyShareAlbumLink = () => {
        setShareAlbumLinkCopied(true);
        event({
            category: 'Album page',
            action: 'Single album share',
            label: `Share ${shareItem.title}`,
        });
    };

    const playSong = (val) => {
        dispatch(setCurrentSong(val));
        addToQueue(dispatch, val);
        dispatch(setState('songPlaying', !songIsPlaying));
        event({
            category: 'Album page',
            action: 'Play song clicked',
            label: `Play ${val.title}`,
        });
    };

    const addListToQueue = () => {
        dispatch(setCurrentSong(fullAlbum[0]));
        dispatch(setState('songPlaying', true));
        addToQueue(dispatch, { list: fullAlbum, name: album.title });
    };

    return (
        <>
            <Header />
            <div className={albumClass}>
                {album && (
                    <main className="album">
                        <div className="album__section">
                            <div className="album__column">
                                <span className="desktop-hide">
                                    <div className="album__column__row-header">
                                        <div className="album__column__row-header__overlay" />
                                        ALBUM
                                    </div>
                                    <div className="album__title">{album.title}</div>
                                    <Link to={`/project/${album.artistName.toLowerCase().split(' ').join('-')}`}>
                                        <div className="album__artist">by {album.artistName}</div>
                                    </Link>
                                    <div className="album__actions">
                                        <PlayAll className="album__actions__icon" onClick={() => addListToQueue()} />
                                        <AddToQueueSvg
                                            onClick={() => {
                                                addToQueue(dispatch, {
                                                    list: albumList.concat(albumRestList),
                                                    name: album.title,
                                                });
                                                event({
                                                    category: 'Album page',
                                                    action: 'Add to Queue clicked',
                                                    label: `Add to queue ${album.title}`,
                                                });
                                            }}
                                            className="smaller-action"
                                        />
                                        <ShareIcon onClick={() => openShareModal()} />
                                    </div>
                                </span>
                                <div
                                    className="album__cover"
                                    onMouseEnter={() => setCoverHover(true)}
                                    onMouseLeave={() => setCoverHover(false)}
                                >
                                    {coverHover && (
                                        <div className="album__cover__overlay" onClick={() => playSong(albumList[0])}>
                                            {!songIsPlaying ? <PlaySvg /> : <PauseSvg />}
                                        </div>
                                    )}

                                    <img src={album.cover} alt={`${album.title} by ${album.artistName}`} />
                                </div>
                            </div>
                            <div className="album__column">
                                <span className="mobile-hide">
                                    <div className="album__column__row-header">
                                        <div className="album__column__row-header__overlay" />
                                        ALBUM
                                    </div>
                                    <div className="album__title">{album.title}</div>
                                    <Link to={`/project/${album.artistName.toLowerCase().split(' ').join('-')}`}>
                                        <div className="album__artist">by {album.artistName}</div>
                                    </Link>
                                    <div className="album__actions">
                                        <PlayAll className="album__actions__icon" onClick={() => addListToQueue()} />
                                        <AddToQueueSvg
                                            onClick={() => {
                                                addToQueue(dispatch, {
                                                    list: albumList.concat(albumRestList),
                                                    name: album.title,
                                                });
                                                event({
                                                    category: 'Album page',
                                                    action: 'Add to Queue clicked',
                                                    label: `Add to Queue ${album.title}`,
                                                });
                                            }}
                                            className="smaller-action"
                                        />
                                        <ShareIcon onClick={() => openShareModal()} />
                                    </div>
                                </span>
                                <div className="album__description">{album.description}</div>
                                <div className="album__attributes">
                                    <div className="album__attributes__single">
                                        <div className="album__attributes__key">Year</div>
                                        <div className="album__attributes__value">{album.year}</div>
                                    </div>
                                    <div className="album__attributes__single">
                                        <div className="album__attributes__key">Track Count</div>
                                        <div className="album__attributes__value">{album.tracks}</div>
                                    </div>
                                    <div className="album__attributes__single">
                                        <div className="album__attributes__key">Album ID</div>
                                        <div className="album__attributes__value">{album.pbId}</div>
                                    </div>
                                    {album.upcCode && album.upcCode.length > 0 && (
                                        <div className="album__attributes__single">
                                            <div className="album__attributes__key">UPC Code</div>
                                            <div className="album__attributes__value">{album.upcCode}</div>
                                        </div>
                                    )}
                                </div>
                                <div className="album__media">
                                    <BandcampSvg className="album__media__bandcamp" />
                                    <SpotifySvg className="album__media__spotify" />
                                    <AppleSvg className="album__media__apple" />
                                    <ITunesSvg className="album__media__itunes" />
                                    <SoundCloudSvg className="album__media__soundcloud" />
                                    <GooglePlaySvg className="album__media__google" />
                                    <VimeoSvg className="album__media__vimeo" />
                                </div>
                                <span className="">
                                    {album.coverArt && album.coverArt.length > 0 && (
                                        <>
                                            <div className="album__column__row-header">
                                                <div className="album__column__row-header__overlay" />
                                                Cover Art
                                            </div>
                                            <div className="album__column__row-content">
                                                {album.coverArt.map((art, index) => (
                                                    <a key={index} href={art.url}>
                                                        <div className="album__column__writer">
                                                            <img src={album.cover} alt={art.name} />
                                                            {art.name}
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                        {albumList && (
                            <div className="song__section">
                                <div className="song__table">
                                    <SongsTable list={albumList} onSelect={(val) => playSong(val)} page="home" />
                                </div>
                            </div>
                        )}
                        {artistInfo && (
                            <div className="song__section song__section--banner">
                                <div className="song__banner">
                                    <img src={artistInfo.image} alt={artistInfo.imageAlt} />
                                    <div>
                                        <div className="song__banner__artist">{artistInfo.name}</div>
                                        <div className="song__banner__description">{artistInfo.bio}</div>
                                        <Link to={`/project/${album.artistName.toLowerCase().split(' ').join('-')}`}>
                                            <div className="song__banner__button">MORE FROM THIS ARTIST</div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                        {albumRestList && (
                            <div className="song__section">
                                <div className="song__table">
                                    <SongsTable list={albumRestList} onSelect={(val) => playSong(val)} page="home" />
                                </div>
                            </div>
                        )}
                    </main>
                )}
                {shareOpened && (
                    <Modal opened={shareOpened} modifier="share queue-share">
                        <img
                            src="/assets/images/close-icon.png"
                            onClick={() => setShareOpened(false)}
                            className="share__close"
                        />
                        <div className="share__header">Share This Album</div>
                        <div className="share__item">
                            <img src={shareItem.cover} />
                            <div>
                                <div className="share__item__title">{shareItem.title}</div>
                                <div className="share__item__artist">by {shareItem.artistName}</div>
                            </div>
                        </div>
                        <CopyToClipboard
                            text={`${baseUrl}/album/${shareItem.title.toLowerCase().split(' ').join('-')}/${
                                shareItem.pbId
                            }`}
                            onCopy={() => copyShareAlbumLink()}
                        >
                            {shareAlbumLinkCopied ? (
                                <div className="share__button share__button--copied">
                                    <DoneSvg />
                                    Copied to clipboard!
                                </div>
                            ) : (
                                <div className="share__button">
                                    <CopyLinkSvg />
                                    Copy Share Link
                                </div>
                            )}
                        </CopyToClipboard>
                    </Modal>
                )}
                {album && (
                    <Helmet>
                        <meta property="og:title" content={album.title} />
                        <meta property="og:description" content={`by ${album.artistName}`} />
                        <meta property="og:image" content={album.cover} />
                        <meta
                            property="og:url"
                            content={`${baseUrl}/album/${album.title.toLowerCase().split(' ').join('-')}/${album.pbId}`}
                        />
                        <meta name="twitter:card" content="summary_large_image" />
                    </Helmet>
                )}
            </div>
        </>
    );
}

AlbumPage.displayName = 'AlbumPage';

export default AlbumPage;
