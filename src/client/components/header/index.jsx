import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { HEADER_HEIGHTS } from 'utils/constants';
import FilterSvg from 'assets/images/header/filter.svg';
import PresetSvg from 'assets/images/header/preset.svg';
import SearchSvg from 'assets/images/header/search.svg';
import LogoSvg from 'assets/images/header/logo.svg';
import FullLogoSvg from 'assets/images/header/PatternBased_CatalogSearch_logo.svg';
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
function Header({ history }) {
    const [scrolled, setScrolled] = useState(false);
    const [panelStyle, setPanelStyle] = useState({ top: `${HEADER_HEIGHTS.big}px` });
    const [filtersOpened, setFiltersOpened] = useState(true);
    const [presetsOpened, setPresetsOpened] = useState(false);
    const [searchOpened, setSearchOpened] = useState(false);
    const filtersValues = useSelector(selectors.filters.getApplied);

    const filtersPanelState = useSelector(selectors.general.get('filtersOpened'));
    const presetsPanelState = useSelector(selectors.general.get('presetsOpened'));

    useEffect(() => {
        setFiltersOpened(filtersPanelState);
        setPresetsOpened(presetsPanelState);
    }, [filtersPanelState, presetsPanelState]);

    const dispatch = useDispatch();

    const scrollHandler = () => {
        if (window.pageYOffset > HEADER_HEIGHTS.big) {
            setScrolled(true);
            setPanelStyle({ top: `${HEADER_HEIGHTS.small}px` });
            dispatch(setState('scrolled', true));
        } else {
            setScrolled(false);
            setPanelStyle({ top: `${HEADER_HEIGHTS.big}px` });
            dispatch(setState('scrolled', false));
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

    useEffect(() => {
        if (presetsOpened) {
            setPresetsOpened(false);
            setFiltersOpened(true);
            dispatch(setState('presetsOpened', false));
            dispatch(setState('filtersOpened', true));
        }
    }, [filtersValues]);

    const openSearchBar = () => {
        setSearchOpened(!searchOpened);
        if (!filtersOpened) {
            setFiltersOpened(true);
            dispatch(setState('filtersOpened', true));
        }
        if (presetsOpened) {
            setPresetsOpened(false);
            dispatch(setState('filtersOpened', true));
        }
    };

    const openFiltersPanel = () => {
        setFiltersOpened(!filtersOpened);
        dispatch(setState('filtersOpened', !filtersOpened));
        if (searchOpened && filtersOpened) {
            setSearchOpened(false);
        }
    };

    const openPresetsPanel = () => {
        setPresetsOpened(!presetsOpened);
        dispatch(setState('presetsOpened', !presetsOpened));
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
                        onClick={() => openPresetsPanel()}
                        fill={presetsOpened ? svgActiveFill : svgDefaultFill}
                    />
                    <SearchSvg
                        className="header__buttons-icon"
                        onClick={() => openSearchBar()}
                        fill={searchOpened ? svgActiveFill : svgDefaultFill}
                    />
                </div>
                <div className="header__logo" onClick={() => history.push('/')}>
                    {scrolled ? (
                        <LogoSvg className="header__logo-icon header__logo-icon--small" fill={svgActiveFill} />
                    ) : (
                        <FullLogoSvg className="header__logo-icon" />
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

Header.propTypes = {
    history: PropTypes.object,
};

export default withRouter(Header);
