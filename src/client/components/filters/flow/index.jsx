import React, { useState, useMemo, memo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Tooltip from 'components/filters/tooltip';

import { FILTERS_DESCRIPTIONS, FLOW_SHAPES } from 'utils/constants';

import '../style.scss';

/**
 * Flow filter component
 * @param {Boolean} isOpened boolean to determine if the flow shapes are displayed or toggled
 * @param {Array} values values of selected filters; default []
 * @param {Function} onToggleFlow action to call when a flow is clicked
 * @param {Function} onFilterCancel action to call when filter is cancelled
 * @returns {React.Component}
 */
function FlowFilter({ isOpened, values, onToggleFlow, onFilterCancel }) {
    const [openedTooltip, setOpenedTooltip] = useState(false);
    const [showCounter, setShowCounter] = useState(true);

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

    return (
        <div className="filter">
            <div className="filter__header flex flex--space-between">
                <div className="flex flex--space-between">
                    <p className="filter__header-name">Flow (Arc)</p>
                    {FILTERS_DESCRIPTIONS['flow'].length > 0 && (
                        <div className="filter__header__tooltip">
                            <div onMouseOut={() => setOpenedTooltip(false)}>
                                <div className={infoTooltipClass} onMouseOver={e => placeTooltip(e)}>
                                    ?
                                </div>
                            </div>
                            {openedTooltip && (
                                <Tooltip text={FILTERS_DESCRIPTIONS['flow']} position={tooltipPosition} />
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
            {opened && (
                <div className="filter__shapes">
                    <ul className="filter__shapes__list">
                        {FLOW_SHAPES.map((shape, index) => (
                            <li
                                key={index}
                                className="filter__shapes__list-shape"
                                onClick={() => onToggleFlow(shape.name)}
                            >
                                <img src={values.includes(shape.name) ? shape.activeImage : shape.image} />
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
    values: PropTypes.array.isRequired,
    onToggleFlow: PropTypes.func.isRequired,
    onFilterCancel: PropTypes.func.isRequired,
};

FlowFilter.defaultProps = {
    isOpened: false,
};

export default memo(FlowFilter);
