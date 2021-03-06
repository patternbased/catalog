/* eslint-disable max-lines-per-function */
import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import selectors from 'selectors';

import Header from 'components/header';
import MenuFooter from 'components/menu-panel/menu-footer';

import { setState } from 'actions/general';

import { api } from '../../services';

import './style.scss';

const baseUrl =
    process.env.NODE_ENV === 'production' ? 'https://catalog.patternbased.com' : 'https://patternbased.herokuapp.com/';

/**
 * Component to handle the Artists page
 * @returns {React.Component}
 */
function ArtistsPage() {
    const [artists, setArtists] = useState([]);
    const [writers, setWriters] = useState([]);
    const [all, setAll] = useState([]);

    const filtersPanelState = useSelector(selectors.general.get('filtersOpened'));
    const presetsPanelState = useSelector(selectors.general.get('presetsOpened'));
    const dispatch = useDispatch();

    const artistClass = useMemo(
        () =>
            classnames('app-container', {
                'app-container--pushed': filtersPanelState || presetsPanelState,
            }),
        [filtersPanelState, presetsPanelState]
    );

    useEffect(() => {
        dispatch(setState('menuOpened', false));
        dispatch(setState('presetsOpened', false));
        api.get('/api/all-artists').then((res) => {
            if (res.artists) {
                const art = res.artists.filter((a) => a.show);
                art.forEach((a) => {
                    a.type = 'project';
                });
                setArtists(art);
            }
        });
        api.get('/api/all-writers').then((res) => {
            if (res.writers) {
                const art = res.writers.filter((a) => a.show);
                art.forEach((a) => {
                    a.type = 'artist';
                });
                setWriters(art);
            }
        });
    }, []);

    useEffect(() => {
        setAll([...artists].concat([...writers]));
    }, [artists, writers]);

    return (
        <>
            <Header />
            <div className={artistClass}>
                <div className="artists">
                    <div className="artists__content">
                        <div className="artists__title artists__title--big">PatternBased ARTISTS</div>
                    </div>
                </div>

                <div className="artists__tiles">
                    {all.map((art, index) => {
                        if (art.name !== 'Band / Project' && art.name !== 'Writers') {
                            return (
                                <Link key={index} to={`/${art.type}/${art.name.toLowerCase().split(' ').join('-')}`}>
                                    <div
                                        className="artists__tile"
                                        style={{
                                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6)), url(${art.image})`,
                                        }}
                                    >
                                        {art.name}
                                    </div>
                                </Link>
                            );
                        }
                    })}
                </div>
                <div className="artists__footer">
                    <MenuFooter full={true} />
                </div>
            </div>
            <Helmet>
                <meta property="og:title" content="PB Projects and Artists" />
                <meta
                    property="og:description"
                    content="The PatternBased Catalog is an ever expanding collection of textural/emotive sound &amp; music that ranges from sparse tones and drones to rhythmic works over a variety of styles and moods."
                />
                <meta property="og:image" content={`${baseUrl}assets/images/PB_catalog_PreviewImg.jpg`} />
                <meta property="og:url" content={`${baseUrl}`} />
            </Helmet>
        </>
    );
}

ArtistsPage.displayName = 'ArtistsPage';

export default ArtistsPage;
