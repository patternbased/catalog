import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Animated } from 'react-animated-css';
import PropTypes from 'prop-types';
import selectors from 'selectors';

import BasicFilter from 'components/filters/basic';
import FlowFilter from 'components/filters/flow';
import InstrumentsFilter from 'components/filters/instruments';
import Button from 'components/button';

import { setFilter, resetFilter, resetAllFilters } from 'actions/filters';
import { BASIC_FILTERS, INITIAL_FILTER_VALUES } from 'utils/constants';

import './style.scss';

/**
 * Left side panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function LeftPanel({ visible, style }) {
    const dispatch = useDispatch();
    const filtersValues = useSelector(selectors.filters.getAll);

    const wereFiltersChanged = JSON.stringify(filtersValues) !== JSON.stringify(INITIAL_FILTER_VALUES);

    const changeSlider = name => values => {
        dispatch(setFilter(name, values));
    };

    const toggleFlow = shape => {
        const flowsCopy = [...filtersValues['flow']];
        if (flowsCopy.includes(shape)) {
            dispatch(setFilter('flow', flowsCopy.filter(x => x !== shape)));
        } else {
            dispatch(setFilter('flow', flowsCopy.concat(shape)));
        }
    };

    const selectInstrument = instrument => {
        const instrumentsCopy = [...filtersValues['instruments']];
        dispatch(setFilter('instruments', instrumentsCopy.concat(instrument)));
    };

    const removeInstrument = instrument => {
        const instrumentsCopy = [...filtersValues['instruments']];
        dispatch(setFilter('instruments', instrumentsCopy.filter(x => x !== instrument)));
    };

    const cancelFilter = name => {
        dispatch(resetFilter(name));
    };

    return (
        <Animated
            isVisible={visible}
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            animationInDuration={800}
            animationOutDuration={800}
        >
            <div className="left-panel" style={style}>
                {BASIC_FILTERS.map((filter, index) => (
                    <div key={index}>
                        <BasicFilter
                            name={filter}
                            isOpened={filter === 'duration' ? false : true}
                            values={filtersValues[filter]}
                            onRangeChange={changeSlider(filter)}
                            onFilterCancel={() => cancelFilter(filter)}
                        />
                    </div>
                ))}
                <FlowFilter
                    values={filtersValues['flow']}
                    onToggleFlow={toggleFlow}
                    onFilterCancel={() => cancelFilter('flow')}
                />
                <InstrumentsFilter
                    values={filtersValues['instruments']}
                    onSelectInstrument={selectInstrument}
                    onCancelInstrument={removeInstrument}
                    onFilterCancel={() => cancelFilter('instruments')}
                />
                {wereFiltersChanged && (
                    <div className="left-panel__button">
                        <Button onClick={() => dispatch(resetAllFilters())}>Clear All</Button>
                    </div>
                )}
            </div>
        </Animated>
    );
}

LeftPanel.displayName = 'LeftPanel';

LeftPanel.propTypes = {
    visible: PropTypes.bool,
    style: PropTypes.object,
};

LeftPanel.defaultProps = {
    visible: false,
    style: {},
};

export default memo(LeftPanel);
