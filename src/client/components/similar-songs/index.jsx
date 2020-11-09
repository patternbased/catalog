/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import uuid from 'react-uuid';
import { event } from 'react-ga';
import selectors from 'selectors';

import { setState } from 'actions/general';
import { addToQueue, setCurrentSong } from 'actions/library';

import Modal from 'components/modal';
import SongBy from 'components/song-by';

import ShareIcon from 'assets/images/share-icon-dark.svg';
import CopyLinkSvg from 'assets/images/copy-link.svg';
import DoneSvg from 'assets/images/done-check.svg';
import AddToQueueSvg from 'assets/images/add-to-queue.svg';

import './style.scss';

const baseUrl =
    process.env.NODE_ENV === 'production' ? 'https://catalog.patternbased.com' : 'https://patternbased.herokuapp.com/';

/**
 * Similar songs panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Function} onClose action for close
 * @param {Object} similarTo song for which to display similar list
 * @returns {React.Component}
 */
function SimilarSongsPanel({ visible, onClose, similarTo }) {
    const allSongs = useSelector(selectors.library.getAll);
    const queueOpened = useSelector(selectors.general.get('queueOpened'));
    const scrolled = useSelector(selectors.general.get('scrolled'));
    const appliedFilters = useSelector(selectors.filters.getApplied);
    const [hovered, setHovered] = useState([]);
    const [similarSongs, setSimilarSongs] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [shareOpened, setShareOpened] = useState(false);
    const [shareItem, setShareItem] = useState();
    const [shareSongLinkCopied, setShareSongLinkCopied] = useState(false);
    const [wasScrolled, setWasScrolled] = useState(scrolled);
    const dispatch = useDispatch();
    const panelClass = useMemo(
        () =>
            classnames('similar', {
                'similar--visible': visible,
                'similar--pushed': visible && queueOpened,
                'similar--big-header': !wasScrolled && visible,
                'similar--small-header': wasScrolled && visible,
            }),
        [visible, queueOpened, wasScrolled]
    );

    useEffect(() => {
        setWasScrolled(scrolled);
    }, [scrolled]);

    useEffect(() => {
        let similar = [];
        if (allSongs && similarTo) {
            similar = _getSimilarSongs(allSongs, similarTo);
        }
        setSimilarSongs(similar);
    }, [similarTo]);

    const addToHovered = (index) => {
        let copyHovered = [...hovered];
        copyHovered.push(index);
        setHovered(copyHovered);
    };

    const removeFromHovered = (index) => {
        let copyHovered = [...hovered];
        setHovered(copyHovered.filter((x) => x !== index));
    };

    const checkIfHovered = useCallback(
        (index) => {
            return hovered.includes(index);
        },
        [hovered]
    );

    const closeSimilar = () => {
        dispatch(setState('similarOpened', false));
        onClose();
    };

    const mainHoverClass = useMemo(
        () =>
            classnames('similar__song similar__song--main', {
                'similar__song--main-hovered': checkIfHovered('main'),
            }),
        [hovered]
    );

    const openShareModal = () => {
        setShareItem(similarTo);
        setShareOpened(true);
    };

    const shareSongId = uuid();

    const copyShareSongLink = () => {
        const shareData = {
            name: shareItem.title,
            type: 'similar',
            songs: similarSongs.map((s) => s.pbId),
            shareId: shareSongId,
            filters: appliedFilters,
        };
        fetch('/api/create-share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: shareData }),
        }).then((res) => {
            setShareSongLinkCopied(true);
            event({
                category: 'Similar songs panel',
                action: 'Share song clicked',
                label: `Share song for ${shareItem.title}`,
            });
        });
    };

    return (
        <div className={panelClass}>
            {similarTo && (
                <>
                    <div className="similar__header">
                        <img src="/assets/images/close-icon.png" onClick={() => closeSimilar()} />
                        <div className="similar__header__name">SIMILAR SONGS TO</div>
                        <img src="/assets/images/more-icon.png" onClick={() => setShowMore(!showMore)} />
                        {showMore && (
                            <ul className="queue__more">
                                <li
                                    className="queue__more__item"
                                    onClick={() => {
                                        openShareModal();
                                        setShowMore(false);
                                    }}
                                >
                                    <ShareIcon />
                                    Share This List
                                </li>
                            </ul>
                        )}
                    </div>

                    <div
                        className={mainHoverClass}
                        onMouseEnter={() => addToHovered('main')}
                        onMouseLeave={() => removeFromHovered('main')}
                    >
                        <div className="similar__song__cover">
                            <img src={similarTo.cover} />
                        </div>
                        <div className="similar__song__wrapper">
                            <Link
                                to={
                                    Object.keys(similarTo).length > 0
                                        ? `/song/${similarTo.pbId}-${similarTo.title
                                              .toLowerCase()
                                              .split(' ')
                                              .join('-')}`
                                        : ''
                                }
                            >
                                <div className="similar__song__title">{similarTo.title}</div>
                            </Link>
                            <Link
                                to={
                                    Object.keys(similarTo).length > 0
                                        ? `/project/${similarTo.artistName.toLowerCase().split(' ').join('-')}`
                                        : ''
                                }
                            >
                                <div className="similar__song__artist">
                                    <SongBy project={similarTo.artistName} feat={similarTo.featArtist} /> |{' '}
                                    {similarTo.length}
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="similar__content">
                        {similarSongs.map((song, index) => (
                            <div
                                key={index}
                                className={
                                    checkIfHovered(index) ? 'similar__song similar__song--blue' : 'similar__song'
                                }
                                onMouseOver={() => addToHovered(index)}
                                onMouseOut={() => removeFromHovered(index)}
                            >
                                {_renderSimilarSong(song, checkIfHovered(index), () => {
                                    dispatch(setCurrentSong(song));
                                    dispatch(addToQueue(song));
                                    event({
                                        category: 'Similar songs panel',
                                        action: 'Play song clicked',
                                        label: `Play ${song.title}`,
                                    });
                                })}
                                <AddToQueueSvg
                                    onClick={() => {
                                        dispatch(addToQueue(song));
                                        event({
                                            category: 'Similar songs panel',
                                            action: 'Add to Queue clicked',
                                            label: `Add to Queue ${song.title}`,
                                        });
                                    }}
                                    className="similar__song__add-to-queue"
                                />
                            </div>
                        ))}
                    </div>
                    {shareOpened && (
                        <Modal opened={shareOpened} modifier="share queue-share">
                            <img
                                src="/assets/images/close-icon.png"
                                onClick={() => setShareOpened(false)}
                                className="share__close"
                            />
                            <div className="share__header">Share This List</div>
                            <div className="share__item">
                                <img src={shareItem.cover} />
                                <div>
                                    <div className="share__item__title">
                                        <strong>Similar Songs to</strong>&nbsp;
                                        {shareItem.title}
                                    </div>
                                    <div className="share__item__artist">{similarSongs.length} Tracks</div>
                                </div>
                            </div>
                            <CopyToClipboard
                                text={`${baseUrl}?shareId=${shareSongId}`}
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
            )}
        </div>
    );
}

/**
 * Renders the songs in the queue
 * @param {Object} song song to render
 * @param {Boolean} hovered current song hovered
 * @param {Function} playSimilarSong action for clicking on song image
 * @returns {React.Component}
 */
function _renderSimilarSong(song, hovered, playSimilarSong) {
    return (
        <>
            <img
                src={hovered ? '/assets/images/similar/song-play.png' : song.cover}
                className="similar__song__cover"
                onClick={() => playSimilarSong()}
            />
            <div className="similar__song__wrapper">
                <Link
                    to={
                        Object.keys(song).length > 0
                            ? `/song/${song.pbId}-${song.title.toLowerCase().split(' ').join('-')}`
                            : ''
                    }
                >
                    <div className="similar__song__title">{song.title}</div>
                </Link>

                <div className="similar__song__artist">
                    <SongBy project={song.artistName} feat={song.featArtist} /> | {song.length}
                </div>
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
    const similarSongs = [];
    // SimilarPBTracks column in the database
    if (current.similarTracks && current.similarTracks.length) {
        current.similarTracks.map((song) => {
            const found = all.find((s) => s.title.toLowerCase().trim === song.toLowerCase().trim());
            if (found) {
                similarSongs.push({ ...found, priority: 1 });
            }
        });
    }
    // +/- 1.5 in all 5 categories ON THE SAME ALBUM and +/- 1.5 from entire catalog
    const catalogSimilar = all.filter(
        (song) =>
            current.pbId !== song.pbId &&
            (song.mood >= current.mood - 1.5 || song.mood <= current.mood + 1.5) &&
            (song.rhythm >= current.rhythm - 1.5 || song.rhythm <= current.rhythm + 1.5) &&
            (song.speed >= current.speed - 1.5 || song.speed <= current.speed + 1.5) &&
            (song.experimental >= current.experimental - 1.5 || song.experimental <= current.experimental + 1.5) &&
            (song.grid >= current.grid - 1.5 || song.grid <= current.grid + 1.5)
    );
    if (catalogSimilar.length) {
        catalogSimilar.map((s) => similarSongs.push({ ...s, priority: s.albumId === current.albumId ? 2 : 3 }));
    }
    // +/- 3 from entire catalog
    const catalogAlmostSimilar = all.filter(
        (song) =>
            current.pbId !== song.pbId &&
            (song.mood >= current.mood - 3 || song.mood <= current.mood + 3) &&
            (song.rhythm >= current.rhythm - 3 || song.rhythm <= current.rhythm + 3) &&
            (song.speed >= current.speed - 3 || song.speed <= current.speed + 3) &&
            (song.experimental >= current.experimental - 3 || song.experimental <= current.experimental + 3) &&
            (song.grid >= current.grid - 3 || song.grid <= current.grid + 3)
    );
    if (catalogAlmostSimilar.length) {
        catalogAlmostSimilar.map((s) => similarSongs.push({ ...s, priority: 4 }));
    }
    return similarSongs.sort(function (a, b) {
        return a.priority - b.priority;
    });
}

SimilarSongsPanel.displayName = 'SimilarSongsPanel';

SimilarSongsPanel.propTypes = {
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    onClose: PropTypes.func,
    similarTo: PropTypes.object,
};

SimilarSongsPanel.defaultProps = {
    visible: false,
    onClose: () => {},
    similarTo: {},
};

export default memo(SimilarSongsPanel);
