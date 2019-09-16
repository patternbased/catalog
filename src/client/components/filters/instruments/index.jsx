/* eslint-disable max-lines-per-function */
import React, { useState, useMemo, memo, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Tooltip from 'components/filters/tooltip';

import { FILTERS_DESCRIPTIONS, INSTRUMENTS } from 'utils/constants';

import '../style.scss';

/**
 * Instruments filter component
 * @param {Boolean} isOpened boolean to determine if the input is displayed or toggled
 * @param {Array} values values of selected filters; default []
 * @param {Function} onSelectInstrument action to call when an instrument is selected
 * @param {Function} onCancelInstrument action to call when an instrument is removed
 * @param {Function} onFilterCancel action to call when slider is cancelled
 * @returns {React.Component}
 */
function InstrumentsFilter({ isOpened, values, onSelectInstrument, onCancelInstrument, onFilterCancel }) {
    const [openedTooltip, setOpenedTooltip] = useState(false);
    const [showCounter, setShowCounter] = useState(true);
    const [instrument, setInstrument] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const infoTooltipClass = useMemo(
        () =>
            classnames('info-tooltip', {
                'info-tooltip--active': openedTooltip,
            }),
        [openedTooltip]
    );

    const isInitial = values.length === 0;
    const openedForValues = isOpened || !isInitial;

    const [opened, setOpened] = useState(openedForValues);
    const [tooltipPosition, setTooltipPosition] = useState([]);

    const placeTooltip = e => {
        setTooltipPosition([e.clientX + 20, e.clientY - 10]);
        setOpenedTooltip(true);
    };

    useEffect(() => {
        if (instrument !== '') {
            const lowerCaseTerm = instrument.toLowerCase();
            const withoutSelected = INSTRUMENTS.filter(x => !values.includes(x));
            const found = withoutSelected.filter(x => x.toLowerCase().includes(lowerCaseTerm));
            if (found.length === 0) {
                found.push(instrument);
            }
            setShowSuggestions(true);
            setSuggestions(found);
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    }, [instrument]);

    return (
        <div className="filter">
            <div className="filter__header flex flex--space-between">
                <div className="flex flex--space-between">
                    <p className="filter__header-name">Instruments</p>
                    {FILTERS_DESCRIPTIONS['instruments'].length > 0 && (
                        <div className="filter__header__tooltip">
                            <div onMouseOut={() => setOpenedTooltip(false)}>
                                <div className={infoTooltipClass} onMouseOver={e => placeTooltip(e)}>
                                    ?
                                </div>
                            </div>
                            {openedTooltip && (
                                <Tooltip text={FILTERS_DESCRIPTIONS['instruments']} position={tooltipPosition} />
                            )}
                        </div>
                    )}
                </div>
                {values.length > 0 && (
                    <div
                        className="filter__header__counter"
                        onMouseOver={() => setShowCounter(false)}
                        onMouseOut={() => setShowCounter(true)}
                        onClick={() => {
                            onFilterCancel();
                            setShowCounter(true);
                        }}
                    >
                        {showCounter ? values.length : '✖'}
                    </div>
                )}
                {values.length === 0 && (
                    <div className="filter__header__toggle flex flex--space-between" onClick={() => setOpened(!opened)}>
                        <p className="filter__header__toggle-symbol">{opened ? '-' : '+'}</p>
                    </div>
                )}
            </div>
            {(opened || values.length > 0) && (
                <div className="filter__instruments">
                    <input
                        type="text"
                        className="filter__instruments-search"
                        placeholder="i.e. Guitar, Piano"
                        value={instrument}
                        onChange={e => setInstrument(e.target.value)}
                    />
                    {showSuggestions && (
                        <ul className="filter__instruments__list">
                            {suggestions.map((item, index) => (
                                <li
                                    key={index}
                                    className="filter__instruments__list-item"
                                    onClick={() => {
                                        onSelectInstrument(item);
                                        setShowSuggestions(false);
                                        setInstrument('');
                                    }}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                    {values.length > 0 && (
                        <div className="filter__instruments__selected">
                            {values.map((item, index) => (
                                <div key={index} className="filter__instruments__selected-item">
                                    <p className="filter__instruments__selected-item-name">{item}</p>
                                    <img
                                        className="filter__instruments__selected-item-close"
                                        src="/assets/images/close.png"
                                        onClick={() => onCancelInstrument(item)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

InstrumentsFilter.displayName = 'InstrumentsFilter';

InstrumentsFilter.propTypes = {
    isOpened: PropTypes.bool,
    values: PropTypes.array.isRequired,
    onSelectInstrument: PropTypes.func.isRequired,
    onCancelInstrument: PropTypes.func.isRequired,
    onFilterCancel: PropTypes.func.isRequired,
};

InstrumentsFilter.defaultProps = {
    isOpened: false,
};

export default memo(InstrumentsFilter);
