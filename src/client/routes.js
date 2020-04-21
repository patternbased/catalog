import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import ScrollToTop from './components/scroll-to-top';
import MusicPlayer from './components/music-player';
import Home from './pages/home';
import Song from './pages/song';
import Artist from './pages/artist';
import Writer from './pages/writer';
import Invoice from './pages/invoice';
import Download from './pages/download';
import NotFound from './pages/not-found';

import selectors from 'selectors';

/**
 * Router component
 * @returns {React.Component}
 */
function Routes() {
    const currentSong = useSelector(selectors.library.getCurrentSong);
    const playlist = useSelector(selectors.library.getCurrentPlaylist);
    const songPlaying = useSelector(selectors.general.get('songPlaying'));

    return (
        <Router>
            <ScrollToTop>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/song/:name" exact component={Song} />
                    <Route path="/artist/:name" exact component={Artist} />
                    <Route path="/writer/:name" exact component={Writer} />
                    <Route path="/invoice/:id" exact component={Invoice} />
                    <Route path="/download/:id" exact component={Download} />
                    <Route path="/not-found" exact component={NotFound} />
                    <Redirect from="*" to="/not-found" />
                </Switch>
                {currentSong && <MusicPlayer play={songPlaying} list={playlist} />}
            </ScrollToTop>
        </Router>
    );
}

export default Routes;
