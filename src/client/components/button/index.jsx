import React, { memo, useMemo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './style.scss';

/**
 * Button component
 * @param {Array} children node or array of nodes
 * @param {Number} width custom width
 * @param {Number} height custom height
 * @param {String} className extra classes
 * @param {Object} props extra props
 * @returns {React.Component}
 */
function Button({ children, width, height, className, ...props }) {
    const buttonClass = useMemo(
        () =>
            classnames('button', {
                [className]: className,
            }),
        [className]
    );

    return (
        <button className={buttonClass} {...props} style={{ width: width, height: height }}>
            {children}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    className: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Button.defaultProps = {
    className: '',
    width: 112,
    height: 42,
};

Button.displayName = 'Button';

export default memo(Button);
