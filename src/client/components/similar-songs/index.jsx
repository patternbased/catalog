/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import uuid from 'react-uuid';
import selectors from 'selectors';

import { setState } from 'actions/general';
import { addToQueue, setCurrentSong } from 'actions/library';

import Modal from 'components/modal';

import ShareIcon from 'assets/images/share-icon-dark.svg';
import CopyLinkSvg from 'assets/images/copy-link.svg';
import DoneSvg from 'assets/images/done-check.svg';

import './style.scss';

const baseUrl =
    process.env.NODE_ENV === 'production' ? 'https://catalog.patternbased.com' : 'https://patternbased.herokuapp.com/';

/**
 * Similar songs panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function SimilarSongsPanel({ visible, style, onClose, similarTo }) {
    const allSongs = useSelector(selectors.library.getAll);
    const queueOpened = useSelector(selectors.general.get('queueOpened'));
    const appliedFilters = useSelector(selectors.filters.getApplied);
    const [hovered, setHovered] = useState([]);
    const [similarSongs, setSimilarSongs] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [shareOpened, setShareOpened] = useState(false);
    const [shareItem, setShareItem] = useState();
    const [shareSongLinkCopied, setShareSongLinkCopied] = useState(false);
    const dispatch = useDispatch();
    const panelClass = useMemo(
        () =>
            classnames('similar', {
                'similar--visible': visible,
                'similar--pushed': visible && queueOpened,
            }),
        [visible, queueOpened]
    );

    useEffect(() => {
        let similar = [];
        if (allSongs && similarTo) {
            similar = _getSimilarSongs(allSongs, similarTo);
        }
        setSimilarSongs(similar);
    }, [similarTo]);

    const addToHovered = index => {
        let copyHovered = [...hovered];
        copyHovered.push(index);
        setHovered(copyHovered);
    };

    const removeFromHovered = index => {
        let copyHovered = [...hovered];
        setHovered(copyHovered.filter(x => x !== index));
    };

    const checkIfHovered = useCallback(
        index => {
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

    const playSimilarSong = song => {
        dispatch(setCurrentSong(song));
        dispatch(addToQueue(song));
    };

    const openShareModal = () => {
        setShareItem(similarTo);
        setShareOpened(true);
    };

    const shareSongId = uuid();

    const copyShareSongLink = () => {
        const shareData = {
            name: shareItem.title,
            type: 'similar',
            songs: similarSongs.map(s => s.pbId),
            shareId: shareSongId,
            filters: appliedFilters,
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
        <div className={panelClass} style={style}>
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
            {similarTo && (
                <div
                    className={mainHoverClass}
                    onMouseEnter={() => addToHovered('main')}
                    onMouseLeave={() => removeFromHovered('main')}
                >
                    <div className="similar__song__cover">
                        <img src={similarTo.cover} />
                    </div>
                    <div className="similar__song__wrapper">
                        <div
                            className="similar__song__title"
                            onClick={() => goToSongPage(similarTo.pbId, similarTo.title)}
                        >
                            {similarTo.title}
                        </div>
                        <div className="similar__song__artist" onClick={() => goToArtistPage(similarSongs.artistName)}>
                            by {similarTo.artistName} | {similarTo.length}
                        </div>
                    </div>
                </div>
            )}
            <div className="similar__content">
                {similarSongs.map((song, index) => (
                    <div
                        key={index}
                        className={checkIfHovered(index) ? 'similar__song similar__song--blue' : 'similar__song'}
                        onMouseOver={() => addToHovered(index)}
                        onMouseOut={() => removeFromHovered(index)}
                        onClick={() => playSimilarSong(song)}
                    >
                        {_renderSimilarSong(song, checkIfHovered(index))}
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
                                <strong>Simialr Songs to</strong>&nbsp;
                                {shareItem.title}
                            </div>
                            <div className="share__item__artist">{similarSongs.length} Tracks</div>
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
        </div>
    );
}

/**
 * Renders the songs in the queue
 * @param {Object} song song to render
 * @param {Boolean} hovered current song hovered
 * @returns {React.Component}
 */
function _renderSimilarSong(song, hovered) {
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
            <img src={hovered ? '/assets/images/similar/song-play.png' : song.cover} className="similar__song__cover" />
            <div className="similar__song__wrapper">
                <div className="similar__song__title" onClick={() => goToSongPage(song.pbId, song.title)}>
                    {song.title}
                </div>
                <div className="similar__song__artist" onClick={() => goToArtistPage(song.artistName)}>
                    by {song.artistName} | {song.length}
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
    return all.filter(
        song => song.mood >= current.mood - 2 && song.mood <= current.mood + 2 && current.pbId !== song.pbId
    );
}

SimilarSongsPanel.displayName = 'SimilarSongsPanel';

SimilarSongsPanel.propTypes = {
    visible: PropTypes.bool,
    style: PropTypes.object,
    onClose: PropTypes.func,
    similarTo: PropTypes.object.isRequired,
};

SimilarSongsPanel.defaultProps = {
    visible: false,
    style: {},
    onClose: () => {},
};

export default memo(SimilarSongsPanel);
