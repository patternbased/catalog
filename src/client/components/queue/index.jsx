/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { setState } from 'actions/general';
import { removeFromQueue, reorderQueue } from 'actions/library';

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

    const songWrapperClass = index =>
        classnames('queue__song', {
            'queue__song--hovered': checkIfHovered(index),
            'queue__song--expanded': checkIfExpanded(index),
        });

    const removeSongFromQueue = song => {
        dispatch(removeFromQueue(song));
    };

    const onDragEnd = result => {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        reorder(songs, result.source.index, result.destination.index);
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = [...list];
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        dispatch(reorderQueue(result));
    };

    return (
        <div className={panelClass} style={style}>
            <div className="queue__header">
                <img src="/assets/images/close-icon.png" onClick={() => closeQueue()} />
                <div className="queue__header__name">QUEUE</div>
                <img src="/assets/images/more-icon.png" onClick={() => {}} />
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="list">
                    {provided => (
                        <div className="queue__content" ref={provided.innerRef} {...provided.droppableProps}>
                            {songs.map((song, index) => (
                                <Draggable
                                    key={song.name || song.pbId}
                                    draggableId={song.name || song.pbId}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <div
                                                key={index}
                                                className={songWrapperClass(index)}
                                                onMouseOver={() => addToHovered(index)}
                                                onMouseLeave={() => removeFromHovered(index)}
                                            >
                                                {song.name ? (
                                                    <>
                                                        {checkIfHovered(index) && (
                                                            <img
                                                                src="/assets/images/queue/handle.png"
                                                                className="queue__song__handle"
                                                            />
                                                        )}
                                                        <img
                                                            src="/assets/images/queue/stack.png"
                                                            className="queue__song__cover"
                                                        />
                                                        <div
                                                            className={
                                                                checkIfHovered(index)
                                                                    ? 'queue__song__wrapper queue__song__wrapper--hovered'
                                                                    : 'queue__song__wrapper'
                                                            }
                                                        >
                                                            <div
                                                                className="queue__song__name"
                                                                dangerouslySetInnerHTML={{ __html: song.name }}
                                                            ></div>
                                                            <div className="queue__song__count">
                                                                {song.list.length} Tracks
                                                            </div>
                                                        </div>
                                                        {checkIfHovered(index) && (
                                                            <>
                                                                <img
                                                                    src="/assets/images/queue/delete.png"
                                                                    className="queue__song__delete"
                                                                    onClick={() => removeSongFromQueue(song)}
                                                                />
                                                                <div
                                                                    className="queue__song__more"
                                                                    onClick={() => addToExpanded(index)}
                                                                >
                                                                    {checkIfExpanded(index) ? '' : '+'}
                                                                </div>
                                                            </>
                                                        )}
                                                        {checkIfExpanded(index) && (
                                                            <div
                                                                className="queue__song__more"
                                                                onClick={() => addToExpanded(index)}
                                                            >
                                                                -
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    _renderQueueSong(song, currentSong, checkIfHovered(index), () =>
                                                        removeSongFromQueue(song)
                                                    )
                                                )}
                                            </div>
                                            {checkIfExpanded(index) && (
                                                <div className="queue__sublist">
                                                    {song.list.map((song, index) => (
                                                        <div
                                                            key={index}
                                                            className={songWrapperClass(`sublist-${index}`)}
                                                            onMouseOver={() => addToHovered(`sublist-${index}`)}
                                                            onMouseLeave={() => removeFromHovered(`sublist-${index}`)}
                                                        >
                                                            {_renderQueueSong(
                                                                song,
                                                                currentSong,
                                                                checkIfHovered(`sublist-${index}`),
                                                                () => removeSongFromQueue(song)
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

/**
 * Renders the songs in the queue
 * @param {Object} song song to render
 * @param {Object} current current song playing
 * @param {Boolean} hovered song hovered
 * @returns {React.Component}
 */
function _renderQueueSong(song, current, hovered, onRemove) {
    return (
        <>
            {hovered && <img src="/assets/images/queue/handle.png" className="queue__song__handle" />}
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
            {hovered && (
                <img
                    src="/assets/images/queue/delete.png"
                    className="queue__song__delete queue__song__delete--single"
                    onClick={onRemove}
                />
            )}
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
