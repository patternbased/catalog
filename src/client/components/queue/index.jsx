/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import uuid from 'react-uuid';
import selectors from 'selectors';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { setState } from 'actions/general';
import { removeFromQueue, reorderQueue, setCurrentSong, clearQueue } from 'actions/library';
import Modal from 'components/modal';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import EditIconSvg from 'assets/images/edit-icon.svg';
import DeleteIcon from 'assets/images/delete-icon-dark.svg';
import ShareIcon from 'assets/images/share-icon-dark.svg';
import CopyLinkSvg from 'assets/images/copy-link.svg';
import DoneSvg from 'assets/images/done-check.svg';

import './style.scss';

const baseUrl =
    process.env.NODE_ENV === 'production' ? 'https://catalog.patternbased.com' : 'https://patternbased.herokuapp.com/';

/**
 * Queue panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function QueuePanel({ visible, style, onClose }) {
    const songs = useSelector(selectors.library.getQueue);
    const queueVisible = useSelector(selectors.general.get('queueOpened'));
    const currentSong = useSelector(selectors.library.getCurrentSong);
    const [hovered, setHovered] = useState([]);
    const [listExpanded, setListExpanded] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [shareOpened, setShareOpened] = useState(false);
    const [shareQueueName, setShareQueueName] = useState(_generateShareName());
    const [editedName, setEditedName] = useState('');
    const [nameEditing, setNameEditing] = useState(false);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const dispatch = useDispatch();
    const panelClass = useMemo(
        () =>
            classnames('queue', {
                'queue--visible': visible || queueVisible,
            }),
        [visible, queueVisible]
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

    const shareListId = uuid();

    const copyShareLink = () => {
        const shareData = {
            name: shareQueueName,
            type: 'queue',
            songs: songs.map(s => s.pbId),
            shareId: shareListId,
        };
        fetch('/api/create-share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: shareData }),
        }).then(res => {
            setShareLinkCopied(true);
        });
    };

    return (
        <div className={panelClass} style={style}>
            <div className="queue__header">
                <img
                    src="/assets/images/close-icon.png"
                    onClick={() => {
                        closeQueue();
                        setShowMore(false);
                    }}
                />
                <div className="queue__header__name">QUEUE</div>
                <img src="/assets/images/more-icon.png" onClick={() => setShowMore(!showMore)} />
                {showMore && (
                    <ul className="queue__more">
                        <li
                            className="queue__more__item"
                            onClick={() => {
                                setShareOpened(true);
                                setShowMore(false);
                            }}
                        >
                            <ShareIcon />
                            Share This Queue
                        </li>
                        <li
                            className="queue__more__item"
                            onClick={() => {
                                dispatch(clearQueue());
                                setShowMore(false);
                            }}
                        >
                            <DeleteIcon />
                            Delete All Tracks
                        </li>
                    </ul>
                )}
                {shareOpened && (
                    <Modal opened={shareOpened} modifier="share queue-share">
                        <img
                            src="/assets/images/close-icon.png"
                            onClick={() => setShareOpened(false)}
                            className="share__close"
                        />
                        <div className="share__header">Share This Queue</div>
                        <div className="share__item">
                            <img src="/assets/images/table/results-play.png" />
                            <div>
                                {nameEditing ? (
                                    <input
                                        type="text"
                                        className="share__input"
                                        placeholder={shareQueueName}
                                        value={editedName}
                                        onChange={e => setEditedName(e.target.value)}
                                    />
                                ) : (
                                    <div className="share__item__title" onClick={() => setNameEditing(true)}>
                                        {shareQueueName}
                                        <EditIconSvg fill={'#0092c5'} />
                                    </div>
                                )}
                                {!nameEditing && <div className="share__item__artist">{songs.length} Tracks</div>}
                            </div>
                        </div>
                        {nameEditing ? (
                            <div
                                className={classnames('share__button', {
                                    'share__button--disabled': editedName === '',
                                    'share__button--active': editedName.length,
                                })}
                                onClick={() => {
                                    if (editedName.length) {
                                        setShareQueueName(editedName);
                                        setNameEditing(false);
                                    }
                                }}
                            >
                                <DoneSvg />
                                Done
                            </div>
                        ) : (
                            <CopyToClipboard text={`${baseUrl}?shareId=${shareListId}`} onCopy={() => copyShareLink()}>
                                {shareLinkCopied ? (
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
                        )}
                    </Modal>
                )}
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
                                                    _renderQueueSong(
                                                        song,
                                                        currentSong,
                                                        checkIfHovered(index),
                                                        () => removeSongFromQueue(song),
                                                        () => dispatch(setCurrentSong(song))
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
                                                                () => removeSongFromQueue(song),
                                                                () => dispatch(setCurrentSong(song))
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
 * @param {Function} onRemove action when delete icon is clicked
 * @param {Function} playSong action when cover icon is clicked
 * @returns {React.Component}
 */
function _renderQueueSong(song, current, hovered, onRemove, playSong) {
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
            {hovered && <img src="/assets/images/queue/handle.png" className="queue__song__handle" />}
            <img
                src={current === song ? '/assets/images/table/play-active.svg' : song.cover}
                className="queue__song__cover"
                onClick={playSong}
            />
            <div className="queue__song__wrapper" onClick={() => goToSongPage(song.pbId, song.title)}>
                <div
                    className={current === song ? 'queue__song__title queue__song__title--blue' : 'queue__song__title'}
                >
                    {song.title}
                </div>
                <div
                    className={
                        current === song ? 'queue__song__artist queue__song__artist--blue' : 'queue__song__artist'
                    }
                    onClick={() => goToArtistPage(song.artistName)}
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

/**
 * Generates default random queue name for sharing
 * @returns {String}
 */
function _generateShareName() {
    const randomShareNumber = Math.floor(Math.random() * 1000000);
    return `Queue #${randomShareNumber}`;
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
