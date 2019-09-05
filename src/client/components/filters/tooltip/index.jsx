import React, { memo } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

/**
 * Filter tooltip component
 * @param {String} text the content of the tooltip
 * @param {Array} position [x, y] position of the tooltip
 * @returns {React.Component}
 */
function Tooltip({ text, position }) {
    return ReactDOM.createPortal(
        <React.Fragment>
            <div
                className="filter__header__tooltip-container"
                style={{ position: 'absolute', top: position[1], left: position[0] }}
            >
                <p className="filter__header__tooltip-text" dangerouslySetInnerHTML={{ __html: text }}></p>
            </div>
        </React.Fragment>,
        document.body
    );
}

Tooltip.displayName = 'Tooltip';

Tooltip.propTypes = {
    text: PropTypes.string.isRequired,
    position: PropTypes.array.isRequired,
};

export default memo(Tooltip);
