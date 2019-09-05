import React, { useState, useMemo, memo } from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { FILTERS_BACKGROUNDS, FILTERS_DESCRIPTIONS } from 'utils/constants';

import '../style.scss';

/**
 * Left side panel component
 * @param {String} name the name of the filter
 * @param {Boolean} isOpened boolean to determine if the range slider is displayed or toggled
 * @param {Array} values values of selected filters; default [1, 10]
 * @param {Function} onRangeChange action to call when slider changes
 * @param {Function} onFilterCancel action to call when slider is cancelled
 * @returns {React.Component}
 */
function BasicFilter({ name, isOpened, values, onRangeChange, onFilterCancel }) {
    const [openedTooltip, setOpenedTooltip] = useState(false);

    const infoTooltipClass = useMemo(
        () =>
            classnames('info-tooltip', {
                'info-tooltip--active': openedTooltip,
            }),
        [openedTooltip]
    );

    const isInitial = values[0] === 1 && values[1] === 10;
    const openedForValues = isOpened || !isInitial;

    const [opened, setOpened] = useState(openedForValues);

    return (
        <div className="filter">
            <div className="filter__header flex flex--space-between">
                <div className="flex flex--space-between">
                    <p className="filter__header-name">{name}</p>
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
                                    dangerouslySetInnerHTML={{ __html: FILTERS_DESCRIPTIONS[name] }}
                                ></p>
                            </div>
                        )}
                    </div>
                </div>
                {!isInitial && (
                    <div className="filter__header__range flex flex--space-between">
                        <p className="filter__header__range-numbers">
                            {values[0]} - {values[1]}
                        </p>
                        <img
                            className="filter__header__range-close"
                            src="/assets/images/close.png"
                            onClick={() => onFilterCancel()}
                        />
                    </div>
                )}
                {isInitial && (
                    <div className="filter__header__toggle flex flex--space-between" onClick={() => setOpened(!opened)}>
                        <p className="filter__header__toggle-symbol">{opened ? '-' : '+'}</p>
                    </div>
                )}
            </div>
            {opened && (
                <Range
                    min={1}
                    max={10}
                    onChange={onRangeChange}
                    value={values}
                    railStyle={{ backgroundImage: `url(${FILTERS_BACKGROUNDS[name]}` }}
                />
            )}
        </div>
    );
}

BasicFilter.displayName = 'BasicFilter';

BasicFilter.propTypes = {
    name: PropTypes.string.isRequired,
    isOpened: PropTypes.bool,
    values: PropTypes.array.isRequired,
    onRangeChange: PropTypes.func.isRequired,
    onFilterCancel: PropTypes.func.isRequired,
};

BasicFilter.defaultProps = {
    isOpened: false,
};

export default memo(BasicFilter);
