import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/button';

import './style.scss';

/**
 * Cookie Banner component
 * @param {Function} onAccept action when cookie is approved
 * @param {Function} onDecline action when cookie is denied
 * @returns {React.Component}
 */
function CookieBanner({ onAccept, onDecline }) {
    return (
        <div className="cookie">
            <div className="cookie__content">
                <div className="cookie__text">
                    We use cookies to ensure you get the best user experience on our site.
                    <br />
                    Please see our{' '}
                    <a href="https://legal.patternbased.com/privacy-policy/" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                    </a>{' '}
                    for more info.
                </div>
                <div className="cookie__buttons">
                    <Button height={34} className="white" onClick={onAccept}>
                        Got it
                    </Button>
                    <Button height={34} className="transparent" onClick={onDecline}>
                        Decline
                    </Button>
                </div>
            </div>
        </div>
    );
}

CookieBanner.displayName = 'CookieBanner';

CookieBanner.propTypes = {
    onAccept: PropTypes.func.isRequired,
    onDecline: PropTypes.func.isRequired,
};

export default memo(CookieBanner);
