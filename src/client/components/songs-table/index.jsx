import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { TABLE_FLOW_SHAPES } from 'utils/constants';
import Button from 'components/button';
import classnames from 'classnames';

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

    const playSong = item => {
        onSelect(item);
    };

    const getRowClass = index =>
        classnames('table__body__row', {
            'table__body__row--hovered': checkIfHovered(index),
        });

    return (
        <div className="table">
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
                                                {item.description}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="table__body__row-title__actions">
                                    <div className="table__body__row-title__actions-button table__body__row-title__actions-button--similar" />
                                    <div className="table__body__row-title__actions-button table__body__row-title__actions-button--share" />
                                    <Button className="table__body__row-title__actions-license" width={80} height={40}>
                                        License
                                    </Button>
                                </div>
                            </div>
                            <div className="table__body__row-flow">
                                {TABLE_FLOW_SHAPES[item.arc.toLowerCase()] && (
                                    <img src={TABLE_FLOW_SHAPES.find(x => x.name === item.arc.toLowerCase()).image} />
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
    );
}

SongsTable.propTypes = {
    list: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    currentSongIndex: PropTypes.number,
};

SongsTable.displayName = 'SongsTable';

export default memo(SongsTable);
