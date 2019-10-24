import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import FilterSvg from 'assets/images/header/filter.svg';
import PresetSvg from 'assets/images/header/preset.svg';
import SearchSvg from 'assets/images/header/search.svg';
import LogoSvg from 'assets/images/header/logo.svg';
import CartSvg from 'assets/images/header/cart.svg';
import MenuSvg from 'assets/images/header/menu.svg';
import selectors from 'selectors';

import FiltersPanel from 'components/filters-panel';
import PresetsPanel from 'components/presets-panel';

import { setState } from 'actions/general';

import './style.scss';

const svgDefaultFill = '#808080';
const svgActiveFill = '#0092C5';

/**
 * Header component
 * @returns {React.Component}
 */
function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [panelStyle, setPanelStyle] = useState({ top: 100 });
    const [filtersOpened, setFiltersOpened] = useState(false);
    const [presetsOpened, setPresetsOpened] = useState(false);
    const [searchOpened, setSearchOpened] = useState(false);
    const filtersValues = useSelector(selectors.filters.getAll);

    const dispatch = useDispatch();

    const scrollHandler = () => {
        if (window.pageYOffset > 100) {
            setScrolled(true);
            setPanelStyle({ top: 60 });
        } else {
            setScrolled(false);
            setPanelStyle({ top: 100 });
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

    useEffect(() => {
        if (presetsOpened) {
            setPresetsOpened(false);
            setFiltersOpened(true);
        }
    }, [filtersValues]);

    const openSearchBar = () => {
        setSearchOpened(!searchOpened);
        if (!filtersOpened) {
            setFiltersOpened(true);
        }
        if (presetsOpened) {
            setPresetsOpened(false);
        }
    };

    const openFiltersPanel = () => {
        setFiltersOpened(!filtersOpened);
        dispatch(setState('filtersOpened', !filtersOpened));
        if (searchOpened && filtersOpened) {
            setSearchOpened(false);
        }
    };

    return (
        <>
            <header className={headerModifier}>
                <div className="header__buttons">
                    <FilterSvg
                        className="header__buttons-icon"
                        onClick={() => openFiltersPanel()}
                        fill={filtersOpened ? svgActiveFill : svgDefaultFill}
                    />
                    <PresetSvg
                        className="header__buttons-icon"
                        onClick={() => setPresetsOpened(!presetsOpened)}
                        fill={presetsOpened ? svgActiveFill : svgDefaultFill}
                    />
                    <SearchSvg
                        className="header__buttons-icon"
                        onClick={() => openSearchBar()}
                        fill={searchOpened ? svgActiveFill : svgDefaultFill}
                    />
                </div>
                <div className="header__logo flex flex--space-between">
                    <LogoSvg className={logoModifier} fill={svgActiveFill} />
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
                    <CartSvg className="header__buttons-icon" fill={svgDefaultFill} />
                    <MenuSvg className="header__buttons-icon" fill={svgDefaultFill} />
                </div>
            </header>
            <FiltersPanel visible={filtersOpened} style={panelStyle} showSearch={searchOpened} />
            <PresetsPanel visible={presetsOpened} style={panelStyle} />
        </>
    );
}

Header.displayName = 'Header';

export default Header;
