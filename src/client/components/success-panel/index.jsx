/* eslint-disable max-lines-per-function */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import MenuFooter from 'components/menu-panel/menu-footer';

import CloseIcon from 'assets/images/Close_Icon_Gray.svg';

import './style.scss';

/**
 * Success panel component
 * @param {Function} onClose action triggered by the close button
 * @returns {React.Component}
 */
function SuccessPanel({ onClose }) {
    return (
        <div className="success-panel">
            <div className="success-panel__header">
                <CloseIcon onClick={onClose} />
                <img className="success-panel__header__image" src="/assets/images/thank_you_img.jpg" />
            </div>
            <div className="success-panel__body">
                <div className="success-panel__body__title">Your request has been sent.</div>
                <div className="success-panel__body__content">
                    We will get back with you shortly. Thank you for your interest.
                </div>
            </div>
            <MenuFooter />
        </div>
    );
}

SuccessPanel.displayName = 'SuccessPanel';

SuccessPanel.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default memo(SuccessPanel);
