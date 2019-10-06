import React, { memo, useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';

import Button from 'components/button';

import './style.scss';

/**
 * Music Player component
 * @param {String} song url of the song to play
 * @returns {React.Component}
 */
function MusicPlayer({ song }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [songHovered, setSongHovered] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(null);

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
        musicPlayer.current.src = song;
        musicPlayer.current.play();
        setIsPlaying(true);
        musicPlayer.current.addEventListener('timeupdate', e => {
            setElapsed(e.target.currentTime);
        });
        musicPlayer.current.addEventListener('playing', e => {
            setDuration(e.target.duration);
        });
    }, [song]);

    return (
        <div className="music-player">
            <div className="music-player__section music-player__section--controls">
                <img src="/assets/images/player/prev.png" className="music-player__section--controls-button" />
                {isPlaying ? (
                    <img
                        src="/assets/images/player/pause.png"
                        className="music-player__section--controls-button"
                        onClick={() => pauseSong()}
                    />
                ) : (
                    <img
                        src="/assets/images/player/play.png"
                        className="music-player__section--controls-button"
                        onClick={() => playSong()}
                    />
                )}
                <img src="/assets/images/player/next.png" className="music-player__section--controls-button" />
                <audio ref={musicPlayer} />
            </div>
            <div className="music-player__section music-player__section--content">
                <div className="music-player__section--content__song">
                    <img src="/assets/images/player/play.png" className="music-player__section--content__song-image" />
                    <div
                        className="music-player__section--content__song__details"
                        onMouseEnter={() => handleSongHover()}
                        onMouseLeave={() => setSongHovered(false)}
                    >
                        <p className="music-player__section--content__song__details-title">Distance</p>
                        {songHovered && (
                            <p className="music-player__section--content__song__details-author music-player__section--content__song__details-author--inline">
                                by Joseph Minadeo
                            </p>
                        )}
                        {!songHovered && (
                            <div className="music-player__section--content__song__details">
                                <p className="music-player__section--content__song__details-author">
                                    by Joseph Minadeo
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
                    <div className="music-player__section--content__actions-button music-player__section--content__actions-button--similar" />
                    <div className="music-player__section--content__actions-button music-player__section--content__actions-button--share" />
                    <Button className="music-player__section--content__actions-license" width={80} height={40}>
                        License
                    </Button>
                </div>
            </div>
            <div className="music-player__section music-player__section--extra">
                <div className="music-player__section--extra-button" />
            </div>
        </div>
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
    song: PropTypes.string.isRequired,
};

MusicPlayer.displayName = 'MusicPlayer';

export default memo(MusicPlayer);
