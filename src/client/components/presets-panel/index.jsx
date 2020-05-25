/* eslint-disable max-lines-per-function */
import React, { memo, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';

import Button from 'components/button';
import Preset from 'components/preset';

import { setFilter } from 'actions/filters';
import { setState } from 'actions/general';
import { PRESETS } from 'utils/constants';

import './style.scss';

const ctaCopy = ['Let us find the perfect music for your needs.', 'Have us compose the perfect music for your needs.'];

/**
 * Presets panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function PresetsPanel({ visible, style }) {
    const panelClass = useMemo(
        () =>
            classnames('presets-panel', {
                'presets-panel--visible': visible,
            }),
        [visible]
    );
    const dispatch = useDispatch();

    const applyPreset = (filters, name) => {
        Object.keys(filters).forEach((filter) => {
            dispatch(setFilter(filter, filters[filter]));
        });
        fetch('/api/increment-preset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ preset: name }),
        });
        ReactGA.event({
            category: 'Presets panel',
            action: 'Preset clicked',
            label: `Preset ${name}`,
        });
    };

    return (
        <div>
            <div className={panelClass} style={style}>
                <div className="presets-panel__container">
                    <div className="presets-panel__presets">
                        {Object.keys(PRESETS).map((preset, index) => (
                            <div key={index}>
                                <div onClick={() => applyPreset(PRESETS[preset].filters, preset)}>
                                    <Preset name={preset} />
                                </div>
                                {index + 1 === 8 && (
                                    <div className="presets-panel__cta">
                                        <p className="presets-panel__cta-copy">{ctaCopy[0]}</p>
                                        <Button
                                            className="presets-panel__cta-button"
                                            width={62}
                                            height={42}
                                            onClick={() => dispatch(setState('reqSuggestionsOpened', true))}
                                        >
                                            Ask
                                        </Button>
                                    </div>
                                )}
                                {index + 1 === 16 && (
                                    <div className="presets-panel__cta">
                                        <p className="presets-panel__cta-copy">{ctaCopy[1]}</p>
                                        <Button
                                            className="presets-panel__cta-button"
                                            width={62}
                                            height={42}
                                            onClick={() => dispatch(setState('reqComposingOpened', true))}
                                        >
                                            Ask
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

PresetsPanel.displayName = 'PresetsPanel';

PresetsPanel.propTypes = {
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    style: PropTypes.object,
};

PresetsPanel.defaultProps = {
    visible: false,
    style: {},
};

export default memo(PresetsPanel);
