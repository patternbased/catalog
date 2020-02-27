/* eslint-disable max-lines-per-function */
import React, { memo, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import uuid from 'react-uuid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import selectors from 'selectors';

import Button from 'components/button';
import QueuePanel from 'components/queue';
import SimilarSongsPanel from 'components/similar-songs';
import Modal from 'components/modal';

import { setState } from 'actions/general';
import { addToQueue, setCurrentSong, setCustomWorkSong } from 'actions/library';

import CopyLinkSvg from 'assets/images/copy-link.svg';
import DoneSvg from 'assets/images/done-check.svg';
import PianoSvg from 'assets/images/single-song/CustomWork_dark.svg';
import SimilarSvg from 'assets/images/SimilarSong_Icon_dark.svg';
import ShareSvg from 'assets/images/share-icon-dark.svg';

import './style.scss';

const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3500/' : 'https://patternbased.herokuapp.com/';

/**
 * Music Player component
 * @returns {React.Component}
 */
function MusicPlayer({ list }) {
    const [currentPlaying, setCurrentPlaying] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songHovered, setSongHovered] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(null);
    const [queueOpened, setQueueOpened] = useState(false);
    const [similarOpened, setSimilarOpened] = useState(false);
    const [shareOpened, setShareOpened] = useState(false);
    const [shareItem, setShareItem] = useState();
    const [shareSongLinkCopied, setShareSongLinkCopied] = useState(false);
    const dispatch = useDispatch();

    const currentPlaylist = useSelector(selectors.library.getQueue);
    const currentSong = useSelector(selectors.library.getCurrentSong);

    useEffect(() => {
        setCurrentPlaying(currentSong);
    }, [currentSong]);

    const musicPlayer = useRef();

    const handleSongHover = () => {
        if (isPlaying) {
            setSongHovered(true);
        }
    };

    const pauseSong = () => {
        musicPlayer.current.pause();
        setIsPlaying(false);
    };

    const playSong = () => {
        musicPlayer.current.play();
        setIsPlaying(true);
    };

    const updateElapsedTime = val => {
        musicPlayer.current.currentTime = val;
        setElapsed(val);
    };

    useEffect(() => {
        musicPlayer.current.src = currentPlaying.url;
        musicPlayer.current.play();
        setIsPlaying(true);
        musicPlayer.current.addEventListener('timeupdate', e => {
            setElapsed(e.target.currentTime);
        });
        musicPlayer.current.addEventListener('playing', e => {
            setDuration(e.target.duration);
        });
        musicPlayer.current.addEventListener('ended', function() {
            const currentIndex = currentPlaylist.findIndex(x => x.pbId === currentPlaying.pbId);
            let nextSong = {};
            if (currentPlaylist[currentIndex + 1]) {
                nextSong = currentPlaylist[currentIndex + 1];
            } else if (list) {
                const listIndex = list.findIndex(x => x.pbId === currentPlaying.pbId);
                nextSong = list[listIndex + 1] ? list[listIndex + 1] : list[0];
            } else {
                nextSong = currentPlaylist[0];
            }

            dispatch(setCurrentSong(nextSong));
            dispatch(addToQueue(nextSong));
        });
    }, [currentPlaying]);

    const onPrev = () => {
        const currentIndex = currentPlaylist.findIndex(x => x.pbId === currentPlaying.pbId);
        const prev = currentPlaylist[currentIndex - 1];
        dispatch(setCurrentSong(prev));
        dispatch(addToQueue(prev));
    };

    const onNext = () => {
        const currentIndex = currentPlaylist.findIndex(x => x.pbId === currentPlaying.pbId);
        let next = {};
        if (currentPlaylist[currentIndex + 1]) {
            next = currentPlaylist[currentIndex + 1];
        } else if (list) {
            const listIndex = list.findIndex(x => x.pbId === currentPlaying.pbId);
            next = list[listIndex + 1] ? list[listIndex + 1] : list[0];
        } else {
            next = currentPlaylist[0];
        }

        dispatch(setCurrentSong(next));
        dispatch(addToQueue(next));
    };

    const shareSongId = uuid();

    const openShareModal = () => {
        setShareItem(currentPlaying);
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
        }).then(res => {
            setShareSongLinkCopied(true);
        });
    };

    const goToSongPage = (id, title) => {
        const titleUrl = title.split(' ').join('-');
        window.location = `/song/${id}-${titleUrl}`;
    };

    const goToArtistPage = name => {
        const titleUrl = name
            .toLowerCase()
            .split(' ')
            .join('-');
        window.location = `/artist/${titleUrl}`;
    };

    return (
        <>
            <div className="music-player">
                <div className="music-player__section music-player__section--controls">
                    <img
                        src="/assets/images/player/prev.png"
                        className="music-player__section--controls-button"
                        onClick={() => onPrev()}
                    />
                    <img
                        src={`/assets/images/player/${isPlaying ? 'pause' : 'play'}.png`}
                        className="music-player__section--controls-button"
                        onClick={() => (isPlaying ? pauseSong() : playSong())}
                    />
                    <img
                        src="/assets/images/player/next.png"
                        className="music-player__section--controls-button"
                        onClick={() => onNext()}
                    />
                    <audio ref={musicPlayer} />
                </div>
                <div className="music-player__section music-player__section--content">
                    <div className="music-player__section--content__song">
                        <img src={currentPlaying.cover} className="music-player__section--content__song-image" />
                        <div
                            className="music-player__section--content__song__details"
                            onMouseEnter={() => handleSongHover()}
                            onMouseLeave={() => setSongHovered(false)}
                        >
                            <p
                                className="music-player__section--content__song__details-title"
                                onClick={() => goToSongPage(currentPlaying.pbId, currentPlaying.title)}
                            >
                                {currentPlaying.title}
                            </p>
                            {songHovered && (
                                <p
                                    className="music-player__section--content__song__details-author music-player__section--content__song__details-author--inline"
                                    onClick={() => goToArtistPage(currentPlaying.artistName)}
                                >
                                    by {currentPlaying.artistName}
                                </p>
                            )}
                            {!songHovered && (
                                <div className="music-player__section--content__song__details">
                                    <p className="music-player__section--content__song__details-author">
                                        by {currentPlaying.artistName}
                                    </p>
                                    <p className="music-player__section--content__song__details-duration">
                                        {_formatTime(duration)}
                                    </p>
                                </div>
                            )}
                            {songHovered && (
                                <div className="music-player__section--content__song__details">
                                    <div className="music-player__section--content__song__details-progress">
                                        <Slider
                                            min={0}
                                            max={duration}
                                            value={elapsed}
                                            step={0.0001}
                                            onChange={val => updateElapsedTime(val)}
                                        />
                                    </div>
                                    <p className="music-player__section--content__song__details-duration">
                                        {_formatTime(elapsed)} <span>/ {_formatTime(duration)}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="music-player__section--content__actions">
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
                            }}
                        />
                        <SimilarSvg
                            className="music-player__section--content__actions-button"
                            onClick={() => {
                                setSimilarOpened(!similarOpened);
                                dispatch(setState('similarOpened', !similarOpened));
                            }}
                        />
                        <ShareSvg
                            className="music-player__section--content__actions-button"
                            onClick={() => openShareModal()}
                        />
                        <Button className="music-player__section--content__actions-license" width={80} height={40}>
                            License
                        </Button>
                    </div>
                </div>
                <div className="music-player__section music-player__section--extra">
                    <div
                        className="music-player__section--extra-button"
                        onClick={() => {
                            setQueueOpened(!queueOpened);
                            dispatch(setState('queueOpened', !queueOpened));
                        }}
                    />
                </div>
            </div>
            <QueuePanel visible={queueOpened} onClose={() => setQueueOpened(false)} />
            <SimilarSongsPanel
                visible={similarOpened}
                onClose={() => setSimilarOpened(false)}
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
};

MusicPlayer.displayName = 'MusicPlayer';

export default memo(MusicPlayer);
