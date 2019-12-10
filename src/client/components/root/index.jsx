import React from 'react';
import Routes from '../../routes';
import Header from 'components/header';

/**
 * Root component
 * @returns {React.Component}
 */
function Root() {
    return (
        <>
            <Header />
            <Routes />
        </>
    );
}

export default Root;
