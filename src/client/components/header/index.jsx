import React, { useState, useEffect, useMemo } from 'react';
import classnames from 'classnames';

import LeftPanel from 'components/left-panel';

import './style.scss';

/**
 * Header component
 * @returns {React.Component}
 */
function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [panelStyle, setPanelStyle] = useState({ top: 100, height: 'calc(100vh + 100px)' });
    const [filtersOpened, setFiltersOpened] = useState(false);

    const scrollHandler = () => {
        if (window.pageYOffset > 100) {
            setScrolled(true);
            setPanelStyle({ top: 60, height: 'calc(100vh + 60px)' });
        } else {
            setScrolled(false);
            setPanelStyle({ top: 100, height: 'calc(100vh + 100px)' });
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler);
    }, [scrolled]);

    const headerModifier = useMemo(
        () =>
            classnames('header flex flex--space-between', {
                'header--small': scrolled,
            }),
        [scrolled]
    );

    const logoModifier = useMemo(
        () =>
            classnames('header__logo-icon', {
                'header__logo-icon--small': scrolled,
            }),
        [scrolled]
    );

    return (
        <>
            <header className={headerModifier}>
                <div className="header__buttons">
                    <img
                        className="header__buttons-icon"
                        src={filtersOpened ? '/assets/images/filter-on.png' : '/assets/images/filter.png'}
                        onClick={() => setFiltersOpened(!filtersOpened)}
                    />
                    <img className="header__buttons-icon" src="/assets/images/preset.png" />
                    <img className="header__buttons-icon" src="/assets/images/search.png" />
                </div>
                <div className="header__logo flex flex--space-between">
                    <img className={logoModifier} src="/assets/images/logo.png" />
                    {!scrolled && (
                        <div className="header__logo__text">
                            <p className="header__logo__text-main">
                                Pattern<span className="header__logo__text-main--colored">Based</span>
                            </p>
                            <p className="header__logo__text-secondary">Catalog Search</p>
                        </div>
                    )}
                </div>
                <div className="header__buttons">
                    <img className="header__buttons-icon" src="/assets/images/cart.png" />
                    <img className="header__buttons-icon" src="/assets/images/menu.png" />
                </div>
            </header>
            <LeftPanel visible={filtersOpened} style={panelStyle} />
        </>
    );
}

Header.displayName = 'Header';

export default Header;
