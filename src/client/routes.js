import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from 'components/header';
import ScrollToTop from './components/scroll-to-top';
import Home from './pages/home';
import Song from './pages/song';
import NotFound from './pages/not-found';

/**
 * Router component
 * @returns {React.Component}
 */
function Routes() {
    return (
        <Router>
            <ScrollToTop>
                <Header />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/song/:name" exact component={Song} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </ScrollToTop>
        </Router>
    );
}

export default Routes;
