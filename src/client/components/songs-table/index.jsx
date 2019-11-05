/* eslint-disable max-lines-per-function */
import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { TABLE_FLOW_SHAPES } from 'utils/constants';
import Button from 'components/button';
import SimilarSongsPanel from 'components/similar-songs';
import classnames from 'classnames';
import selectors from 'selectors';
import { addToQueue, setCurrentSong } from 'actions/library';
import { setState } from 'actions/general';

import './style.scss';

const headers = ['SONG NAME / ARTIST NAME', 'FLOW', 'DURATION', 'KEY / BPM', 'RTM', 'SPD', 'EXP', 'MOD', 'GRD'];

/**
 * Songs table component
 * @param {Array} list list of song objects
 * @param {Function} onSelect action to take when selecting a song
 * @param {Number} currentSongIndex index of the current playing song
 * @returns {React.Component}
 */
function SongsTable({ list, onSelect, currentSongIndex }) {
    const [hovered, setHovered] = useState([]);
    const [similarOpened, setSimilarOpened] = useState(false);
    const appliedFilters = useSelector(selectors.filters.getApplied);
    const dispatch = useDispatch();

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

    const playSong = (item, index) => {
        onSelect(item);
        dispatch(setCurrentSong(item));
        dispatch(addToQueue(item));
        dispatch(addToQueue(list[index + 1]));
    };

    const getRowClass = index =>
        classnames('table__body__row', {
            'table__body__row--hovered': checkIfHovered(index),
        });

    const addListToQueue = () => {
        dispatch(addToQueue({ list: list, name: createPlaylistName() }));
    };

    const createPlaylistName = () => {
        return Object.keys(appliedFilters).map(filter => {
            return (
                filter.charAt(0).toUpperCase() +
                filter.substring(1) +
                appliedFilters[filter][0] +
                appliedFilters[filter][1]
            );
        });
    };

    return (
        <>
            <div className="table">
                {Object.keys(appliedFilters).length > 0 && (
                    <div className="table__filters">
                        <img
                            src="/assets/images/table/results-play.png"
                            className="table__filters__icon"
                            onClick={() => addListToQueue()}
                        />
                        <div className="table__filters__applied">
                            {Object.keys(appliedFilters).map((filter, index) => (
                                <div className="table__filters__applied__single" key={index}>
                                    <span className="table__filters__applied__single-bold">
                                        {filter.charAt(0).toUpperCase() + filter.substring(1)}
                                    </span>
                                    {`${appliedFilters[filter][0]}-${appliedFilters[filter][1]}`},
                                </div>
                            ))}
                            <div className="table__filters__applied__count">{list.length} Tracks</div>
                        </div>
                    </div>
                )}
                <div className="table__header">
                    {headers.map((item, index) => (
                        <div className="table__header__label" key={index}>
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
                <div className="table__body">
                    {list.map((item, index) => (
                        <div
                            className={getRowClass(index)}
                            style={{ backgroundColor: checkIfHovered(index) ? '#0092C5' : 'white' }}
                            key={index}
                            onMouseOver={() => addToHovered(index)}
                            onMouseOut={() => removeFromHovered(index)}
                        >
                            <>
                                <div className="table__body__row-title">
                                    <div className="table__body__row-title__container">
                                        <img
                                            src={
                                                checkIfHovered(index)
                                                    ? '/assets/images/table/play-btn.png'
                                                    : currentSongIndex === index
                                                    ? '/assets/images/table/play-active.svg'
                                                    : item.cover
                                            }
                                            onClick={() => playSong(item, index)}
                                        />
                                        <div className="table__body__row-title__wrapper">
                                            <p className="table__body__row-title__wrapper-song-title">
                                                {item.title} <span>by {item.artistName}</span>
                                            </p>
                                            <p className="table__body__row-title__wrapper-song-artist">
                                                <span className="table__body__row-title__wrapper-song-artist--name">
                                                    by {item.artistName}
                                                </span>
                                                <span className="table__body__row-title__wrapper-song-artist--description">
                                                    {`${item.description.substr(0, 150)}...`}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="table__body__row-title__actions">
                                        <div
                                            className="table__body__row-title__actions-button table__body__row-title__actions-button--similar"
                                            onClick={() => {
                                                setSimilarOpened(true);
                                                dispatch(setState('similarOpened', true));
                                            }}
                                        />
                                        <div className="table__body__row-title__actions-button table__body__row-title__actions-button--share" />
                                        <Button
                                            className="table__body__row-title__actions-license"
                                            width={80}
                                            height={40}
                                        >
                                            License
                                        </Button>
                                    </div>
                                </div>
                                <div className="table__body__row-flow">
                                    {TABLE_FLOW_SHAPES[item.arc.toLowerCase()] && (
                                        <img
                                            src={TABLE_FLOW_SHAPES.find(x => x.name === item.arc.toLowerCase()).image}
                                        />
                                    )}
                                </div>
                                <div className="table__body__row-duration">
                                    <strong>
                                        <p>{item.length}</p>
                                    </strong>
                                </div>
                                <div className="table__body__row-bpm">
                                    <p>
                                        <strong>Key</strong> {item.musicKey}
                                    </p>
                                    <p>
                                        <strong>BPM</strong> {item.bpm}
                                    </p>
                                </div>
                                <div
                                    className="table__body__row-filter"
                                    style={{ backgroundImage: `url('/assets/images/table/rtm.png')` }}
                                >
                                    <p>{item.rhythm}</p>
                                </div>
                                <div
                                    className="table__body__row-filter"
                                    style={{ backgroundImage: `url('/assets/images/table/spd.png')` }}
                                >
                                    <p>{item.speed}</p>
                                </div>
                                <div
                                    className="table__body__row-filter"
                                    style={{ backgroundImage: `url('/assets/images/table/exp.png')` }}
                                >
                                    <p>{item.experimental}</p>
                                </div>
                                <div
                                    className="table__body__row-filter"
                                    style={{ backgroundImage: `url('/assets/images/table/mod.png')` }}
                                >
                                    <p>{item.mood}</p>
                                </div>
                                <div
                                    className="table__body__row-filter"
                                    style={{ backgroundImage: `url('/assets/images/table/grd.png')` }}
                                >
                                    <p>{item.grid}</p>
                                </div>
                            </>
                        </div>
                    ))}
                </div>
            </div>
            <SimilarSongsPanel visible={similarOpened} onClose={() => setSimilarOpened(false)} />
        </>
    );
}

SongsTable.propTypes = {
    list: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    currentSongIndex: PropTypes.number,
};

SongsTable.displayName = 'SongsTable';

export default memo(SongsTable);
