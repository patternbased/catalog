/* eslint-disable max-lines-per-function */
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactGA from 'react-ga';
import { HEADER_HEIGHTS } from 'utils/constants';
import FilterSvg from 'assets/images/header/filter.svg';
import PresetSvg from 'assets/images/header/preset.svg';
import SearchSvg from 'assets/images/header/search.svg';
import LogoSvg from 'assets/images/header/logo.svg';
import FullLogoSvg from 'assets/images/header/PatternBased_CatalogSearch_logo.svg';
import CartSvg from 'assets/images/header/cart.svg';
import ActiveCartSvg from 'assets/images/Cart_Icon_activated.svg';
import MenuSvg from 'assets/images/header/menu.svg';
import CloseIcon from 'assets/images/Close_Icon_Gray.svg';
import selectors from 'selectors';

import FiltersPanel from 'components/filters-panel';
import PresetsPanel from 'components/presets-panel';
import MenuPanel from 'components/menu-panel';
import ReqSuggestionsPanel from 'components/suggestions-panel';
import ReqComposingPanel from 'components/composing-panel';
import CustomWorkPanel from 'components/custom-work-panel';
import CustomLicensePanel from 'components/custom-license-panel';
import LicensePanel from 'components/license-panel';
import ContactPanel from 'components/contact-panel';
import SpecialRatePanel from 'components/special-rate-panel';
import FullLicensePanel from 'components/full-license-panel';
import CartPanel from 'components/cart-panel';
import CheckoutPanel from 'components/checkout-panel';

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
    const [panelStyle, setPanelStyle] = useState({
        top: `${window.innerWidth > 768 ? HEADER_HEIGHTS.big : HEADER_HEIGHTS.small}px`,
    });
    const [filtersOpened, setFiltersOpened] = useState(true);
    const [presetsOpened, setPresetsOpened] = useState(false);
    const [menuOpened, setMenuOpened] = useState(false);
    const [reqSuggestionsOpened, setReqSuggestionsOpened] = useState(false);
    const [reqComposingOpened, setReqComposingOpened] = useState(false);
    const [customWorkOpened, setCustomWorkOpened] = useState(false);
    const [customLicenseOpened, setCustomLicenseOpened] = useState(false);
    const [fullLicenseOpened, setFullLicenseOpened] = useState(false);
    const [licenseOpened, setLicenseOpened] = useState(false);
    const [contactOpened, setContactOpened] = useState(false);
    const [specialRateOpened, setSpecialRateOpened] = useState(false);
    const [searchOpened, setSearchOpened] = useState(false);
    const [cartOpened, setCartOpened] = useState(false);
    const [checkoutOpened, setCheckoutOpened] = useState(false);
    const [licenseType, setLicenseType] = useState('none');
    const filtersValues = useSelector(selectors.filters.getApplied);

    const filtersPanelState = useSelector(selectors.general.get('filtersOpened'));
    const presetsPanelState = useSelector(selectors.general.get('presetsOpened'));
    const menuPanelState = useSelector(selectors.general.get('menuOpened'));
    const reqSuggestionsPanelState = useSelector(selectors.general.get('reqSuggestionsOpened'));
    const reqComposingPanelState = useSelector(selectors.general.get('reqComposingOpened'));
    const customWorkPanelState = useSelector(selectors.general.get('customWorkOpened'));
    const customLicensePanelState = useSelector(selectors.general.get('customLicenseOpened'));
    const fullLicensePanelState = useSelector(selectors.general.get('fullLicenseOpened'));
    const licensePanelState = useSelector(selectors.general.get('licenseOpened'));
    const contactPanelState = useSelector(selectors.general.get('contactOpened'));
    const specialRatePanelState = useSelector(selectors.general.get('specialRateOpened'));
    const cartPanelState = useSelector(selectors.general.get('cartOpened'));
    const checkoutPanelState = useSelector(selectors.general.get('checkoutOpened'));
    const chosenLicenseType = useSelector(selectors.library.getCustomLicenseType);
    const cartItemsNo = useSelector(selectors.cart.getCartItemsNo);
    const queueSongs = useSelector(selectors.library.getQueue);

    useEffect(() => {
        setFiltersOpened(filtersPanelState);
        setPresetsOpened(presetsPanelState);
        setMenuOpened(menuPanelState);
        setReqSuggestionsOpened(reqSuggestionsPanelState);
        setReqComposingOpened(reqComposingPanelState);
        setCustomWorkOpened(customWorkPanelState);
        setCustomLicenseOpened(customLicensePanelState);
        setFullLicenseOpened(fullLicensePanelState);
        setLicenseOpened(licensePanelState);
        setContactOpened(contactPanelState);
        setCartOpened(cartPanelState);
        setCheckoutOpened(checkoutPanelState);
        setLicenseType(chosenLicenseType || 'none');
        setSpecialRateOpened(specialRatePanelState);
    }, [
        filtersPanelState,
        presetsPanelState,
        menuPanelState,
        reqSuggestionsPanelState,
        reqComposingPanelState,
        customWorkPanelState,
        customLicensePanelState,
        fullLicensePanelState,
        licensePanelState,
        contactPanelState,
        chosenLicenseType,
        cartPanelState,
        checkoutPanelState,
        specialRatePanelState,
    ]);

    const dispatch = useDispatch();

    const scrollHandler = () => {
        if (window.pageYOffset > HEADER_HEIGHTS.big && !scrolled && window.innerWidth > 768) {
            setScrolled(true);
            setPanelStyle({ top: `${HEADER_HEIGHTS.small}px` });
            dispatch(setState('scrolled', true));
        } else if (window.pageYOffset <= HEADER_HEIGHTS.big && scrolled && window.innerWidth > 768) {
            setScrolled(false);
            setPanelStyle({ top: `${HEADER_HEIGHTS.big}px` });
            dispatch(setState('scrolled', false));
        }
    };

    useEffect(() => {
        window.addEventListener('beforeunload', (event) => {
            ReactGA.event({
                category: 'Session',
                action: 'Session ended',
                label: `No. of songs in queue: ${queueSongs.length}`,
            });
            // event.preventDefault();
            // event.returnValue = '';
        });
    });

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler);

        return () => {
            window.removeEventListener('scroll', scrollHandler);
        };
    }, [scrolled]);

    const headerModifier = useMemo(
        () =>
            classnames('header flex flex--space-between', {
                'header--small': scrolled,
                'header--mobile': filtersOpened && window.innerWidth < 541,
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

    const openMenuPanel = () => {
        setMenuOpened(!menuOpened);
        dispatch(setState('menuOpened', !menuOpened));
    };

    const closeMobileFilters = () => {
        setFiltersOpened(false);
        setPresetsOpened(false);
        setSearchOpened(false);
        dispatch(setState('filtersOpened', false));
        dispatch(setState('presetsOpened', false));
    };

    return (
        <>
            <header className={headerModifier}>
                <div className="header__buttons">
                    <FilterSvg
                        className="header__buttons-icon header__buttons-icon--apart"
                        onClick={() => openFiltersPanel()}
                        fill={filtersOpened ? svgActiveFill : svgDefaultFill}
                    />
                    <PresetSvg
                        className={classnames('header__buttons-icon header__buttons-icon--apart', {
                            'header__mobile-hide': !filtersOpened && window.innerWidth < 541,
                        })}
                        onClick={() => openPresetsPanel()}
                        fill={presetsOpened ? svgActiveFill : svgDefaultFill}
                    />
                    <SearchSvg
                        className={classnames('header__buttons-icon header__buttons-icon--apart', {
                            'header__mobile-hide': !filtersOpened && window.innerWidth < 541,
                        })}
                        onClick={() => openSearchBar()}
                        fill={searchOpened ? svgActiveFill : svgDefaultFill}
                    />
                    {filtersOpened && window.innerWidth < 541 && (
                        <div className="header__buttons-close" onClick={() => closeMobileFilters()}>
                            <CloseIcon />
                        </div>
                    )}
                </div>
                <div
                    onClick={() => history.push('/')}
                    className={classnames('header__logo', {
                        'header__mobile-hide': filtersOpened && window.innerWidth < 541,
                    })}
                >
                    {scrolled && window.innerHeight > 768 ? (
                        <LogoSvg className="header__logo-icon header__logo-icon--small" fill={svgActiveFill} />
                    ) : (
                        <>
                            <FullLogoSvg className="header__logo-icon header__mobile-hide" />
                            <LogoSvg
                                className="header__logo-icon header__logo-icon--small header__desktop-hide"
                                fill={svgActiveFill}
                            />
                        </>
                    )}
                </div>
                <div
                    className={classnames('header__buttons', {
                        'header__mobile-hide': filtersOpened && window.innerWidth < 541,
                    })}
                >
                    {cartItemsNo > 0 ? (
                        <div
                            className="header__buttons-icon header__buttons-icon--cart"
                            onClick={() => dispatch(setState('cartOpened', !cartOpened))}
                        >
                            <span>{cartItemsNo}</span>
                            <ActiveCartSvg fill={svgActiveFill} />
                        </div>
                    ) : (
                        <CartSvg
                            className="header__buttons-icon"
                            fill={cartOpened ? svgActiveFill : svgDefaultFill}
                            onClick={() => dispatch(setState('cartOpened', !cartOpened))}
                        />
                    )}

                    <MenuSvg
                        className="header__buttons-icon"
                        onClick={() => openMenuPanel()}
                        fill={menuOpened ? svgActiveFill : svgDefaultFill}
                    />
                </div>
            </header>
            <FiltersPanel
                visible={filtersOpened}
                style={panelStyle}
                showSearch={searchOpened}
                onSearchSelected={() => setSearchOpened(false)}
            />
            <PresetsPanel visible={presetsOpened} style={panelStyle} />
            <MenuPanel visible={menuOpened} style={panelStyle} />
            <ReqSuggestionsPanel visible={reqSuggestionsOpened} style={panelStyle} />
            <ReqComposingPanel visible={reqComposingOpened} style={panelStyle} />
            <CustomWorkPanel visible={customWorkOpened} style={panelStyle} />
            <CustomLicensePanel visible={customLicenseOpened} chosenType={licenseType} style={panelStyle} />
            <FullLicensePanel visible={fullLicenseOpened} style={panelStyle} />
            <LicensePanel visible={licenseOpened} style={panelStyle} />
            <ContactPanel visible={contactOpened} style={panelStyle} />
            <CartPanel visible={cartOpened} style={panelStyle} />
            <CheckoutPanel visible={checkoutOpened} style={panelStyle} />
            <SpecialRatePanel visible={specialRateOpened} style={panelStyle} />
        </>
    );
}

Header.displayName = 'Header';

Header.propTypes = {
    history: PropTypes.object,
};

export default withRouter(Header);
