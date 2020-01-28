/* eslint-disable max-lines-per-function */
import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import classnames from 'classnames';
import { setState } from 'actions/general';
import { getSongList, setCurrentSong } from 'actions/library';

import Button from 'components/button';
import SongsTable from 'components/songs-table';
import MusicPlayer from 'components/music-player';

import { TABLE_FLOW_SHAPES } from 'utils/constants';

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

import './style.scss';

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
    const [songClicked, setSongClicked] = useState(false);

    const songList = useSelector(selectors.library.getAll);
    const filtersPanelState = useSelector(selectors.general.get('filtersOpened'));
    const presetsPanelState = useSelector(selectors.general.get('presetsOpened'));
    const currentSong = useSelector(selectors.library.getCurrentSong);

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
            const songData = songList.find(song => song.pbId === songId);
            if (songData) {
                setSong(songData);
                if (songData.altVersions) {
                    const altSongs = [];
                    songData.altVersions.map(version => {
                        const altSong = songList.find(song => song.pbId === version);
                        altSong && altSongs.push(altSong);
                    });
                    setAltVersions(altSongs);
                }
                const similar = _getSimilarSongs(songList, songData);
                similar && setSimilarTracks(similar);
                const songMoodGenre = [];
                songData.genre.length && songMoodGenre.push(songData.genre);
                songData.primaryMood.length && songMoodGenre.push(songData.primaryMood);
                songData.secondaryMoods.length && songData.secondaryMoods.map(mood => songMoodGenre.push(mood));
                setSongMoods(songMoodGenre.join(', '));
            }
        }
    }, [songId, songList]);

    const playSong = (val = song) => {
        dispatch(setCurrentSong(val));
        setSongClicked(true);
    };

    return (
        <div className={songClass}>
            {song && (
                <main className="song">
                    <div className="song__section">
                        <div className="song__column">
                            <div
                                className="song__cover"
                                onMouseEnter={() => setCoverHover(true)}
                                onMouseLeave={() => setCoverHover(false)}
                            >
                                {coverHover && (
                                    <div className="song__cover__overlay" onClick={() => playSong()}>
                                        <PlaySvg />
                                    </div>
                                )}
                                <img src={song.image} alt={`${song.title} by ${song.artistName}`} />
                            </div>
                            <div className="song__column__row-header">
                                <div className="song__column__row-header__overlay" />
                                Writers
                            </div>
                            <div className="song__column__row-content">
                                {song.writers.map((writer, index) => (
                                    <div className="song__column__writer" key={index}>
                                        <img src={song.cover} alt={writer} />
                                        {writer}
                                    </div>
                                ))}
                            </div>
                            <div className="song__column__row-header">
                                <div className="song__column__row-header__overlay" />
                                Album
                            </div>
                            <div className="song__column__row-content">
                                <img src={song.cover} alt={song.albumTitle} />
                                <div className="song__column__album-title">
                                    <em>{song.albumTitle}&nbsp;</em>({song.dateReleased.split('-')[0]})
                                </div>
                            </div>
                        </div>
                        <div className="song__column">
                            <div className="song__title">{song.title}</div>
                            <div className="song__artist">by {song.artistName}</div>
                            <div className="song__actions">
                                <PianoSvg />
                                <SimilarIcon />
                                <ShareIcon />
                                <Button className="song__actions-license" width={100} height={36}>
                                    License
                                </Button>
                            </div>
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
                                    <div className="song__attributes__key">Rhythm</div>
                                    <div className="song__attributes__value">
                                        {song.rhythm}
                                        <span>/10</span>
                                    </div>
                                </div>
                                <div className="song__attributes__single">
                                    <div className="song__attributes__key">Speed</div>
                                    <div className="song__attributes__value">
                                        {song.speed}
                                        <span>/10</span>
                                    </div>
                                </div>
                                <div className="song__attributes__single">
                                    <div className="song__attributes__key">Experimental</div>
                                    <div className="song__attributes__value">
                                        {song.experimental}
                                        <span>/10</span>
                                    </div>
                                </div>
                                <div className="song__attributes__single">
                                    <div className="song__attributes__key">Mood</div>
                                    <div className="song__attributes__value">
                                        {song.mood}
                                        <span>/10</span>
                                    </div>
                                </div>
                                <div className="song__attributes__single">
                                    <div className="song__attributes__key">Grid</div>
                                    <div className="song__attributes__value">
                                        {song.grid}
                                        <span>/10</span>
                                    </div>
                                </div>
                                <div className="song__attributes__single">
                                    <div className="song__attributes__key">Flow</div>
                                    <div className="song__attributes__value">
                                        {TABLE_FLOW_SHAPES.find(
                                            x => x.name.toLowerCase() === song.arc.toLowerCase()
                                        ) && (
                                            <img
                                                src={
                                                    TABLE_FLOW_SHAPES.find(
                                                        x => x.name.toLowerCase() === song.arc.toLowerCase()
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
                                        <span>Instruments</span>
                                        {song.instruments.join(', ')}
                                    </div>
                                </div>
                                <div className="song__instruments">
                                    <div className="song__instruments__border" />
                                    <div className="song__instruments__content">
                                        <span>Genres/Mood</span>
                                        {songMoods}
                                    </div>
                                </div>
                            </div>
                            <div className="song__media">
                                <BandcampSvg />
                                <SpotifySvg />
                                <AppleSvg />
                                <ITunesSvg />
                                <SoundCloudSvg />
                                <GooglePlaySvg />
                                <VimeoSvg />
                            </div>
                        </div>
                    </div>
                    {altVersions && (
                        <div className="song__section">
                            <div className="song__table">
                                <div className="song__table__title">Alternative Versions of this Track</div>
                            </div>
                        </div>
                    )}
                    <div className="song__section song__section--banner">
                        <div className="song__banner">
                            <img src={song.cover} alt={song.artistName} />
                            <div>
                                <div className="song__banner__artist">{song.artistName}</div>
                                <div className="song__banner__description">{song.description}</div>
                                <Button className="song__banner__button" width={260} height={40}>
                                    MORE FROM THIS ARTIST
                                </Button>
                            </div>
                        </div>
                    </div>
                    {similarTracks && (
                        <div className="song__section">
                            <div className="song__table">
                                <div className="song__table__header">
                                    <div className="song__table__title">You May Also Like</div>
                                    <Button width={222} height={42}>
                                        SEE ALL SIMILAR TRACKS
                                    </Button>
                                </div>
                                <SongsTable list={similarTracks} onSelect={val => playSong(val)} page="home" />
                            </div>
                        </div>
                    )}
                </main>
            )}
            {songClicked && currentSong && <MusicPlayer />}
        </div>
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
        .filter(song => song.mood >= current.mood - 2 && song.mood <= current.mood + 2 && current.pbId !== song.pbId)
        .slice(0, 6);
}

SongPage.displayName = 'SongPage';

export default SongPage;
