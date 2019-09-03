import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

/**
 * Component to handle the home page
 * @returns {React.Component}
 */
function HomePage({ history }) {
    return (
        <main className="home">
            <div className="test"></div>
        </main>
    );
}

HomePage.displayName = 'HomePage';

HomePage.propTypes = {
    history: PropTypes.object,
};

export default HomePage;
