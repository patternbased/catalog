import React, { memo, useState, useRef, useEffect } from 'react';
import Slider from 'rc-slider';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';

import Button from 'components/button';
import QueuePanel from 'components/queue';
import SimilarSongsPanel from 'components/similar-songs';

import { setState } from 'actions/general';
import { addToQueue, setCurrentSong } from 'actions/library';

import './style.scss';

/**
 * Music Player component
 * @returns {React.Component}
 */
function MusicPlayer() {
    const [currentPlaying, setCurrentPlaying] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songHovered, setSongHovered] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(null);
    const [queueOpened, setQueueOpened] = useState(false);
    const [similarOpened, setSimilarOpened] = useState(false);
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
            const nextSong = currentPlaylist[currentIndex + 1];
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
        const next = currentPlaylist[currentIndex + 1];
        dispatch(setCurrentSong(next));
        dispatch(addToQueue(next));
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
                            <p className="music-player__section--content__song__details-title">
                                {currentPlaying.title}
                            </p>
                            {songHovered && (
                                <p className="music-player__section--content__song__details-author music-player__section--content__song__details-author--inline">
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
                        <div
                            className="music-player__section--content__actions-button music-player__section--content__actions-button--similar"
                            onClick={() => {
                                setSimilarOpened(!similarOpened);
                                dispatch(setState('similarOpened', !similarOpened));
                            }}
                        />
                        <div className="music-player__section--content__actions-button music-player__section--content__actions-button--share" />
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

MusicPlayer.displayName = 'MusicPlayer';

export default memo(MusicPlayer);
