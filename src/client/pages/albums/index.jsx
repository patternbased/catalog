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
    process.env.NODE_ENV === 'production' ? 'https://catalog.patternbased.com/' : 'https://patternbased.herokuapp.com/';

/**
 * Component to handle the Albums page
 * @returns {React.Component}
 */
function AlbumsPage() {
    const [albums, setAlbums] = useState([]);

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
        api.get('/api/all-albums').then((res) => {
            if (res.albums) {
                setAlbums(res.albums);
            }
        });
    }, []);

    return (
        <>
            <Header />
            <div className={artistClass}>
                <div className="albums">
                    <div className="albums__content">
                        <div className="albums__title albums__title--big">Albums and Collections</div>
                    </div>
                </div>

                <div className="albums__tiles">
                    {albums.map((art, index) => (
                        <Link key={index} to={`/album/${art.slug}/${art.pbId}`}>
                            <div
                                className="albums__tile"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6)), url(${art.cover})`,
                                }}
                            >
                                {art.title}
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="albums__footer">
                    <MenuFooter full={true} />
                </div>
            </div>
            <Helmet>
                <meta property="og:title" content="PB Albums and Collections" />
                <meta
                    property="og:description"
                    content="The PatternBased Catalog is an ever expanding collection of textural/emotive sound &amp; music that ranges from sparse tones and drones to rhythmic works over a variety of styles and moods."
                />
                <meta property="og:image" content={`${baseUrl}assets/images/PB_catalog_PreviewImg.jpg`} />
                <meta property="og:url" content={`${baseUrl}albums`} />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>
        </>
    );
}

AlbumsPage.displayName = 'AlbumsPage';

export default AlbumsPage;
