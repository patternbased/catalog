import React, { useState, useMemo, memo } from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Tooltip from 'components/filters/tooltip';

import { FILTERS_BACKGROUNDS, FILTERS_DESCRIPTIONS } from 'utils/constants';

import '../style.scss';

/**
 * Basic Filter component
 * @param {String} name the name of the filter
 * @param {Boolean} isOpened boolean to determine if the range slider is displayed or toggled
 * @param {Array} values values of selected filters; default [1, 10]
 * @param {Function} onRangeChange action to call when slider values change
 * @param {Function} onRangeApply action to call when applying filters
 * @param {Function} onFilterCancel action to call when slider is cancelled
 * @returns {React.Component}
 */
function BasicFilter({ name, isOpened, values, onRangeChange, onRangeApply, onFilterCancel }) {
    const [openedTooltip, setOpenedTooltip] = useState(false);
    const [animated, setAnimated] = useState(false);

    const infoTooltipClass = useMemo(
        () =>
            classnames('info-tooltip', {
                'info-tooltip--active': openedTooltip,
            }),
        [openedTooltip]
    );

    const isInitial = values[0] === 0 && (values[1] === 10 || values[1] === 20);
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
                    <p className="filter__header-name">{name === 'grid' ? 'organic' : name}</p>
                    {FILTERS_DESCRIPTIONS[name].length > 0 && (
                        <div className="filter__header__tooltip">
                            <div onMouseOut={() => setOpenedTooltip(false)}>
                                <div className={infoTooltipClass} onMouseOver={(e) => placeTooltip(e)}>
                                    ?
                                </div>
                            </div>
                            {openedTooltip && <Tooltip text={FILTERS_DESCRIPTIONS[name]} position={tooltipPosition} />}
                        </div>
                    )}
                </div>
                {!isInitial && (
                    <div className="filter__header__range flex flex--space-between">
                        <p className="filter__header__range-numbers">{`${values[0]} - ${values[1]}`}</p>
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
                    min={0}
                    max={10}
                    onChange={onRangeChange}
                    onBeforeChange={() => setAnimated(true)}
                    onAfterChange={(val) => {
                        setAnimated(false);
                        onRangeApply(val);
                    }}
                    value={values}
                    railStyle={{ backgroundImage: `url(${FILTERS_BACKGROUNDS[name]}` }}
                    step={0.25}
                    allowCross={true}
                    pushable={0.25}
                    className={animated ? 'anim' : ''}
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
    onRangeApply: PropTypes.func.isRequired,
    onFilterCancel: PropTypes.func.isRequired,
};

BasicFilter.defaultProps = {
    isOpened: false,
};

export default memo(BasicFilter);
