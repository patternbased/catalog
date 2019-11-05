/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import selectors from 'selectors';

import { setState } from 'actions/general';

import './style.scss';

/**
 * Similar songs panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function SimilarSongsPanel({ visible, style, onClose }) {
    const allSongs = useSelector(selectors.library.getAll);
    const currentSong = useSelector(selectors.library.getCurrentSong);
    const queueOpened = useSelector(selectors.general.get('queueOpened'));
    const [hovered, setHovered] = useState([]);
    const [listExpanded, setListExpanded] = useState([]);
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
        if (allSongs && currentSong) {
            similar = _getSimilarSongs(allSongs, currentSong);
        }
        setSimilarSongs(similar);
    }, [currentSong]);

    const addToHovered = index => {
        let copyHovered = [...hovered];
        copyHovered.push(index);
        setHovered(copyHovered);
    };

    const addToExpanded = index => {
        let copyExpanded = [...listExpanded];
        if (checkIfExpanded(index)) {
            setListExpanded(copyExpanded.filter(x => x !== index));
        } else {
            copyExpanded.push(index);
            setListExpanded(copyExpanded);
        }
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

    const checkIfExpanded = useCallback(
        index => {
            return listExpanded.includes(index);
        },
        [listExpanded]
    );

    const closeSimilar = () => {
        dispatch(setState('similarOpened', false));
        onClose();
    };

    return (
        <div className={panelClass} style={style}>
            <div className="similar__header">
                <div className="similar__header__close" onClick={() => closeSimilar()}>
                    X
                </div>
                <div className="similar__header__name">SIMILAR SONGS TO</div>
                <div className="similar__header__more">
                    •<br />•<br />•
                </div>
            </div>
            {currentSong && (
                <div className="similar__song similar__song--main">
                    <img src={currentSong.cover} className="similar__song__cover" />
                    <div className="similar__song__wrapper">
                        <div className="similar__song__title">{currentSong.title}</div>
                        <div className="similar__song__artist">
                            by {currentSong.artistName} | {currentSong.length}
                        </div>
                    </div>
                </div>
            )}
            <div className="similar__content">
                {similarSongs.map((song, index) => (
                    <>
                        <div key={index} className="similar__song" onMouseOver={() => addToHovered(index)}>
                            {song.name ? (
                                <>
                                    <img src="/assets/images/table/results-play.png" className="similar__song__cover" />
                                    <div className="similar__song__wrapper">
                                        <div className="similar__song__name">{song.name}</div>
                                        <div className="similar__song__count">{song.list.length} Tracks</div>
                                    </div>
                                    {checkIfHovered(index) && (
                                        <div className="similar__song__more" onClick={() => addToExpanded(index)}>
                                            {checkIfExpanded(index) ? '-' : '+'}
                                        </div>
                                    )}
                                </>
                            ) : (
                                _renderSimilarSong(song, currentSong)
                            )}
                        </div>
                        {checkIfExpanded(index) && (
                            <div className="similar__sublist">
                                {song.list.map((song, index) => (
                                    <div className="similar__song" key={index}>
                                        {_renderSimilarSong(song, currentSong)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ))}
            </div>
        </div>
    );
}

/**
 * Renders the songs in the queue
 * @param {Object} song song to render
 * @param {Object} current current song playing
 * @returns {React.Component}
 */
function _renderSimilarSong(song, current) {
    return (
        <>
            <img
                src={current === song ? '/assets/images/table/play-active.svg' : song.cover}
                className="similar__song__cover"
            />
            <div className="similar__song__wrapper">
                <div
                    className={
                        current === song ? 'similar__song__title similar__song__title--blue' : 'similar__song__title'
                    }
                >
                    {song.title}
                </div>
                <div
                    className={
                        current === song ? 'similar__song__artist similar__song__artist--blue' : 'similar__song__artist'
                    }
                >
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
};

SimilarSongsPanel.defaultProps = {
    visible: false,
    style: {},
    onClose: () => {},
};

export default memo(SimilarSongsPanel);
