import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './style.scss';

/**
 * Modal component
 * @param {Object} props component props
 * @returns {React.Component}
 */
function Modal({ children, opened, modifier = '' }) {
    const modalClassname = classnames('modal', {
        'modal--opened': opened,
        [`modal--${modifier}`]: modifier,
    });

    return ReactDOM.createPortal(
        <React.Fragment>
            <div className={modalClassname}>
                <div className="modal__overflow">
                    <div className="modal__content">{children}</div>
                </div>
            </div>
        </React.Fragment>,
        document.body
    );
}

Modal.propTypes = {
    children: PropTypes.node.isRequired,
    opened: PropTypes.bool,
};

Modal.defaultProps = {
    opened: false,
};

export default Modal;
