import React, { useState, useMemo, memo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { FILTERS_DESCRIPTIONS, FLOW_SHAPES } from 'utils/constants';

import '../style.scss';

/**
 * Left side panel component
 * @param {Boolean} isOpened boolean to determine if the range slider is displayed or toggled
 * @returns {React.Component}
 */
function FlowFilter({ isOpened }) {
    const [selectedFlows, setSelectedFlows] = useState([]);
    const [openedTooltip, setOpenedTooltip] = useState(false);
    const [opened, setOpened] = useState(isOpened);
    const [showCounter, setShowCounter] = useState(true);

    const infoTooltipClass = useMemo(
        () =>
            classnames('info-tooltip', {
                'info-tooltip--active': openedTooltip,
            }),
        [openedTooltip]
    );

    const toggleFlow = shape => {
        if (selectedFlows.includes(shape)) {
            setSelectedFlows(selectedFlows.filter(x => x !== shape));
        } else {
            setSelectedFlows(selectedFlows.concat(shape));
        }
    };

    return (
        <div className="filter">
            <div className="filter__header flex flex--space-between">
                <div className="flex flex--space-between">
                    <p className="filter__header-name">Flow (Arc)</p>
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
                {selectedFlows.length > 0 && (
                    <div
                        className="filter__header__counter"
                        onMouseOver={() => setShowCounter(false)}
                        onMouseOut={() => setShowCounter(true)}
                        onClick={() => {
                            setSelectedFlows([]);
                            setShowCounter(true);
                        }}
                    >
                        {showCounter ? selectedFlows.length : '✖'}
                    </div>
                )}
                {selectedFlows.length === 0 && (
                    <div className="filter__header__toggle flex flex--space-between" onClick={() => setOpened(!opened)}>
                        <p className="filter__header__toggle-symbol">{opened ? '-' : '+'}</p>
                    </div>
                )}
            </div>
            {opened && (
                <div className="filter__shapes">
                    <ul className="filter__shapes__list">
                        {FLOW_SHAPES.map((shape, index) => (
                            <li
                                key={index}
                                className="filter__shapes__list-shape"
                                onClick={() => toggleFlow(shape.name)}
                            >
                                <img src={selectedFlows.includes(shape.name) ? shape.activeImage : shape.image} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

FlowFilter.displayName = 'FlowFilter';

FlowFilter.propTypes = {
    isOpened: PropTypes.bool,
};

FlowFilter.defaultProps = {
    isOpened: false,
};

export default memo(FlowFilter);
