/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import selectors from 'selectors';

import BasicFilter from 'components/filters/basic';
import FlowFilter from 'components/filters/flow';
import InstrumentsFilter from 'components/filters/instruments';
import Button from 'components/button';
import Preset from 'components/preset';

import { setFilter, resetFilter, resetAllFilters } from 'actions/filters';
import { BASIC_FILTERS, INITIAL_FILTER_VALUES, PRESETS } from 'utils/constants';

import './style.scss';

/**
 * Left side panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function LeftPanel({ visible, style }) {
    const [similarPresets, setSimilarPresets] = useState([]);
    const panelClass = useMemo(
        () =>
            classnames('left-panel', {
                'left-panel--visible': visible,
            }),
        [visible]
    );

    const dispatch = useDispatch();
    const filtersValues = useSelector(selectors.filters.getAll);

    const wereFiltersChanged = useMemo(() => JSON.stringify(filtersValues) !== JSON.stringify(INITIAL_FILTER_VALUES), [
        filtersValues,
    ]);

    const changeSlider = useCallback(
        name => values => {
            dispatch(setFilter(name, values));
        },
        [filtersValues]
    );

    const toggleFlow = useCallback(
        shape => {
            const flowsCopy = [...filtersValues['flow']];
            if (flowsCopy.includes(shape)) {
                dispatch(setFilter('flow', flowsCopy.filter(x => x !== shape)));
            } else {
                dispatch(setFilter('flow', flowsCopy.concat(shape)));
            }
        },
        [filtersValues]
    );

    const selectInstrument = useCallback(
        instrument => {
            const instrumentsCopy = [...filtersValues['instruments']];
            dispatch(setFilter('instruments', instrumentsCopy.concat(instrument)));
        },
        [filtersValues]
    );

    const removeInstrument = useCallback(
        instrument => {
            const instrumentsCopy = [...filtersValues['instruments']];
            dispatch(setFilter('instruments', instrumentsCopy.filter(x => x !== instrument)));
        },
        [filtersValues]
    );

    const cancelFilter = useCallback(
        name => {
            dispatch(resetFilter(name));
        },
        [filtersValues]
    );

    const applyPreset = filters => {
        Object.keys(filters).forEach(filter => {
            dispatch(setFilter(filter, filters[filter]));
        });
    };

    useEffect(() => {
        if (wereFiltersChanged) {
            const allPresets = Object.keys(PRESETS).map(preset => {
                return {
                    name: preset,
                    filters: PRESETS[preset].filters,
                    similarity: 0,
                };
            });
            const similar = _getSimilarPresets(allPresets, filtersValues);
            setSimilarPresets(similar);
        }
    }, [filtersValues]);

    return (
        <div>
            <div className={panelClass} style={style}>
                <div className="left-panel__container">
                    <div className="left-panel__filters">
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
                                <Button
                                    onClick={() => {
                                        dispatch(resetAllFilters());
                                        setSimilarPresets([]);
                                    }}
                                >
                                    Clear All
                                </Button>
                            </div>
                        )}
                    </div>
                    {similarPresets.length > 0 && (
                        <div className="left-panel__presets">
                            <p className="left-panel__presets-title">Similar presets</p>
                            {similarPresets.map((preset, index) => (
                                <div key={index} onClick={() => applyPreset(preset.filters)}>
                                    <Preset name={preset.name} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const _getSimilarPresets = (presets, filters) => {
    const similarPresets = [];
    presets.forEach(preset => {
        const pFilter = preset.filters;
        let similarCount = 0;
        Object.keys(pFilter).forEach(filterName => {
            if (
                pFilter[filterName][0] === filters[filterName][0] &&
                pFilter[filterName][1] === filters[filterName][1]
            ) {
                similarCount += 1;
            }
        });
        if (similarCount >= 3) {
            preset.similarity = similarCount;
            similarPresets.push(preset);
        }
    });
    return similarPresets.sort((a, b) => a.similarity - b.similarity).splice(0, 4);
};

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
