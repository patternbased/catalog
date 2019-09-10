/* eslint-disable max-lines-per-function */
import React, { memo, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Button from 'components/button';
import Preset from 'components/preset';

import { setFilter } from 'actions/filters';
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

    const applyPreset = filters => {
        Object.keys(filters).forEach(filter => {
            dispatch(setFilter(filter, filters[filter]));
        });
    };

    return (
        <div>
            <div className={panelClass} style={style}>
                <div className="presets-panel__container">
                    <div className="presets-panel__presets">
                        {Object.keys(PRESETS).map((preset, index) => (
                            <div key={index} onClick={() => applyPreset(PRESETS[preset].filters)}>
                                <Preset name={preset} />
                                {(index + 1) % 8 === 0 && (
                                    <div className="presets-panel__cta">
                                        <p className="presets-panel__cta-copy">
                                            {ctaCopy[parseInt((index + 1) / 8) - 1]}
                                        </p>
                                        <Button className="presets-panel__cta-button" width={62} height={42}>
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
    visible: PropTypes.bool,
    style: PropTypes.object,
};

PresetsPanel.defaultProps = {
    visible: false,
    style: {},
};

export default memo(PresetsPanel);
