import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ScrollToTop from './components/scroll-to-top';

import Home from './pages/home';
import NotFound from './pages/not-found';
import BackToTop from 'components/back-to-top';

/**
 * Router component
 * @returns {React.Component}
 */
function Routes() {
    return (
        <Router>
            <ScrollToTop>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </ScrollToTop>
            <BackToTop />
        </Router>
    );
}

export default Routes;
