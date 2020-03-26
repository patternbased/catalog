/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'components/button';
import PaymentForm from './payment-form';
import selectors from 'selectors';

import CloseIcon from 'assets/images/Close_Icon_Gray.svg';

import { setState } from 'actions/general';

import './style.scss';

/**
 * Checkout panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function CheckoutPanel({ visible, style }) {
    const [items, setItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [success, setSuccess] = useState(false);
    const [orderNo, setOrderNo] = useState('');

    const dispatch = useDispatch();

    const cartItems = useSelector(selectors.cart.getCartItems);
    const cartSubtotal = useSelector(selectors.cart.getCartSubtotal);
    const cartTotal = useSelector(selectors.cart.getCartTotal);

    const panelClass = useMemo(
        () =>
            classnames('checkout-panel', {
                'checkout-panel--visible': visible,
            }),
        [visible]
    );

    useEffect(() => {
        setItems(cartItems);
        setSubtotal(cartSubtotal);
        setTotal(cartTotal);
    }, [cartItems]);

    const _orderSummary = () => {
        return (
            <div className="checkout-panel__body__summary">
                <div className="checkout-panel__body__summary__title">
                    {success ? `Order# ${orderNo}` : 'Order Summary'}
                </div>
                <div className="checkout-panel__body__summary__details">
                    <div className="checkout-panel__body__summary__details__item">
                        Indie Film License
                        <span className="checkout-panel__body__summary__details__item__bolded">${subtotal}</span>
                    </div>
                    <div className="checkout-panel__body__summary__details__item">
                        Subtotal
                        <span>${subtotal}</span>
                    </div>
                    <div className="checkout-panel__body__summary__details__item checkout-panel__body__summary__details__item__bolded">
                        Total
                        <span className="checkout-panel__body__summary__details__item__bolded">${total}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className={panelClass} style={style}>
                <div className="checkout-panel__container">
                    <div className="checkout-panel__header">
                        <div className="checkout-panel__header__title">
                            <CloseIcon onClick={() => dispatch(setState('checkoutOpened', false))} />
                            {success ? 'Download' : 'Checkout'}
                        </div>
                    </div>
                    <div className="checkout-panel__body">
                        {success && (
                            <div className="checkout-panel__body__success">
                                THANK YOU
                                <span>Your order is complete!</span>
                            </div>
                        )}
                        {_orderSummary()}
                        <div className="checkout-panel__body__summary__title">Payment Information</div>
                        <PaymentForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

CheckoutPanel.displayName = 'CheckoutPanel';

CheckoutPanel.propTypes = {
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    style: PropTypes.object,
};

CheckoutPanel.defaultProps = {
    visible: false,
    style: {},
};

export default memo(CheckoutPanel);
