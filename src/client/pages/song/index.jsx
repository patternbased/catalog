/* eslint-disable max-lines-per-function */
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import uuid from 'react-uuid';
import selectors from 'selectors';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classnames from 'classnames';
import Button from 'components/button';
import SongsTable from 'components/songs-table';
import SimilarSongsPanel from 'components/similar-songs';
import Modal from 'components/modal';
import Header from 'components/header';
import Tooltip from 'components/filters/tooltip';

import { setState } from 'actions/general';
import { getSongList, setCurrentSong, setCustomWorkSong, setLicenseSong, addToQueue } from 'actions/library';
import { setFilter } from 'actions/filters';

import { TABLE_FLOW_SHAPES, FILTERS_DESCRIPTIONS } from 'utils/constants';

import ShareIcon from 'assets/images/share-icon-dark.svg';
import SimilarIcon from 'assets/images/SimilarSong_Icon_dark.svg';
import PianoSvg from 'assets/images/single-song/CustomWork_dark.svg';
import PlaySvg from 'assets/images/single-song/Single-Song_Play.svg';
import BandcampSvg from 'assets/images/single-song/Single-Song_Bandcamp.svg';
import SpotifySvg from 'assets/images/single-song/Single-Song_Spotify.svg';
import AppleSvg from 'assets/images/single-song/Single-Song_Apple.svg';
import ITunesSvg from 'assets/images/single-song/Single-Song_iTunes.svg';
import SoundCloudSvg from 'assets/images/single-song/Single-Song_SoundCloud.svg';
import GooglePlaySvg from 'assets/images/single-song/Single-Song_GooglePlay.svg';
import VimeoSvg from 'assets/images/single-song/Single-Song_Vimeo.svg';
import CopyLinkSvg from 'assets/images/copy-link.svg';
import DoneSvg from 'assets/images/done-check.svg';

import { api } from '../../services';

import './style.scss';

const baseUrl =
    process.env.NODE_ENV === 'production' ? 'https://catalog.patternbased.com' : 'https://patternbased.herokuapp.com/';

/**
 * Component to handle the single song page
 * @param {Object} props router props
 * @returns {React.Component}
 */
function SongPage(props) {
    const songId = props.match.params.name.split('-')[0];
    const dispatch = useDispatch();
    const [song, setSong] = useState(null);
    const [altVersions, setAltVersions] = useState(null);
    const [similarTracks, setSimilarTracks] = useState(null);
    const [songMoods, setSongMoods] = useState('');
    const [coverHover, setCoverHover] = useState(false);
    // const [songClicked, setSongClicked] = useState(false);
    // const [songPlaying, setSongPlaying] = useState(false);
    const songIsPlaying = useSelector(selectors.general.get('songPlaying'));
    const [artistInfo, setArtistInfo] = useState(null);
    const [shareItem, setShareItem] = useState();
    const [shareOpened, setShareOpened] = useState(false);
    const [shareSongLinkCopied, setShareSongLinkCopied] = useState(false);
    const [openedTooltip, setOpenedTooltip] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState([]);

    const songList = useSelector(selectors.library.getAll);
    const filtersPanelState = useSelector(selectors.general.get('filtersOpened'));
    const presetsPanelState = useSelector(selectors.general.get('presetsOpened'));
    const similarOpened = useSelector(selectors.general.get('similarOpened'));
    // const currentSong = useSelector(selectors.library.getCurrentSong);
    const appliedFilters = useSelector(selectors.filters.getApplied);

    const infoTooltipClass = useCallback(
        (name) =>
            classnames('info-tooltip', {
                'info-tooltip--active': openedTooltip === name,
            }),
        [openedTooltip]
    );

    const placeTooltip = (e, name) => {
        setTooltipPosition([e.clientX + 20, e.clientY - 10]);
        setOpenedTooltip(name);
    };

    const selectInstrument = (instrument) => {
        const instrumentsCopy = appliedFilters['instruments'] ? [...appliedFilters['instruments']] : [];
        !filtersPanelState && dispatch(setState('filtersOpened', true));
        dispatch(setFilter('instruments', instrumentsCopy.concat(instrument)));
        // window.location = '/';
    };

    const songClass = useMemo(
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
        if (songId && songList) {
            dispatch(setState('filtersOpened', false));
            const songData = songList.find((song) => song.pbId === songId);
            if (songData) {
                setSong(songData);
                if (songData.altVersions) {
                    const altSongs = [];
                    songData.altVersions.map((version) => {
                        const altSong = songList.find((song) => song.pbId === version);
                        altSong && altSongs.push(altSong);
                    });
                    setAltVersions(altSongs);
                }
                const similar = _getSimilarSongs(songList, songData);
                similar && setSimilarTracks(similar);
                const songMoodGenre = [];
                songData.genre.length && songMoodGenre.push(songData.genre);
                songData.primaryMood.length && songMoodGenre.push(songData.primaryMood);
                songData.secondaryMoods.length && songData.secondaryMoods.map((mood) => songMoodGenre.push(mood));
                setSongMoods(songMoodGenre);
            }
            api.get(`/api/artist/${songData.artistName.toLowerCase().split(' ').join('-')}`).then((res) => {
                setArtistInfo(res.artist);
            });
        }
    }, [songId, songList]);

    const shareSongId = uuid();

    const playSong = (val = song) => {
        dispatch(setCurrentSong(val));
        dispatch(addToQueue(val));
        // setSongClicked(true);
        // setSongPlaying(!songPlaying);
        dispatch(setState('songPlaying', !songIsPlaying));
    };

    const openShareModal = () => {
        setShareItem(song);
        setShareOpened(true);
    };

    const copyShareSongLink = () => {
        const shareData = {
            name: shareItem.title,
            type: 'song',
            songs: [shareItem.pbId],
            shareId: shareSongId,
        };
        fetch('/api/create-share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: shareData }),
        }).then((res) => {
            setShareSongLinkCopied(true);
        });
    };

    return (
        <>
            <Header />
            <div className={songClass}>
                {song && (
                    <main className="song">
                        <div className="song__section">
                            <div className="song__column">
                                <span className="desktop-hide">
                                    <div className="song__title">{song.title}</div>
                                    <Link to={`/project/${song.artistName.toLowerCase().split(' ').join('-')}`}>
                                        <div className="song__artist">by {song.artistName}</div>
                                    </Link>
                                    <div className="song__actions">
                                        <PianoSvg
                                            onClick={() => {
                                                dispatch(setState('customWorkOpened', true));
                                                dispatch(
                                                    setCustomWorkSong({
                                                        title: song.title,
                                                        artist: song.artistName,
                                                        image: song.cover,
                                                    })
                                                );
                                            }}
                                        />
                                        <SimilarIcon
                                            onClick={() => {
                                                dispatch(setState('similarOpened', !similarOpened));
                                            }}
                                        />
                                        <ShareIcon onClick={() => openShareModal()} />
                                        <Button
                                            className="song__actions-license"
                                            width={100}
                                            height={36}
                                            onClick={() => {
                                                dispatch(
                                                    setLicenseSong({
                                                        title: song.title,
                                                        artist: song.artistName,
                                                        image: song.cover,
                                                        url: song.url,
                                                    })
                                                );
                                                dispatch(setState('licenseOpened', true));
                                            }}
                                        >
                                            License
                                        </Button>
                                    </div>
                                </span>
                                <div
                                    className="song__cover"
                                    onMouseEnter={() => setCoverHover(true)}
                                    onMouseLeave={() => setCoverHover(false)}
                                >
                                    {coverHover && (
                                        <div className="song__cover__overlay" onClick={() => playSong()}>
                                            {!songIsPlaying ? (
                                                <img src={`/assets/images/player/pause.png`} />
                                            ) : (
                                                <PlaySvg />
                                            )}
                                        </div>
                                    )}

                                    <img src={song.image} alt={`${song.title} by ${song.artistName}`} />
                                </div>
                                <span className="mobile-hide">
                                    <div className="song__column__row-header">
                                        <div className="song__column__row-header__overlay" />
                                        Writers
                                    </div>
                                    <div className="song__column__row-content">
                                        {song.writers.map((writer, index) => (
                                            <Link
                                                key={index}
                                                to={`/artist/${writer.toLowerCase().trim().split(' ').join('-')}`}
                                            >
                                                <div className="song__column__writer">
                                                    <img src={song.cover} alt={writer} />
                                                    {writer}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="song__column__row-header">
                                        <div className="song__column__row-header__overlay" />
                                        Album
                                    </div>
                                    <div className="song__column__row-content">
                                        <img src={song.cover} alt={song.albumTitle} />
                                        <Link to={`/album/${song.albumTitle}/${song.albumId}`}>
                                            <div className="song__column__album-title">
                                                <em>{song.albumTitle}&nbsp;</em>{' '}
                                                {song.dateReleased && <>({song.dateReleased.split('-')[0]})</>}
                                            </div>
                                        </Link>
                                    </div>
                                </span>
                            </div>
                            <div className="song__column">
                                <span className="mobile-hide">
                                    <div className="song__title">{song.title}</div>
                                    <Link to={`/project/${song.artistName.toLowerCase().split(' ').join('-')}`}>
                                        <div className="song__artist">by {song.artistName}</div>
                                    </Link>
                                    <div className="song__actions">
                                        <PianoSvg
                                            onClick={() => {
                                                dispatch(setState('customWorkOpened', true));
                                                dispatch(
                                                    setCustomWorkSong({
                                                        title: song.title,
                                                        artist: song.artistName,
                                                        image: song.cover,
                                                    })
                                                );
                                            }}
                                        />
                                        <SimilarIcon
                                            onClick={() => {
                                                dispatch(setState('similarOpened', !similarOpened));
                                            }}
                                        />
                                        <ShareIcon onClick={() => openShareModal()} />
                                        <Button
                                            className="song__actions-license"
                                            width={100}
                                            height={36}
                                            onClick={() => {
                                                dispatch(
                                                    setLicenseSong({
                                                        title: song.title,
                                                        artist: song.artistName,
                                                        image: song.cover,
                                                        url: song.url,
                                                    })
                                                );
                                                dispatch(setState('licenseOpened', true));
                                            }}
                                        >
                                            License
                                        </Button>
                                    </div>
                                </span>
                                <div className="song__description">{song.description}</div>
                                <div className="song__attributes">
                                    <div className="song__attributes__single">
                                        <div className="song__attributes__key">Key</div>
                                        <div className="song__attributes__value">{song.musicKey}</div>
                                    </div>
                                    <div className="song__attributes__single">
                                        <div className="song__attributes__key">BPM</div>
                                        <div className="song__attributes__value">{song.bpm}</div>
                                    </div>
                                    <div className="song__attributes__single">
                                        <div className="song__attributes__key">
                                            Rhythm
                                            <div className="filter__header__tooltip">
                                                <div onMouseOut={() => setOpenedTooltip('')}>
                                                    <div
                                                        className={infoTooltipClass('rhythm')}
                                                        onMouseOver={(e) => placeTooltip(e, 'rhythm')}
                                                    >
                                                        ?
                                                    </div>
                                                </div>
                                                {openedTooltip === 'rhythm' && (
                                                    <Tooltip
                                                        text={FILTERS_DESCRIPTIONS['rhythm']}
                                                        position={tooltipPosition}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="song__attributes__value">
                                            {song.rhythm}
                                            <span>/10</span>
                                        </div>
                                    </div>
                                    <div className="song__attributes__single">
                                        <div className="song__attributes__key">
                                            Speed
                                            <div className="filter__header__tooltip">
                                                <div onMouseOut={() => setOpenedTooltip('')}>
                                                    <div
                                                        className={infoTooltipClass('speed')}
                                                        onMouseOver={(e) => placeTooltip(e, 'speed')}
                                                    >
                                                        ?
                                                    </div>
                                                </div>
                                                {openedTooltip === 'speed' && (
                                                    <Tooltip
                                                        text={FILTERS_DESCRIPTIONS['speed']}
                                                        position={tooltipPosition}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="song__attributes__value">
                                            {song.speed}
                                            <span>/10</span>
                                        </div>
                                    </div>
                                    <div className="song__attributes__single">
                                        <div className="song__attributes__key">
                                            Experimental
                                            <div className="filter__header__tooltip">
                                                <div onMouseOut={() => setOpenedTooltip('')}>
                                                    <div
                                                        className={infoTooltipClass('experimental')}
                                                        onMouseOver={(e) => placeTooltip(e, 'experimental')}
                                                    >
                                                        ?
                                                    </div>
                                                </div>
                                                {openedTooltip === 'experimental' && (
                                                    <Tooltip
                                                        text={FILTERS_DESCRIPTIONS['experimental']}
                                                        position={tooltipPosition}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="song__attributes__value">
                                            {song.experimental}
                                            <span>/10</span>
                                        </div>
                                    </div>
                                    <div className="song__attributes__single">
                                        <div className="song__attributes__key">
                                            Mood
                                            <div className="filter__header__tooltip">
                                                <div onMouseOut={() => setOpenedTooltip('')}>
                                                    <div
                                                        className={infoTooltipClass('mood')}
                                                        onMouseOver={(e) => placeTooltip(e, 'mood')}
                                                    >
                                                        ?
                                                    </div>
                                                </div>
                                                {openedTooltip === 'mood' && (
                                                    <Tooltip
                                                        text={FILTERS_DESCRIPTIONS['mood']}
                                                        position={tooltipPosition}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="song__attributes__value">
                                            {song.mood}
                                            <span>/10</span>
                                        </div>
                                    </div>
                                    <div className="song__attributes__single">
                                        <div className="song__attributes__key">
                                            Grid
                                            <div className="filter__header__tooltip">
                                                <div onMouseOut={() => setOpenedTooltip('')}>
                                                    <div
                                                        className={infoTooltipClass('grid')}
                                                        onMouseOver={(e) => placeTooltip(e, 'grid')}
                                                    >
                                                        ?
                                                    </div>
                                                </div>
                                                {openedTooltip === 'grid' && (
                                                    <Tooltip
                                                        text={FILTERS_DESCRIPTIONS['grid']}
                                                        position={tooltipPosition}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="song__attributes__value">
                                            {song.grid}
                                            <span>/10</span>
                                        </div>
                                    </div>
                                    <div className="song__attributes__single">
                                        <div className="song__attributes__key">
                                            Flow
                                            <div className="filter__header__tooltip">
                                                <div onMouseOut={() => setOpenedTooltip('')}>
                                                    <div
                                                        className={infoTooltipClass('flow')}
                                                        onMouseOver={(e) => placeTooltip(e, 'flow')}
                                                    >
                                                        ?
                                                    </div>
                                                </div>
                                                {openedTooltip === 'flow' && (
                                                    <Tooltip
                                                        text={FILTERS_DESCRIPTIONS['flow']}
                                                        position={tooltipPosition}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="song__attributes__value">
                                            {TABLE_FLOW_SHAPES.find(
                                                (x) => x.name.toLowerCase() === song.arc.toLowerCase()
                                            ) && (
                                                <img
                                                    src={
                                                        TABLE_FLOW_SHAPES.find(
                                                            (x) => x.name.toLowerCase() === song.arc.toLowerCase()
                                                        ).image
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="song__attributes__single">
                                        <div className="song__attributes__key">Stems</div>
                                        <div className="song__attributes__value">{song.stems}</div>
                                    </div>
                                    <div className="song__attributes__single">
                                        <div className="song__attributes__key">Duration</div>
                                        <div className="song__attributes__value">{song.length}</div>
                                    </div>
                                    <div className="song__attributes__single">
                                        <div className="song__attributes__key">ISRC Code</div>
                                        <div className="song__attributes__value">{song.isrcCode}</div>
                                    </div>
                                </div>
                                <div className="song__others">
                                    <div className="song__instruments">
                                        <div className="song__instruments__border" />
                                        <div className="song__instruments__content">
                                            <span className="song__instruments__label">Instruments</span>
                                            {song.instruments.map((s, index) => (
                                                <span
                                                    key={index}
                                                    className="song__instruments__value"
                                                    onClick={() => selectInstrument(s)}
                                                >
                                                    <span>{s}</span>
                                                    {index < song.instruments.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="song__instruments">
                                        <div className="song__instruments__border" />
                                        <div className="song__instruments__content">
                                            <span className="song__instruments__label">Genres/Mood</span>
                                            {songMoods.map((s, index) => (
                                                <span key={index} className="song__instruments__value">
                                                    <span>{s}</span>
                                                    {index < songMoods.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="song__media">
                                    <BandcampSvg className="song__media__bandcamp" />
                                    <SpotifySvg className="song__media__spotify" />
                                    <AppleSvg className="song__media__apple" />
                                    <ITunesSvg className="song__media__itunes" />
                                    <SoundCloudSvg className="song__media__soundcloud" />
                                    <GooglePlaySvg className="song__media__google" />
                                    <VimeoSvg className="song__media__vimeo" />
                                </div>
                                <span className="desktop-hide">
                                    <div className="song__column__row-header">
                                        <div className="song__column__row-header__overlay" />
                                        Writers
                                    </div>
                                    <div className="song__column__row-content">
                                        {song.writers.map((writer, index) => (
                                            <Link
                                                key={index}
                                                to={`/artist/${writer.toLowerCase().trim().split(' ').join('-')}`}
                                            >
                                                <div className="song__column__writer">
                                                    <img src={song.cover} alt={writer} />
                                                    {writer}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="song__column__row-header">
                                        <div className="song__column__row-header__overlay" />
                                        Album
                                    </div>
                                    <div className="song__column__row-content">
                                        <img src={song.cover} alt={song.albumTitle} />
                                        <Link to={`/album/${song.albumTitle}/${song.albumId}`}>
                                            <div className="song__column__album-title">
                                                <em>{song.albumTitle}&nbsp;</em>{' '}
                                                {song.dateReleased && <>({song.dateReleased.split('-')[0]})</>}
                                            </div>
                                        </Link>
                                    </div>
                                </span>
                            </div>
                        </div>
                        {altVersions && (
                            <div className="song__section">
                                <div className="song__table">
                                    <div className="song__table__title">Alternative Versions of this Track</div>
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
                                        <Link to={`/project/${song.artistName.toLowerCase().split(' ').join('-')}`}>
                                            <div className="song__banner__button">MORE FROM THIS ARTIST</div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                        {similarTracks && (
                            <div className="song__section">
                                <div className="song__table">
                                    <div className="song__table__header">
                                        <div className="song__table__title">You May Also Like</div>
                                        <Button
                                            width={222}
                                            height={42}
                                            onClick={() => dispatch(setState('similarOpened', true))}
                                        >
                                            SEE ALL SIMILAR TRACKS
                                        </Button>
                                    </div>
                                    <SongsTable list={similarTracks} onSelect={(val) => playSong(val)} page="home" />
                                </div>
                            </div>
                        )}
                    </main>
                )}
                {/* {songClicked && currentSong && <MusicPlayer play={songPlaying} />} */}
                {shareOpened && (
                    <Modal opened={shareOpened} modifier="share queue-share">
                        <img
                            src="/assets/images/close-icon.png"
                            onClick={() => setShareOpened(false)}
                            className="share__close"
                        />
                        <div className="share__header">Share This Song</div>
                        <div className="share__item">
                            <img src={shareItem.cover} />
                            <div>
                                <div className="share__item__title">{shareItem.title}</div>
                                <div className="share__item__artist">by {shareItem.artistName}</div>
                            </div>
                        </div>
                        <CopyToClipboard text={`${baseUrl}?shareId=${shareSongId}`} onCopy={() => copyShareSongLink()}>
                            {shareSongLinkCopied ? (
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
                <SimilarSongsPanel
                    visible={similarOpened}
                    onClose={() => dispatch(setState('similarOpened', false))}
                    similarTo={song}
                />
            </div>
        </>
    );
}

/**
 * Filters the similar songs
 * @param {Array} all all songs
 * @param {Object} current current song playing
 * @returns {React.Component}
 */
function _getSimilarSongs(all, current) {
    return all
        .filter((song) => song.mood >= current.mood - 2 && song.mood <= current.mood + 2 && current.pbId !== song.pbId)
        .slice(0, 6);
}

SongPage.displayName = 'SongPage';

export default SongPage;
