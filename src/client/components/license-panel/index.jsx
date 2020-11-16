/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { event } from 'react-ga';
import selectors from 'selectors';
import SpecialLicenseBanner from 'components/special-license-banner';
import { BUY_LICENSE_TYPES } from 'utils/constants';

import CloseIcon from 'assets/images/Close_Icon_Gray.svg';
import BackIcon from 'assets/images/Back-arrow.svg';
import FormIcon from 'assets/images/custom-license.svg';
import AddIcon from 'assets/images/license-add.svg';

import { setState } from 'actions/general';
import { setCustomLicenseType } from 'actions/library';
import { addToCart } from 'actions/cart';

import './style.scss';

/**
 * License panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function LicensePanel({ visible, style }) {
    const [parentNav, setParentNav] = useState(null);
    const [childNav, setChildNav] = useState(null);
    const [showDescription, setShowDescription] = useState([]);
    const [priceHovered, setPriceHovered] = useState([]);
    const [showMainCustom, setShowMainCustom] = useState(false);
    const [showParentDescription, setShowParentDescription] = useState('');

    const panelHeader = useRef(null);
    const panelFooter = useRef(null);
    const [panelHeaderHeight, setPanelHeaderHeight] = useState(155);
    const [panelFooterHeight, setPanelFooterHeight] = useState(200);

    useEffect(() => {
        if (parentNav || childNav) {
            setShowDescription([]);
            setPriceHovered([]);
            setPanelHeaderHeight(panelHeader.current.clientHeight);
            setPanelFooterHeight(panelFooter.current.clientHeight);
        }
    }, [parentNav, childNav]);

    const song = useSelector(selectors.library.getLicenseSong);
    const dispatch = useDispatch();

    const panelClass = useMemo(
        () =>
            classnames('license-panel', {
                'license-panel--visible': visible,
            }),
        [visible]
    );

    const navClass = useMemo(
        () =>
            classnames('license-panel__header__nav', {
                'license-panel__header__nav--light': childNav,
            }),
        [childNav]
    );

    const toShowDescription = (idx) => {
        let descriptionCopy = [...showDescription];
        descriptionCopy.push(idx);
        setShowDescription(descriptionCopy);
    };

    const hideDescription = (idx) => {
        let descriptionCopy = [...showDescription];
        descriptionCopy = descriptionCopy.filter((x) => x !== idx);
        setShowDescription(descriptionCopy);
    };

    const showAddToCart = (idx) => {
        let priceCopy = [...priceHovered];
        priceCopy.push(idx);
        setPriceHovered(priceCopy);
    };

    const hideAddToCart = (idx) => {
        let priceCopy = [...priceHovered];
        priceCopy = priceCopy.filter((x) => x !== idx);
        setPriceHovered(priceCopy);
    };

    const _renderParentContent = () => {
        return (
            <div className="license-panel__body__content__buttons">
                <div className="license-panel__body__content__title">Select a License Type</div>
                {Object.keys(BUY_LICENSE_TYPES[parentNav].children).map((key, index) => {
                    const isCustom = BUY_LICENSE_TYPES[parentNav].children[key].custom;
                    const customHovered = showDescription.includes(index) && isCustom;
                    return (
                        <div
                            className="license-panel__body__content__buttons__type"
                            onClick={() => {
                                if (isCustom) {
                                    dispatch(setCustomLicenseType(key));
                                    dispatch(setState('customLicenseOpened', true));
                                    event({
                                        category: 'License panel',
                                        action: 'Custom license clicked',
                                        label: `Custom license for ${key}`,
                                    });
                                } else {
                                    setChildNav(key);
                                    event({
                                        category: 'License panel',
                                        action: 'License clicked',
                                        label: `License type ${key}`,
                                    });
                                }
                            }}
                            onMouseOverCapture={() => toShowDescription(index)}
                            onMouseOutCapture={() => hideDescription(index)}
                            style={{
                                fontStyle: customHovered ? 'italic' : 'normal',
                                fontWeight: customHovered ? 'bold' : 'normal',
                            }}
                            key={index}
                        >
                            {customHovered ? (
                                <>
                                    Custom License
                                    <FormIcon />
                                </>
                            ) : (
                                key
                            )}
                        </div>
                    );
                })}
                {Object.keys(BUY_LICENSE_TYPES[parentNav].children).map((key, index) => (
                    <span key={index}>
                        {showDescription.includes(index) && (
                            <div className="license-panel__body__content__buttons__description">
                                <span>{key} License</span>
                                <br />
                                {BUY_LICENSE_TYPES[parentNav].children[key].description}
                            </div>
                        )}
                    </span>
                ))}
            </div>
        );
    };

    const _renderMainParentContent = () => {
        const elem = BUY_LICENSE_TYPES[parentNav];
        return (
            <>
                <div className="license-panel__body__content__buttons">
                    {Object.keys(elem.details.prices).map((price, index) => (
                        <div
                            className="license-panel__body__content__buttons__type license-panel__body__content__buttons__type--price"
                            key={index}
                            onClick={() => addItemToCart(price, elem.details.prices[price])}
                            onMouseOverCapture={() => showAddToCart(index)}
                            onMouseOutCapture={() => hideAddToCart(index)}
                        >
                            {priceHovered.includes(index) ? (
                                <>
                                    <AddIcon />
                                    Add to Cart
                                </>
                            ) : (
                                <>
                                    {price} <br /> <span>${elem.details.prices[price]}</span>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <div className="license-panel__body__content__description">
                    {Object.keys(elem.details).map((detail, index) => {
                        if (typeof elem.details[detail] === 'string') {
                            return (
                                <div className="license-panel__body__content__description__item" key={index}>
                                    <span>{detail}: </span>
                                    {elem.details[detail]}
                                </div>
                            );
                        }
                    })}
                </div>
            </>
        );
    };

    const _renderChildrenContent = () => {
        const child = BUY_LICENSE_TYPES[parentNav].children[childNav];
        const toCustomForm = BUY_LICENSE_TYPES[parentNav].children[childNav].custom;
        if (!toCustomForm) {
            return (
                <>
                    <div className="license-panel__body__content__buttons">
                        {Object.keys(child.details.prices).map((price, index) => (
                            <div
                                className="license-panel__body__content__buttons__type license-panel__body__content__buttons__type--price"
                                key={index}
                                onClick={() => addItemToCart(price, child.details.prices[price])}
                                onMouseOverCapture={() => showAddToCart(index)}
                                onMouseLeave={() => hideAddToCart(index)}
                            >
                                {priceHovered.includes(index) ? (
                                    <>
                                        <AddIcon />
                                        Add to Cart
                                    </>
                                ) : (
                                    <>
                                        {price} <br /> <span>${child.details.prices[price]}</span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="license-panel__body__content__description">
                        {Object.keys(child.details).map((detail, index) => {
                            if (typeof child.details[detail] === 'string') {
                                return (
                                    <div className="license-panel__body__content__description__item" key={index}>
                                        <span>{detail}: </span>
                                        {child.details[detail]}
                                    </div>
                                );
                            }
                        })}
                    </div>
                </>
            );
        }
    };

    const addItemToCart = (licType, price) => {
        dispatch(addToCart(licType, price, song));
        dispatch(setState('cartOpened', true));
        event({
            category: 'License panel',
            action: 'License clicked',
            label: `Add to cart license ${licType} for ${song.title}`,
        });
    };

    return (
        <div>
            {song && (
                <div className={panelClass} style={style}>
                    <div className="license-panel__container">
                        <div className="license-panel__header" ref={panelHeader}>
                            <div className="license-panel__header__title">
                                <CloseIcon onClick={() => dispatch(setState('licenseOpened', false))} />
                                License
                            </div>
                            <div className="license-panel__header__song">
                                <img className="license-panel__header__song__image" src={song.image} />
                                <div className="license-panel__header__song__details">
                                    <div className="license-panel__header__song__details__title">{song.title}</div>
                                    <div className="license-panel__header__song__details__artist">by {song.artist}</div>
                                </div>
                            </div>
                            <div className={navClass}>
                                {parentNav && (
                                    <div className="license-panel__header__nav__section">
                                        {!childNav && <BackIcon onClick={() => setParentNav(null)} />}
                                        {parentNav}
                                    </div>
                                )}
                                {childNav && (
                                    <div className="license-panel__header__nav__section">
                                        <BackIcon onClick={() => setChildNav(null)} />
                                        {childNav}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="license-panel__body" style={{ height: `calc(100% - ${panelHeaderHeight}px)` }}>
                            <div
                                className="license-panel__body__content"
                                style={{ height: `calc(100% - ${panelFooterHeight}px)` }}
                            >
                                {childNav ? (
                                    _renderChildrenContent()
                                ) : parentNav ? (
                                    <>
                                        {BUY_LICENSE_TYPES[parentNav].parent
                                            ? _renderParentContent()
                                            : _renderMainParentContent()}
                                    </>
                                ) : (
                                    <div className="license-panel__body__content__buttons">
                                        <div className="license-panel__body__content__title">Select a License Type</div>
                                        {Object.keys(BUY_LICENSE_TYPES).map((key, index) => (
                                            <div
                                                className="license-panel__body__content__buttons__type"
                                                key={index}
                                                onClick={() => setParentNav(key)}
                                                onMouseEnter={() =>
                                                    setShowParentDescription(!BUY_LICENSE_TYPES[key].parent ? key : '')
                                                }
                                                onMouseLeave={() => setShowParentDescription('')}
                                            >
                                                {key}
                                            </div>
                                        ))}
                                        {showParentDescription.length > 0 && (
                                            <div className="license-panel__body__content__buttons__description">
                                                {BUY_LICENSE_TYPES[showParentDescription].description}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="license-panel__body__footer" ref={panelFooter}>
                                <SpecialLicenseBanner
                                    type={
                                        childNav && BUY_LICENSE_TYPES[parentNav].children[childNav].footerType
                                            ? BUY_LICENSE_TYPES[parentNav].children[childNav].footerType
                                            : parentNav && BUY_LICENSE_TYPES[parentNav].footerType
                                            ? BUY_LICENSE_TYPES[parentNav].footerType
                                            : 'none'
                                    }
                                />
                                <div className="license-panel__body__footer__padded">
                                    <div className="license-panel__body__content__title">
                                        Don&apos;t see the right license?
                                    </div>
                                    <div className="license-panel__body__content__buttons">
                                        <div
                                            className="license-panel__body__content__buttons__type"
                                            onClick={() => dispatch(setState('customLicenseOpened', true))}
                                            onMouseOverCapture={() => setShowMainCustom(true)}
                                            onMouseOutCapture={() => setShowMainCustom(false)}
                                        >
                                            Custom license
                                            {showMainCustom && <FormIcon />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

LicensePanel.displayName = 'LicensePanel';

LicensePanel.propTypes = {
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    style: PropTypes.object,
};

LicensePanel.defaultProps = {
    visible: false,
    style: {},
};

export default memo(LicensePanel);
