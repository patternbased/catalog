/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'components/button';
import SpecialLicenseBanner from 'components/special-license-banner';
import MenuFooter from 'components/menu-panel/menu-footer';
import selectors from 'selectors';

import CloseIcon from 'assets/images/Close_Icon_Gray.svg';
import CartSvg from 'assets/images/header/cart.svg';

import { setState } from 'actions/general';
import { removeFromCart, setPromoCode } from 'actions/cart';

import './style.scss';

/**
 * Cart panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function CartPanel({ visible, style }) {
    const [items, setItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [itemsHovered, setItemsHovered] = useState([]);

    const dispatch = useDispatch();

    const cartItems = useSelector(selectors.cart.getCartItems);
    const cartSubtotal = useSelector(selectors.cart.getCartSubtotal);
    const cartTotal = useSelector(selectors.cart.getCartTotal);

    const panelClass = useMemo(
        () =>
            classnames('cart-panel', {
                'cart-panel--visible': visible,
            }),
        [visible]
    );

    useEffect(() => {
        if (!cartItems.length) {
            dispatch(setPromoCode(null));
        }
        setItems(cartItems);
        setSubtotal(cartSubtotal);
        setTotal(cartTotal);
    }, [cartItems]);

    const addToHover = (idx) => {
        let hovCopy = [...itemsHovered];
        hovCopy.push(idx);
        setItemsHovered(hovCopy);
    };

    const removeFromHover = (idx) => {
        let hovCopy = [...itemsHovered];
        hovCopy = hovCopy.filter((x) => x !== idx);
        setItemsHovered(hovCopy);
    };

    return (
        <div>
            <div className={panelClass} style={style}>
                <div className="cart-panel__container">
                    <div className="cart-panel__header">
                        <div className="cart-panel__header__title">
                            <CloseIcon onClick={() => dispatch(setState('cartOpened', false))} />
                            Cart
                        </div>
                    </div>
                    <div className="cart-panel__body">
                        {items.length === 0 ? (
                            <>
                                <div className="cart-panel__body__empty">
                                    <CartSvg fill="#0092C5" />
                                    Your cart is empty.
                                </div>
                                <div className="cart-panel__body__footer">
                                    <MenuFooter />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="cart-panel__body__songs">
                                    {items.map((item, index) => (
                                        <div className="cart-panel__body__songs__single" key={index}>
                                            <div className="cart-panel__body__songs__single__details">
                                                {itemsHovered.includes(index) ? (
                                                    <div
                                                        className="cart-panel__body__songs__single__details__remove"
                                                        onClick={() => dispatch(removeFromCart(item.id))}
                                                        onMouseLeave={() => removeFromHover(index)}
                                                    >
                                                        <CloseIcon />
                                                    </div>
                                                ) : (
                                                    <img src={item.song.image} onMouseEnter={() => addToHover(index)} />
                                                )}
                                                <div className="cart-panel__body__songs__single__details__wrapper">
                                                    <div className="cart-panel__body__songs__single__details__title">
                                                        {item.song.title}
                                                    </div>
                                                    <div className="cart-panel__body__songs__single__details__artist">
                                                        by {item.song.artist}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="cart-panel__body__songs__single__license">{item.type}</div>
                                            <div className="cart-panel__body__songs__single__price">${item.price}</div>
                                        </div>
                                    ))}
                                    <div className="cart-panel__body__songs__total">
                                        <div className="cart-panel__body__songs__total__sub">
                                            Subtotal <span>${subtotal}</span>
                                        </div>
                                        <div className="cart-panel__body__songs__total__all">
                                            Total <span>${total}</span>
                                        </div>
                                    </div>
                                    <div className="cart-panel__body__songs__buttons">
                                        <Button
                                            className="checkout"
                                            width="100%"
                                            onClick={() => dispatch(setState('checkoutOpened', true))}
                                        >
                                            CHECKOUT
                                        </Button>
                                        <Button width="100%" onClick={() => dispatch(setState('cartOpened', false))}>
                                            Continue Listening
                                        </Button>
                                    </div>
                                </div>
                                <div className="cart-panel__body__footer cart-panel__body__footer--distanced">
                                    <SpecialLicenseBanner type="fullLicense" />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

CartPanel.displayName = 'CartPanel';

CartPanel.propTypes = {
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    style: PropTypes.object,
};

CartPanel.defaultProps = {
    visible: false,
    style: {},
};

export default memo(CartPanel);
