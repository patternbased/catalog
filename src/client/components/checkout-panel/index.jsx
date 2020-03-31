/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { CountryDropdown } from 'react-country-region-selector';
import Button from 'components/button';
import PaymentForm from './payment-form';
import selectors from 'selectors';

import CloseIcon from 'assets/images/Close_Icon_Gray.svg';

import { setState } from 'actions/general';
import { clearCartData } from 'actions/cart';

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
    const [invoiceId, setInvoiceId] = useState('');

    const [errorsHovered, setErrorsHovered] = useState([]);
    const [userFields, setUserFields] = useState(null);
    const [formCountry, setFormCountry] = useState('');

    const completePurchase = val => {
        setSuccess(true);
        setOrderNo(val.data.orderNo);
        setInvoiceId(val.data.orderId);
        dispatch(clearCartData());
    };

    const toggleErrorHovered = error => {
        let errorCopy = [...errorsHovered];
        if (errorCopy.includes(error)) {
            errorCopy = errorCopy.filter(e => e !== error);
        } else {
            errorCopy.push(error);
        }
        setErrorsHovered(errorCopy);
    };

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
        if (cartItems.length > 0) {
            setItems(cartItems);
            setSubtotal(cartSubtotal);
            setTotal(cartTotal);
        }
    }, [cartItems]);

    const _orderSummary = () => {
        return (
            <div className="checkout-panel__body__summary">
                <div className="checkout-panel__body__summary__title">
                    {success ? `Order# ${orderNo}` : 'Order Summary'}
                </div>
                <div className="checkout-panel__body__summary__details">
                    {items.map((item, index) => (
                        <div className="checkout-panel__body__summary__details__item" key={index}>
                            {item.type}
                            <span className="checkout-panel__body__summary__details__item__bolded">${item.price}</span>
                        </div>
                    ))}

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

    const goToInvoice = () => {
        window.location = `/invoice/${invoiceId}`;
    };

    return (
        <div>
            <div className={panelClass} style={style}>
                <div className="checkout-panel__container">
                    <div className="checkout-panel__header">
                        <div className="checkout-panel__header__title">
                            <CloseIcon
                                onClick={() => {
                                    dispatch(setState('checkoutOpened', false));
                                }}
                            />
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
                        {success ? (
                            <div className="checkout-panel__body__success__results">
                                <div className="checkout-panel__body__success__results__buttons">
                                    <Button width="100%">
                                        <a href={`/download/${invoiceId}`} target="_blank" rel="noopener noreferrer">
                                            Download .mp3
                                        </a>
                                    </Button>
                                    <Button width="100%">
                                        <a href={`/invoice/${invoiceId}`} target="_blank" rel="noopener noreferrer">
                                            Download Invoice
                                        </a>
                                    </Button>
                                </div>
                                <div className="checkout-panel__body__success__results__details">
                                    <div className="checkout-panel__body__success__results__details__single">
                                        <img src="/assets/images/email_icon_blue.png" />
                                        <p>
                                            You will receive these links to your email address shortly. Links will
                                            expire in 14 days. Please contact us with your Order# to re-issue download
                                            links.
                                        </p>
                                    </div>
                                    <div className="checkout-panel__body__success__results__details__single">
                                        <img src="/assets/images/Stems_icon_blue.png" />
                                        <p>
                                            Stems are available for most of our music upon request. Feel free to contact
                                            us with your Order#.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="checkout-panel__body__payment">
                                <div className="checkout-panel__body__payment__title">Your Information</div>
                                {userFields ? (
                                    <>
                                        <div className="checkout-panel__body__payment__fields">
                                            <div className="checkout-panel__body__payment__fields__single">
                                                <span>Name:</span>
                                                {`${userFields.firstName} ${userFields.lastName}`}
                                            </div>
                                            <div className="checkout-panel__body__payment__fields__single">
                                                <span>Email:</span>
                                                {userFields.email}
                                            </div>
                                            {userFields.company && userFields.company.length > 0 && (
                                                <div className="checkout-panel__body__payment__fields__single">
                                                    <span>Company:</span>
                                                    {userFields.company}
                                                </div>
                                            )}
                                            <div className="checkout-panel__body__payment__fields__single">
                                                <span>Address:</span>
                                                {`${userFields.address1} ${userFields.address2}`}
                                                <br />
                                                {`${userFields.city}, ${userFields.country}`}
                                            </div>
                                        </div>
                                        <div className="checkout-panel__body__payment__title">Payment Information</div>
                                        <PaymentForm
                                            address={userFields}
                                            total={total}
                                            items={items}
                                            onSuccess={val => completePurchase(val)}
                                        />
                                    </>
                                ) : (
                                    <div className="checkout-panel__body__payment__form">
                                        <Formik
                                            initialValues={{
                                                firstName: '',
                                                lastName: '',
                                                email: '',
                                                company: '',
                                                address: '',
                                                city: '',
                                                country: '',
                                            }}
                                            validate={values => {
                                                const errors = {};
                                                if (!values.firstName) {
                                                    errors.firstName = 'Please enter your first name.';
                                                }
                                                if (!values.lastName) {
                                                    errors.lastName = 'Please enter your last name.';
                                                }
                                                if (!values.email) {
                                                    errors.email = 'Please enter an email.';
                                                } else if (
                                                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                                ) {
                                                    errors.email = 'Please enter a valid email address.';
                                                }
                                                if (!values.address1) {
                                                    errors.address1 = 'Please enter your address.';
                                                }
                                                if (!values.city) {
                                                    errors.city = 'Please enter your city.';
                                                }
                                                if (!values.country) {
                                                    errors.country = 'Please enter your country.';
                                                }
                                                return errors;
                                            }}
                                            onSubmit={(values, { setSubmitting }) => {
                                                setUserFields(values);
                                                setTimeout(() => {
                                                    setSubmitting(false);
                                                }, 500);
                                            }}
                                        >
                                            {({ isSubmitting, setFieldValue, errors }) => (
                                                <Form>
                                                    <div
                                                        className={classnames({
                                                            'input-error': errors.firstName,
                                                        })}
                                                        onMouseOver={() => toggleErrorHovered('firstName')}
                                                        onMouseOut={() => toggleErrorHovered('firstName')}
                                                    >
                                                        <Field type="text" name="firstName" placeholder="First Name" />
                                                        {errors.name && errorsHovered.includes('firstName') && (
                                                            <div className="error-tooltip">{errors.firstName}</div>
                                                        )}
                                                    </div>
                                                    <div
                                                        className={classnames({
                                                            'input-error': errors.lastName,
                                                        })}
                                                        onMouseOver={() => toggleErrorHovered('lastName')}
                                                        onMouseOut={() => toggleErrorHovered('lastName')}
                                                    >
                                                        <Field type="text" name="lastName" placeholder="Last Name" />
                                                        {errors.name && errorsHovered.includes('lastName') && (
                                                            <div className="error-tooltip">{errors.lastName}</div>
                                                        )}
                                                    </div>
                                                    <div
                                                        className={classnames({
                                                            'input-error': errors.email,
                                                        })}
                                                        onMouseOver={() => toggleErrorHovered('email')}
                                                        onMouseOut={() => toggleErrorHovered('email')}
                                                    >
                                                        <Field type="email" name="email" placeholder="Email" />
                                                        {errors.email && errorsHovered.includes('email') && (
                                                            <div className="error-tooltip">{errors.email}</div>
                                                        )}
                                                    </div>
                                                    <Field
                                                        type="text"
                                                        name="company"
                                                        placeholder="Company (Optional)"
                                                    />
                                                    <div
                                                        className={classnames({
                                                            'input-error': errors.address1,
                                                        })}
                                                        onMouseOver={() => toggleErrorHovered('address1')}
                                                        onMouseOut={() => toggleErrorHovered('address1')}
                                                    >
                                                        <Field
                                                            type="text"
                                                            name="address1"
                                                            placeholder="Street address"
                                                        />
                                                        {errors.email && errorsHovered.includes('address1') && (
                                                            <div className="error-tooltip">{errors.address1}</div>
                                                        )}
                                                    </div>
                                                    <Field
                                                        type="text"
                                                        name="address2"
                                                        placeholder="Apartment / Suite (Optional)"
                                                    />
                                                    <div
                                                        className={classnames({
                                                            'input-error': errors.city,
                                                        })}
                                                        onMouseOver={() => toggleErrorHovered('city')}
                                                        onMouseOut={() => toggleErrorHovered('city')}
                                                    >
                                                        <Field type="text" name="city" placeholder="City" />
                                                        {errors.email && errorsHovered.includes('city') && (
                                                            <div className="error-tooltip">{errors.city}</div>
                                                        )}
                                                    </div>
                                                    <div
                                                        className={classnames({
                                                            'input-error': errors.country,
                                                        })}
                                                        onMouseOver={() => toggleErrorHovered('country')}
                                                        onMouseOut={() => toggleErrorHovered('country')}
                                                    >
                                                        <Field name="country">
                                                            {({ field, form, meta }) => {
                                                                return (
                                                                    <CountryDropdown
                                                                        value={formCountry}
                                                                        onChange={val => {
                                                                            console.log(val);
                                                                            setFieldValue('country', val);
                                                                            setFormCountry(val);
                                                                        }}
                                                                        valueType="short"
                                                                        priorityOptions={['US', 'CA', 'GB']}
                                                                    />
                                                                );
                                                            }}
                                                        </Field>
                                                        {errors.email && errorsHovered.includes('country') && (
                                                            <div className="error-tooltip">{errors.country}</div>
                                                        )}
                                                    </div>
                                                    <Button type="submit" disabled={isSubmitting} width="100%">
                                                        Save
                                                    </Button>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                )}
                            </div>
                        )}
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
