import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { PRESETS } from 'utils/constants';

import './style.scss';

/**
 * Preset component
 * @param {String} name the name of the preset
 * @param {Number} width custom width
 * @param {Number} height custom height
 * @returns {React.Component}
 */
function Preset({ name, width, height }) {
    return (
        <div
            className="preset"
            style={{ width: width, height: height, backgroundImage: `url(${PRESETS[name].background})` }}
        >
            <div className="preset-background" style={{ width: width, height: height }}>
                <p className="preset-name">{name}</p>
            </div>
        </div>
    );
}

Preset.propTypes = {
    name: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
};

Preset.defaultProps = {
    width: 240,
    height: 100,
};

Preset.displayName = 'Preset';

export default memo(Preset);
