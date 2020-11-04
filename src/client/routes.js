import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { initialize, pageview } from 'react-ga';
import { useCookies } from 'react-cookie';

import ScrollToTop from './components/scroll-to-top';
import MusicPlayer from './components/music-player';
import CookieBanner from './components/cookie-banner';
import Home from './pages/home';
import Song from './pages/song';
import Artist from './pages/artist';
import Writer from './pages/writer';
import Invoice from './pages/invoice';
import Download from './pages/download';
import NotFound from './pages/not-found';
import Album from './pages/album';
import Albums from './pages/albums';
import About from './pages/about';
import Artists from './pages/artists';

import selectors from 'selectors';

/**
 * Router component
 * @returns {React.Component}
 */
function Routes() {
    const [cookies, setCookie] = useCookies(['pbcPpAll', 'pbcPpDec']);
    const [showBanner, setShowBanner] = useState(false);
    const currentSong = useSelector(selectors.library.getCurrentSong);
    const playlist = useSelector(selectors.library.getCurrentPlaylist);
    const songPlaying = useSelector(selectors.general.get('songPlaying'));

    useEffect(() => {
        setShowBanner(!cookies.pbcPpAll && !cookies.pbcPpDec);
        if (cookies.pbcPpAll) {
            initialize('UA-346260-11');
            pageview(window.location.pathname + window.location.search);
        }
    }, [cookies]);

    let cookieExpires = new Date();
    cookieExpires.setFullYear(cookieExpires.getFullYear() + 5);

    return (
        <Router>
            <ScrollToTop>
                {showBanner && (
                    <CookieBanner
                        onAccept={() => setCookie('pbcPpAll', Date.now(), { path: '/', expires: cookieExpires })}
                        onDecline={() => setCookie('pbcPpDec', Date.now(), { path: '/', expires: cookieExpires })}
                    />
                )}
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/song/:name" exact component={Song} />
                    <Route path="/project/:name" exact component={Artist} />
                    <Route path="/artist/:name" exact component={Writer} />
                    <Route path="/invoice/:id" exact component={Invoice} />
                    <Route path="/download/:id" exact component={Download} />
                    <Route path="/album/:name/:id" exact component={Album} />
                    <Route path="/about" exact component={About} />
                    <Route path="/artists" exact component={Artists} />
                    <Route path="/albums" exact component={Albums} />
                    <Route path="/not-found" exact component={NotFound} />
                    <Redirect from="*" to="/not-found" />
                </Switch>
                {currentSong && <MusicPlayer play={songPlaying} list={playlist} />}
            </ScrollToTop>
        </Router>
    );
}

export default Routes;
