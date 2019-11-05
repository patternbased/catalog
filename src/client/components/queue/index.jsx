/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import selectors from 'selectors';

import { setState } from 'actions/general';

import './style.scss';

/**
 * Queue panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function QueuePanel({ visible, style, onClose }) {
    const songs = useSelector(selectors.library.getQueue);
    const currentSong = useSelector(selectors.library.getCurrentSong);
    const [hovered, setHovered] = useState([]);
    const [listExpanded, setListExpanded] = useState([]);
    const dispatch = useDispatch();
    const panelClass = useMemo(
        () =>
            classnames('queue', {
                'queue--visible': visible,
            }),
        [visible]
    );

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

    const closeQueue = () => {
        dispatch(setState('queueOpened', false));
        onClose();
    };

    return (
        <div className={panelClass} style={style}>
            <div className="queue__header">
                <div className="queue__header__close" onClick={() => closeQueue()}>
                    X
                </div>
                <div className="queue__header__name">QUEUE</div>
                <div className="queue__header__more">
                    •<br />•<br />•
                </div>
            </div>
            <div className="queue__content">
                {songs.map((song, index) => (
                    <>
                        <div key={index} className="queue__song" onMouseOver={() => addToHovered(index)}>
                            {song.name ? (
                                <>
                                    <img src="/assets/images/table/results-play.png" className="queue__song__cover" />
                                    <div className="queue__song__wrapper">
                                        <div className="queue__song__name">{song.name}</div>
                                        <div className="queue__song__count">{song.list.length} Tracks</div>
                                    </div>
                                    {checkIfHovered(index) && (
                                        <div className="queue__song__more" onClick={() => addToExpanded(index)}>
                                            {checkIfExpanded(index) ? '-' : '+'}
                                        </div>
                                    )}
                                </>
                            ) : (
                                _renderQueueSong(song, currentSong)
                            )}
                        </div>
                        {checkIfExpanded(index) && (
                            <div className="queue__sublist">
                                {song.list.map((song, index) => (
                                    <div className="queue__song" key={index}>
                                        {_renderQueueSong(song, currentSong)}
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
function _renderQueueSong(song, current) {
    return (
        <>
            <img
                src={current === song ? '/assets/images/table/play-active.svg' : song.cover}
                className="queue__song__cover"
            />
            <div className="queue__song__wrapper">
                <div
                    className={current === song ? 'queue__song__title queue__song__title--blue' : 'queue__song__title'}
                >
                    {song.title}
                </div>
                <div
                    className={
                        current === song ? 'queue__song__artist queue__song__artist--blue' : 'queue__song__artist'
                    }
                >
                    by {song.artistName} | {song.length}
                </div>
            </div>
        </>
    );
}

QueuePanel.displayName = 'QueuePanel';

QueuePanel.propTypes = {
    visible: PropTypes.bool,
    style: PropTypes.object,
    onClose: PropTypes.func,
};

QueuePanel.defaultProps = {
    visible: false,
    style: {},
    onClose: () => {},
};

export default memo(QueuePanel);
