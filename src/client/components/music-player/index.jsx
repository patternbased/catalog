/* eslint-disable max-lines-per-function */
import React, { memo, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import Slider from 'rc-slider';
import uuid from 'react-uuid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classnames from 'classnames';
import { event } from 'react-ga';
import selectors from 'selectors';

import Button from 'components/button';
import QueuePanel from 'components/queue';
import SimilarSongsPanel from 'components/similar-songs';
import Modal from 'components/modal';
import SongBy from 'components/song-by';

import { setState } from 'actions/general';
import { addToQueue, setCurrentSong, setCustomWorkSong, setLicenseSong } from 'actions/library';

import CopyLinkSvg from 'assets/images/copy-link.svg';
import DoneSvg from 'assets/images/done-check.svg';
import PianoSvg from 'assets/images/single-song/CustomWork_dark.svg';
import SimilarSvg from 'assets/images/SimilarSong_Icon_dark.svg';
import ShareSvg from 'assets/images/share-icon-dark.svg';
import ActionsSvg from 'assets/images/actions.svg';
import CartSvg from 'assets/images/header/cart.svg';
import SeeArtistSvg from 'assets/images/see-artist.svg';
import SeeSongSvg from 'assets/images/see-song.svg';

import './style.scss';

const baseUrl =
    process.env.NODE_ENV === 'production' ? 'https://catalog.patternbased.com' : 'https://patternbased.herokuapp.com/';

/**
 * Music Player component
 * @returns {React.Component}
 */
function MusicPlayer({ list, play }) {
    const [currentPlaying, setCurrentPlaying] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(null);
    const [shareOpened, setShareOpened] = useState(false);
    const [shareItem, setShareItem] = useState();
    const [shareSongLinkCopied, setShareSongLinkCopied] = useState(false);
    const [actionsOpened, setActionsOpened] = useState(false);
    const dispatch = useDispatch();

    const currentPlaylist = useSelector(selectors.library.getQueue);
    const currentSong = useSelector(selectors.library.getCurrentSong);

    const queueOpened = useSelector(selectors.general.get('queueOpened'));
    const similarOpened = useSelector(selectors.general.get('similarOpened'));

    const musicPlayer = useRef();

    useEffect(() => {
        setCurrentPlaying(currentSong);
    }, [currentSong]);

    useEffect(() => {
        setIsPlaying(play);
    }, [play]);

    const updateElapsedTime = (val) => {
        musicPlayer.current.seekTo(parseFloat(val, 'seconds'));
        setElapsed(val);
    };

    const goToNextSong = () => {
        const currentIndex = currentPlaylist.findIndex((x) => x.pbId === currentPlaying.pbId);
        let nextSong = {};
        const queueList = currentPlaylist.find((x) => x.list);
        if (queueList) {
            const qList = queueList.list;
            const listIndex = qList.findIndex((x) => x.pbId === currentPlaying.pbId);
            nextSong = qList[listIndex + 1] ? qList[listIndex + 1] : qList[0];
            dispatch(setCurrentSong(nextSong));
        } else {
            if (currentPlaylist[currentIndex + 1]) {
                nextSong = currentPlaylist[currentIndex + 1];
            } else if (list) {
                const listIndex = list.findIndex((x) => x.pbId === currentPlaying.pbId);
                nextSong = list[listIndex + 1] ? list[listIndex + 1] : list[0];
            } else {
                nextSong = currentPlaylist[0];
            }
            dispatch(setCurrentSong(nextSong));
            dispatch(addToQueue(nextSong));
        }
        setElapsed(0);
    };

    const onPrev = () => {
        const currentIndex = currentPlaylist.findIndex((x) => x.pbId === currentPlaying.pbId);
        const prev = currentPlaylist[currentIndex - 1];
        dispatch(setCurrentSong(prev));
        dispatch(addToQueue(prev));
    };

    const onNext = () => {
        const currentIndex = currentPlaylist.findIndex((x) => x.pbId === currentPlaying.pbId);
        let next = {};
        const queueList = currentPlaylist.find((x) => x.list);
        if (queueList) {
            const qList = queueList.list;
            const listIndex = qList.findIndex((x) => x.pbId === currentPlaying.pbId);
            next = qList[listIndex + 1] ? qList[listIndex + 1] : qList[0];
            dispatch(setCurrentSong(next));
        } else {
            if (currentPlaylist[currentIndex + 1]) {
                next = currentPlaylist[currentIndex + 1];
            } else if (list) {
                const listIndex = list.findIndex((x) => x.pbId === currentPlaying.pbId);
                next = list[listIndex + 1] ? list[listIndex + 1] : list[0];
            } else {
                next = currentPlaylist[0];
            }
            dispatch(setCurrentSong(next));
            dispatch(addToQueue(next));
        }

        setElapsed(0);
    };

    const shareSongId = uuid();

    const openShareModal = () => {
        setShareItem(currentPlaying);
        setShareOpened(true);
    };

    const copyShareSongLink = () => {
        setShareSongLinkCopied(true);
        event({
            category: 'Music player',
            action: 'Share song clicked',
            label: `Share ${currentPlaying.title}`,
        });
    };

    return (
        <>
            <div className="music-player">
                <div className="mobile-control">
                    <div className="music-player__section music-player__section--content">
                        <Link
                            to={
                                currentPlaying
                                    ? `/song/${currentSong.pbId}-${currentSong.title
                                          .toLowerCase()
                                          .split(' ')
                                          .join('-')}`
                                    : ''
                            }
                            className="player-mobile-link"
                        >
                            <img src={currentPlaying.cover} className="music-player__section--content__song-image" />
                        </Link>
                        <div className="music-player__section--content__song__details">
                            <div className="music-player__section--content__song__details music-player__section--content__song__details-all">
                                <p className="music-player__section--content__song__details-title">
                                    {currentPlaying.title}&nbsp;
                                </p>
                                <SongBy
                                    project={currentPlaying.artistName}
                                    feat={currentPlaying.featArtist}
                                    classNames="music-player__section--content__song__details-author"
                                />
                                <p className="music-player__section--content__song__details-duration">
                                    {_formatTime(duration)}
                                </p>
                            </div>
                            <div className="music-player__section--content__song__details-progress">
                                <Slider
                                    min={0}
                                    max={duration}
                                    value={elapsed}
                                    step={0.0001}
                                    onChange={(val) => updateElapsedTime(val)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mobile-control">
                    <div className="music-player__section music-player__section--content-changed">
                        <div className="music-player__section--content__actions">
                            <ActionsSvg
                                className={classnames('music-player__section--content__actions-button', {
                                    'music-player__section--content__actions-button--active': actionsOpened,
                                })}
                                onClick={() => setActionsOpened(!actionsOpened)}
                            />
                            {actionsOpened && (
                                <div className="actions-menu">
                                    <Link
                                        to={
                                            currentPlaying
                                                ? `/song/${currentSong.pbId}-${currentSong.title
                                                      .toLowerCase()
                                                      .split(' ')
                                                      .join('-')}`
                                                : ''
                                        }
                                        className="player-mobile-link"
                                    >
                                        <div>
                                            <SeeSongSvg className="music-player__section--content__actions-button" />
                                            See This Song
                                        </div>
                                    </Link>
                                    <Link
                                        to={
                                            Object.keys(currentPlaying).length
                                                ? `/project/${currentPlaying.artistName
                                                      .toLowerCase()
                                                      .split(' ')
                                                      .join('-')}`
                                                : ''
                                        }
                                    >
                                        <div>
                                            <SeeArtistSvg className="music-player__section--content__actions-button" />
                                            See This Artist
                                        </div>
                                    </Link>
                                    <div
                                        onClick={() => {
                                            dispatch(
                                                setCustomWorkSong({
                                                    title: currentPlaying.title,
                                                    artist: currentPlaying.artistName,
                                                    image: currentPlaying.cover,
                                                })
                                            );
                                            dispatch(setState('customWorkOpened', true));
                                        }}
                                    >
                                        <PianoSvg className="music-player__section--content__actions-button" />
                                        Custom Work
                                    </div>
                                    <div onClick={() => dispatch(setState('similarOpened', !similarOpened))}>
                                        <SimilarSvg className="music-player__section--content__actions-button" />
                                        Similar Songs
                                    </div>
                                    <div onClick={() => openShareModal()}>
                                        <ShareSvg className="music-player__section--content__actions-button" />
                                        Share Song
                                    </div>
                                    <div
                                        onClick={() => {
                                            dispatch(
                                                setLicenseSong({
                                                    title: currentPlaying.title,
                                                    artist: currentPlaying.artistName,
                                                    image: currentPlaying.cover,
                                                    url: currentPlaying.url,
                                                    album: currentPlaying.albumTitle,
                                                    trackNo: currentPlaying.sequence,
                                                })
                                            );
                                            dispatch(setState('licenseOpened', true));
                                            event({
                                                category: 'Music player',
                                                action: 'Click on License',
                                                label: `License for ${currentPlaying.title}`,
                                            });
                                        }}
                                    >
                                        <CartSvg className="music-player__section--content__actions-button music-player__section--content__actions-button--license" />
                                        License
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="music-player__section music-player__section--controls">
                        <img
                            src="/assets/images/player/prev.png"
                            className="music-player__section--controls-button"
                            onClick={() => onPrev()}
                        />
                        <img
                            src={`/assets/images/player/${isPlaying ? 'pause' : 'play'}.png`}
                            className="music-player__section--controls-button"
                            onClick={() => {
                                setIsPlaying(isPlaying ? false : true);
                                dispatch(setState('songPlaying', isPlaying ? false : true));
                            }}
                        />
                        <img
                            src="/assets/images/player/next.png"
                            className="music-player__section--controls-button"
                            onClick={() => onNext()}
                        />
                    </div>
                    <div
                        className="music-player__section--extra-button"
                        onClick={() => dispatch(setState('queueOpened', !queueOpened))}
                    />
                </div>
                <div className="music-player__section music-player__section--controls desktop-control">
                    <img
                        src="/assets/images/player/prev.png"
                        className="music-player__section--controls-button"
                        onClick={() => onPrev()}
                    />
                    <img
                        src={`/assets/images/player/${isPlaying ? 'pause' : 'play'}.png`}
                        className="music-player__section--controls-button"
                        onClick={() => {
                            setIsPlaying(isPlaying ? false : true);
                            dispatch(setState('songPlaying', isPlaying ? false : true));
                        }}
                    />
                    <img
                        src="/assets/images/player/next.png"
                        className="music-player__section--controls-button"
                        onClick={() => onNext()}
                    />
                    <ReactPlayer
                        ref={musicPlayer}
                        url={currentPlaying.url}
                        playing={isPlaying}
                        onReady={(e) => {
                            setDuration(e.getDuration());
                        }}
                        onProgress={(e) => {
                            setElapsed(e.playedSeconds);
                        }}
                        onStart={() => {
                            setIsPlaying(true);
                            dispatch(setState('songPlaying', true));
                        }}
                        onEnded={() => goToNextSong()}
                    />
                </div>
                <div className="music-player__section music-player__section--content desktop-control">
                    <div className="music-player__section--content__song">
                        <img src={currentPlaying.cover} className="music-player__section--content__song-image" />
                        <div className="music-player__section--content__song__details">
                            <Link
                                to={
                                    currentPlaying
                                        ? `/song/${currentSong.pbId}-${currentSong.title
                                              .toLowerCase()
                                              .split(' ')
                                              .join('-')}`
                                        : ''
                                }
                            >
                                <p className="music-player__section--content__song__details-title">
                                    {currentPlaying.title}
                                </p>
                            </Link>
                            <SongBy
                                project={currentPlaying.artistName}
                                feat={currentPlaying.featArtist}
                                classNames="music-player__section--content__song__details-author music-player__section--content__song__details-author--inline"
                            />
                            <div className="music-player__section--content__song__details">
                                <div className="music-player__section--content__song__details-progress">
                                    <Slider
                                        min={0}
                                        max={duration}
                                        value={elapsed}
                                        step={0.0001}
                                        onChange={(val) => updateElapsedTime(val)}
                                    />
                                </div>
                                <p className="music-player__section--content__song__details-duration">
                                    {_formatTime(elapsed)} <span>/ {_formatTime(duration)}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="music-player__section--content__actions">
                        <ActionsSvg
                            className={classnames('music-player__section--content__actions-button desktop-hide', {
                                'music-player__section--content__actions-button--active': actionsOpened,
                            })}
                            onClick={() => setActionsOpened(!actionsOpened)}
                        />
                        {actionsOpened && (
                            <div className="desktop-hide actions-menu">
                                <Link
                                    to={
                                        currentPlaying
                                            ? `/song/${currentSong.pbId}-${currentSong.title
                                                  .toLowerCase()
                                                  .split(' ')
                                                  .join('-')}`
                                            : ''
                                    }
                                    className="player-mobile-link"
                                >
                                    <div>
                                        <SeeSongSvg className="music-player__section--content__actions-button" />
                                        See This Song
                                    </div>
                                </Link>
                                <Link
                                    to={
                                        Object.keys(currentPlaying).length
                                            ? `/project/${currentPlaying.artistName.toLowerCase().split(' ').join('-')}`
                                            : ''
                                    }
                                >
                                    <div>
                                        <SeeArtistSvg className="music-player__section--content__actions-button" />
                                        See This Artist
                                    </div>
                                </Link>
                                <div
                                    onClick={() => {
                                        dispatch(
                                            setCustomWorkSong({
                                                title: currentPlaying.title,
                                                artist: currentPlaying.artistName,
                                                image: currentPlaying.cover,
                                            })
                                        );
                                        dispatch(setState('customWorkOpened', true));
                                    }}
                                >
                                    <PianoSvg className="music-player__section--content__actions-button" />
                                    Custom Work
                                </div>
                                <div onClick={() => dispatch(setState('similarOpened', !similarOpened))}>
                                    <SimilarSvg className="music-player__section--content__actions-button" />
                                    Similar Songs
                                </div>
                                <div onClick={() => openShareModal()}>
                                    <ShareSvg className="music-player__section--content__actions-button" />
                                    Share Song
                                </div>
                                <div
                                    onClick={() => {
                                        dispatch(
                                            setLicenseSong({
                                                title: currentPlaying.title,
                                                artist: currentPlaying.artistName,
                                                image: currentPlaying.cover,
                                                url: currentPlaying.url,
                                                album: currentPlaying.albumTitle,
                                                trackNo: currentPlaying.sequence,
                                            })
                                        );
                                        dispatch(setState('licenseOpened', true));
                                        event({
                                            category: 'Music player',
                                            action: 'Click on License',
                                            label: `License for ${currentPlaying.title}`,
                                        });
                                    }}
                                >
                                    <CartSvg className="music-player__section--content__actions-button music-player__section--content__actions-button--license" />
                                    License
                                </div>
                            </div>
                        )}
                        <span className="mobile-hide">
                            <PianoSvg
                                className="music-player__section--content__actions-button"
                                onClick={() => {
                                    dispatch(
                                        setCustomWorkSong({
                                            title: currentPlaying.title,
                                            artist: currentPlaying.artistName,
                                            image: currentPlaying.cover,
                                        })
                                    );
                                    dispatch(setState('customWorkOpened', true));
                                    event({
                                        category: 'Music player',
                                        action: 'Custom work clicked',
                                        label: `Custom work for ${currentPlaying.title}`,
                                    });
                                }}
                            />
                            <SimilarSvg
                                className="music-player__section--content__actions-button"
                                onClick={() => {
                                    dispatch(setState('similarOpened', !similarOpened));
                                    event({
                                        category: 'Music player',
                                        action: 'Similar songs clicked',
                                        label: `Similar songs for ${currentPlaying.title}`,
                                    });
                                }}
                            />
                            <ShareSvg
                                className="music-player__section--content__actions-button"
                                onClick={() => openShareModal()}
                            />
                        </span>
                        <Button
                            className="music-player__section--content__actions-license"
                            width={80}
                            height={40}
                            onClick={() => {
                                dispatch(
                                    setLicenseSong({
                                        title: currentPlaying.title,
                                        artist: currentPlaying.artistName,
                                        image: currentPlaying.cover,
                                        url: currentPlaying.url,
                                        album: currentPlaying.albumTitle,
                                        trackNo: currentPlaying.sequence,
                                    })
                                );
                                dispatch(setState('licenseOpened', true));
                                event({
                                    category: 'Music player',
                                    action: 'License clicked',
                                    label: `License for ${currentPlaying.title}`,
                                });
                            }}
                        >
                            License
                        </Button>
                    </div>
                </div>
                <div className="music-player__section music-player__section--extra desktop-control">
                    <div
                        className="music-player__section--extra-button"
                        onClick={() => dispatch(setState('queueOpened', !queueOpened))}
                    />
                </div>
            </div>
            <QueuePanel visible={queueOpened} onClose={() => dispatch(setState('queueOpened', false))} />
            <SimilarSongsPanel
                visible={similarOpened}
                onClose={() => dispatch(setState('similarOpened', false))}
                similarTo={currentPlaying}
            />
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
                    <CopyToClipboard
                        text={`${baseUrl}song/${shareItem.pbId}-${shareItem.title.toLowerCase().split(' ').join('-')}`}
                        onCopy={() => copyShareSongLink()}
                    >
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
        </>
    );
}

/**
 * Function for time format(for song elapsed time)
 * @param {String} time current elapsed time in ms
 * @returns {String}
 */
function _formatTime(time) {
    return `${`0${Math.floor(time / 60)}`.slice(-2)}:${`0${Math.floor(time % 60)}`.slice(-2)}`;
}

MusicPlayer.propTypes = {
    list: PropTypes.array,
    play: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

MusicPlayer.defaultProps = {
    play: false,
};

MusicPlayer.displayName = 'MusicPlayer';

export default memo(MusicPlayer);
