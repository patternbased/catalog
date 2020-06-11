import React, { useState, useMemo, memo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Tooltip from 'components/filters/tooltip';

import { FILTERS_DESCRIPTIONS, DURATION_VALUES } from 'utils/constants';

import '../style.scss';

/**
 * Duration filter component
 * @param {Boolean} isOpened boolean to determine if the durations are displayed or toggled
 * @param {Array} values values of selected filters; default []
 * @param {Function} onToggleDuration action to call when a duration is clicked
 * @param {Function} onFilterCancel action to call when filter is cancelled
 * @returns {React.Component}
 */
function DurationFilter({ isOpened, values, onToggleDuration, onFilterCancel }) {
    const [openedTooltip, setOpenedTooltip] = useState(false);

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

    const placeTooltip = (e) => {
        setTooltipPosition([e.clientX + 20, e.clientY - 10]);
        setOpenedTooltip(true);
    };

    return (
        <div className="filter">
            <div className="filter__header flex flex--space-between">
                <div className="flex flex--space-between">
                    <p className="filter__header-name">Duration</p>
                    {FILTERS_DESCRIPTIONS['duration'].length > 0 && (
                        <div className="filter__header__tooltip">
                            <div onMouseOut={() => setOpenedTooltip(false)}>
                                <div className={infoTooltipClass} onMouseOver={(e) => placeTooltip(e)}>
                                    ?
                                </div>
                            </div>
                            {openedTooltip && (
                                <Tooltip text={FILTERS_DESCRIPTIONS['duration']} position={tooltipPosition} />
                            )}
                        </div>
                    )}
                </div>
                {values.length > 0 && (
                    <div className="filter__header__counter" onClick={() => onFilterCancel()}>
                        ✖
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
                        {DURATION_VALUES.map((shape, index) => (
                            <li
                                key={index}
                                className={`filter__shapes__list-dur ${
                                    values.includes(shape.name) ? 'filter__shapes__list-dur--active' : ''
                                }`}
                                onClick={() => onToggleDuration(shape.name)}
                            >
                                <span>{shape.name}</span>min
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

DurationFilter.displayName = 'DurationFilter';

DurationFilter.propTypes = {
    isOpened: PropTypes.bool,
    values: PropTypes.array.isRequired,
    onToggleDuration: PropTypes.func.isRequired,
    onFilterCancel: PropTypes.func.isRequired,
};

DurationFilter.defaultProps = {
    isOpened: false,
};

export default memo(DurationFilter);
