import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { FLOW_SHAPES } from 'utils/constants';
import Button from 'components/button';

import './style.scss';

const headers = ['SONG NAME / ARTIST NAME', 'FLOW', 'DURATION', 'KEY / BPM', 'RTM', 'SPD', 'EXP', 'MOD', 'GRD'];

/**
 * Songs table component
 * @param {Array} list list of song objects
 * @returns {React.Component}
 */
function SongsTable({ list }) {
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

    const checkIfHovered = index => {
        return hovered.includes(index);
    };

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
                        className="table__body__row"
                        style={{ backgroundColor: checkIfHovered(index) ? '#0092C5' : 'white' }}
                        key={index}
                        onMouseOver={() => addToHovered(index)}
                        onMouseOut={() => removeFromHovered(index)}
                    >
                        <>
                            <div className="table__body__row-title">
                                <img src="/assets/images/logo.png" />
                                <div className="table__body__row-title__wrapper">
                                    <p className="table__body__row-title__wrapper-song-title">{item.title}</p>
                                    <p className="table__body__row-title__wrapper-song-artist">by {item.artistName}</p>
                                </div>
                            </div>
                            <div className="table__body__row-flow">
                                {FLOW_SHAPES[item.arc.toLowerCase()] && (
                                    <img src={FLOW_SHAPES.find(x => x.name === item.arc.toLowerCase()).image} />
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
};

SongsTable.displayName = 'SongsTable';

export default memo(SongsTable);
