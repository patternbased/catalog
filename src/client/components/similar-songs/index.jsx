/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import selectors from 'selectors';

import { setState } from 'actions/general';
import { setCurrentSong } from 'actions/library';

import './style.scss';

/**
 * Similar songs panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function SimilarSongsPanel({ visible, style, onClose, similarTo }) {
    const allSongs = useSelector(selectors.library.getAll);
    const queueOpened = useSelector(selectors.general.get('queueOpened'));
    const [hovered, setHovered] = useState([]);
    const [similarSongs, setSimilarSongs] = useState([]);
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

    return (
        <div className={panelClass} style={style}>
            <div className="similar__header">
                <img src="/assets/images/close-icon.png" onClick={() => closeSimilar()} />
                <div className="similar__header__name">SIMILAR SONGS TO</div>
                <img src="/assets/images/more-icon.png" onClick={() => {}} />
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
                        <div className="similar__song__title">{similarTo.title}</div>
                        <div className="similar__song__artist">
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
                    >
                        {_renderSimilarSong(song, checkIfHovered(index), () => dispatch(setCurrentSong(song)))}
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Renders the songs in the queue
 * @param {Object} song song to render
 * @param {Boolean} hovered current song hovered
 * @param {Function} onPlay action when cover is clicked
 * @returns {React.Component}
 */
function _renderSimilarSong(song, hovered, onPlay) {
    return (
        <>
            <img
                src={hovered ? '/assets/images/similar/song-play.png' : song.cover}
                className="similar__song__cover"
                onClick={onPlay}
            />
            <div className="similar__song__wrapper">
                <div className="similar__song__title">{song.title}</div>
                <div className="similar__song__artist">
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
