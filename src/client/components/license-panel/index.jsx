/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'components/button';
import selectors from 'selectors';
import { BUY_LICENSE_TYPES } from 'utils/constants';

import CloseIcon from 'assets/images/Close_Icon_Gray.svg';
import BackIcon from 'assets/images/Back-arrow.svg';

import { setState } from 'actions/general';

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

    const _renderParentContent = () => {
        return (
            <div className="license-panel__body__content__buttons">
                <div className="license-panel__body__content__title">Select a License Type</div>
                {Object.keys(BUY_LICENSE_TYPES[parentNav].children).map((key, index) => (
                    <Button
                        key={index}
                        onClick={() => {
                            if (!BUY_LICENSE_TYPES[parentNav].children[key].custom) {
                                setChildNav(key);
                            }
                        }}
                    >
                        {key}
                    </Button>
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
                        <Button key={index} onClick={() => console.log(price)}>
                            {price} <br /> ${elem.details.prices[price]}
                        </Button>
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
                            <Button key={index} onClick={() => console.log(price)}>
                                {price} <br /> ${child.details.prices[price]}
                            </Button>
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

    return (
        <div>
            {song && (
                <div className={panelClass} style={style}>
                    <div className="license-panel__container">
                        <div className="license-panel__header">
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
                        <div className="license-panel__body">
                            <div className="license-panel__body__content">
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
                                            <Button key={index} onClick={() => setParentNav(key)}>
                                                {key}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="license-panel__body__footer"></div>
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
