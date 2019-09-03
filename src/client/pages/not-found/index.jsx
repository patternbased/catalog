import React from 'react';
import Button from '../../components/button';
import PropTypes from 'prop-types';

import './style.scss';

/**
 * Component to handle Not Found page
 * @returns {React.Component}
 */
function NotFound({ history }) {
    return (
        <div className="not-found-page">
            <div className="not-found-page__content">
                <h1 className="not-found-page__header">404</h1>
                <h2 className="not-found-page__sub-header">Page not found</h2>

                <Button onClick={() => history.push('/')}>Home</Button>
            </div>
        </div>
    );
}

NotFound.displayName = 'NotFound';

NotFound.propTypes = {
    history: PropTypes.object,
};

export default NotFound;
