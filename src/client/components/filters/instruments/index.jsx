/* eslint-disable max-lines-per-function */
import React, { useState, useMemo, memo, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { FILTERS_DESCRIPTIONS, INSTRUMENTS } from 'utils/constants';

import '../style.scss';

/**
 * Left side panel component
 * @param {Boolean} isOpened boolean to determine if the range slider is displayed or toggled
 * @returns {React.Component}
 */
function InstrumentsFilter({ isOpened }) {
    const [openedTooltip, setOpenedTooltip] = useState(false);
    const [opened, setOpened] = useState(isOpened);
    const [showCounter, setShowCounter] = useState(true);
    const [instrument, setInstrument] = useState('');
    const [selectedInstruments, setSelectedInstruments] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const infoTooltipClass = useMemo(
        () =>
            classnames('info-tooltip', {
                'info-tooltip--active': openedTooltip,
            }),
        [openedTooltip]
    );

    const removeInstrument = item => {
        setSelectedInstruments(selectedInstruments.filter(x => x !== item));
    };

    useEffect(() => {
        if (instrument !== '') {
            const lowerCaseTerm = instrument.toLowerCase();
            const withoutSelected = INSTRUMENTS.filter(x => !selectedInstruments.includes(x));
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
                    <div className="filter__header__tooltip">
                        <div onMouseOut={() => setOpenedTooltip(false)}>
                            <div className={infoTooltipClass} onMouseOver={() => setOpenedTooltip(true)}>
                                ?
                            </div>
                        </div>
                        {openedTooltip && (
                            <div className="filter__header__tooltip-container">
                                <p
                                    className="filter__header__tooltip-text"
                                    dangerouslySetInnerHTML={{ __html: FILTERS_DESCRIPTIONS['flow'] }}
                                ></p>
                            </div>
                        )}
                    </div>
                </div>
                {selectedInstruments.length > 0 && (
                    <div
                        className="filter__header__counter"
                        onMouseOver={() => setShowCounter(false)}
                        onMouseOut={() => setShowCounter(true)}
                        onClick={() => setSelectedInstruments([])}
                    >
                        {showCounter ? selectedInstruments.length : '✖'}
                    </div>
                )}
                {selectedInstruments.length === 0 && (
                    <div className="filter__header__toggle flex flex--space-between" onClick={() => setOpened(!opened)}>
                        <p className="filter__header__toggle-symbol">{opened ? '-' : '+'}</p>
                    </div>
                )}
            </div>
            {opened && (
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
                                        setSelectedInstruments(selectedInstruments.concat(item));
                                        setShowSuggestions(false);
                                        setInstrument('');
                                    }}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                    {selectedInstruments.length > 0 && (
                        <div className="filter__instruments__selected">
                            {selectedInstruments.map((item, index) => (
                                <div key={index} className="filter__instruments__selected-item">
                                    <p className="filter__instruments__selected-item-name">{item}</p>
                                    <img
                                        className="filter__instruments__selected-item-close"
                                        src="/assets/images/close.png"
                                        onClick={() => removeInstrument(item)}
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
};

InstrumentsFilter.defaultProps = {
    isOpened: false,
};

export default memo(InstrumentsFilter);
