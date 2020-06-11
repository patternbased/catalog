/* eslint-disable max-lines-per-function */
import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import Header from 'components/header';
import MenuFooter from 'components/menu-panel/menu-footer';
import selectors from 'selectors';

import { setState } from 'actions/general';

import { api } from '../../services';

import './style.scss';

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
        dispatch(setState('filtersOpened', false));
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
                <div className="artists">
                    <div className="artists__content">
                        <div className="artists__title artists__title--big">Albums and Collections</div>
                    </div>
                </div>

                <div className="artists__tiles">
                    {albums.map((art, index) => (
                        <Link key={index} to={`/album/${art.slug}/${art.pbId}`}>
                            <div
                                className="artists__tile"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6)), url(${art.cover})`,
                                }}
                            >
                                {art.title}
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="artists__footer">
                    <MenuFooter full={true} />
                </div>
            </div>
        </>
    );
}

AlbumsPage.displayName = 'AlbumsPage';

export default AlbumsPage;
