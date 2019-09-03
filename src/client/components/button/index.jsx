import React, { memo, useMemo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './style.scss';

/**
 * Button component
 * @param {Array} children node or array of nodes
 * @param {String} className extra classes
 * @param {Object} props extra props
 * @returns {React.Component}
 */
function Button({ children, className, ...props }) {
    const buttonClass = useMemo(
        () =>
            classnames('button', {
                [className]: className,
            }),
        [className]
    );

    return (
        <button className={buttonClass} {...props}>
            {children}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    className: PropTypes.string,
};

Button.defaultProps = {
    className: '',
};

Button.displayName = 'Button';

export default memo(Button);
