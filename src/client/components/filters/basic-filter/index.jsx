import React, { useState, useMemo } from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import classnames from 'classnames';

import { FILTERS_BACKGROUNDS, FILTERS_DESCRIPTIONS } from 'utils/constants';

import '../style.scss';

/**
 * Left side panel component
 * @returns {React.Component}
 */
function BasicFilter({ name }) {
    const [range, setRange] = useState([1, 10]);
    const [changed, setChanged] = useState(false);
    const [openedTooltip, setOpenedTooltip] = useState(false);

    const onRangeChange = value => {
        setRange(value);
        if (!changed) {
            setChanged(true);
        }
    };
    const onFilterCancel = () => {
        setRange([1, 10]);
        setChanged(false);
    };

    const infoTooltipClass = useMemo(
        () =>
            classnames('info-tooltip', {
                'info-tooltip--active': openedTooltip,
            }),
        [openedTooltip]
    );

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
                {changed > 0 && (
                    <div className="filter__header__range flex flex--space-between">
                        <p className="filter__header__range-numbers">
                            {range[0]} - {range[1]}
                        </p>
                        <img
                            className="filter__header__range-close"
                            src="/assets/images/close.png"
                            onClick={() => onFilterCancel()}
                        />
                    </div>
                )}
            </div>
            <Range
                min={1}
                max={10}
                onChange={onRangeChange}
                value={range}
                railStyle={{ backgroundImage: `url(${FILTERS_BACKGROUNDS[name]}` }}
            />
        </div>
    );
}

BasicFilter.displayName = 'BasicFilter';

export default BasicFilter;
