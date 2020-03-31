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

const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3500/' : 'https://patternbased.herokuapp.com/';

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
        const emailData = {
            email: userFields.email,
            subject: `PatternBased Catalog - New Order# ${val.data.orderNo}`,
            text: `Name: ${userFields.firstName} ${userFields.lastName}, Email: ${userFields.email}, Company: ${userFields.company}`,
        };
        const emailOrderData = {
            email: userFields.email,
            subject: `PatternBased Catalog - Order Confirmation #${val.data.orderNo}`,
            text: _getOrderConfirmationHtml(
                userFields,
                subtotal,
                total,
                items,
                val.data.orderNo,
                val.data.orderId,
                val.data.dateAdded
            ),
        };

        fetch('/api/email/order/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emailData: emailOrderData }),
        }).then(res => {
            
            fetch('/api/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailData: emailData }),
            });
            setSuccess(true);
            setOrderNo(val.data.orderNo);
            setInvoiceId(val.data.orderId);
            dispatch(clearCartData());
            
        });
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
                                            expire in 7 days. Please contact us with your Order# to re-issue download
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

/**
 * Order confirmation email template
 * @returns {String}
 */
const _getOrderConfirmationHtml = (fields, subtotal, total, pItems, orderNo, licenseId, dateAdded) => {

    const getItemRows = () => {
        pItems.map((item, index) => {return `<td class="esd-structure esdev-adapt-off es-p10t es-p10b es-p20r es-p40l" align="left">
        <table width="540" cellpadding="0" cellspacing="0" class="esdev-mso-table">
            <tbody>
                <tr>
                    <td class="esdev-mso-td" valign="top">
                        <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                            <tbody>
                                <tr>
                                    <td width="368" class="esd-container-frame" align="left">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td align="left" class="esd-block-text">
    <p style="font-size: 14px; font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif;">${item.type} (${item.song.title} / ${item.song.artist})</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td width="20"></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td class="esdev-mso-td" valign="top">
                        <table cellpadding="0" cellspacing="0" class="es-right" align="right">
                            <tbody>
                                <tr>
                                    <td width="152" align="left" class="esd-container-frame">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td align="left" class="esd-block-text">
                                                        <table style="width: 100%;" class="cke_show_border" cellspacing="1" cellpadding="1" border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="text-align: center; font-size: 13px; line-height: 100%;" width="15%" align="center">
                                                                        <p style="font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif;">1</p>
                                                                    </td>
                                                                    <td style="text-align: center; font-size: 13px; line-height: 100%;" width="30%">
    <p style="font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif;">${item.price}</p>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </td>`})
    }

    const template = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html>
    
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title></title>
        <!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]-->
        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
        <!--[if !mso]><!-- -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i" rel="stylesheet">
        <!--<![endif]-->
    </head>
    
    <body>
        <div class="es-wrapper-color">
            <!--[if gte mso 9]>
                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                    <v:fill type="tile" color="#f6f6f6"></v:fill>
                </v:background>
            <![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr>
                        <td class="esd-email-paddings" valign="top">
                            <table class="es-content esd-header-popover" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" align="center">
                                            <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p20t es-p20b es-p20r es-p20l" align="left">
                                                            <table cellspacing="0" cellpadding="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esd-container-frame" width="560" align="left">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank" href="https://patternbased.herokuapp.com/"><img class="adapt-img" src="https://fmdjba.stripocdn.email/content/guids/CABINET_23014a4eedafcaf27f17a15d0386b971/images/25341585650046275.png" alt style="display: block;" width="37"></a></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-text es-p10t">
                                                                                            <p style="font-size: 24px;"><strong>ORDER CONFIRMATION</strong></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-text es-p30t es-p20b">
                                                                                            <p style="font-family: &quot;open sans&quot;, &quot;helvetica neue&quot;, helvetica, arial, sans-serif;">Dear ${fields.firstName} ${fields.lastName},<br>We have received your order, thank you!</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-text es-p20b" esd-links-underline="none">
                                                                                            <p style="font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif; color: #444444;"><span style="font-size:16px;"><strong>Order# ${orderNo} (<a target="_blank" style="color: #0092c5; font-size: 16px; text-decoration: none;" href="${`${baseUrl}/invoice/${licenseId}`}">View Invoice</a>)</strong></span><br>Date: ${dateAdded}</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table cellpadding="0" cellspacing="0" class="es-content esd-footer-popover" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" align="center" esd-custom-block-id="55553">
                                            <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure esdev-adapt-off es-p5t es-p5b es-p20r es-p40l" align="left" bgcolor="#D8D8D8" style="background-color: #d8d8d8;">
                                                            <table width="540" cellpadding="0" cellspacing="0" class="esdev-mso-table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esdev-mso-td" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td width="368" class="esd-container-frame" align="left">
                                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td class="esd-block-text" align="left">
                                                                                                            <h4 style="font-size: 12px; font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif; color: #444444;">Description (Track title / Artist)</h4>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                        <td width="20"></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                        <td class="esdev-mso-td" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" class="es-right" align="right">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td width="152" align="left" class="esd-container-frame">
                                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td align="left" class="esd-block-text">
                                                                                                            <table style="width: 100%;" class="cke_show_border" cellspacing="1" cellpadding="1" border="0">
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <td style="text-align: center; font-size: 13px; line-height: 100%;" width="60" align="center">
                                                                                                                            <p style="font-size: 12px; font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif;"><b>Amount</b></p>
                                                                                                                        </td>
                                                                                                                        <td style="text-align: center; font-size: 13px; line-height: 100%;" width="100">
                                                                                                                            <p style="font-size: 12px; font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif;"><strong>Price</strong></p>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        ${getItemRows()}
                                                    </tr>
                                                    <tr>
                                                        <td class="esd-structure" align="left" style="background-position: center center;">
                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="600" class="esd-container-frame" align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-spacer" style="font-size: 0px;">
                                                                                            <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td style="border-bottom: 4px solid #d8d8d8; background: none; height: 1px; width: 100%; margin: 0px;"></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="esd-structure esdev-adapt-off es-p10t es-p10b es-p20r es-p40l" align="left">
                                                            <table width="540" cellpadding="0" cellspacing="0" class="esdev-mso-table">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="esdev-mso-td" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td width="356" class="esd-container-frame" align="left">
                                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td align="left" class="esd-block-text">
                                                                                                            <p style="font-size: 14px; font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif;">Subtotal</p>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                        <td width="20"></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                        <td class="esdev-mso-td" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" class="es-right" align="right">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td width="164" align="left" class="esd-container-frame">
                                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td align="left" class="esd-block-text">
                                                                                                            <table style="width: 100%;" class="cke_show_border" cellspacing="1" cellpadding="1" border="0">
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <td style="text-align: center; font-size: 13px; line-height: 100%;" width="15%" align="center">
                                                                                                                            <p><br></p>
                                                                                                                        </td>
                                                                                                                        <td style="text-align: center; font-size: 13px; line-height: 100%;" width="30%">
                                                                                                                            <p style="font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif;">$${subtotal}</p>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="esd-structure es-p5t es-p5b es-p20r es-p40l" align="left" bgcolor="#d8d8d8" style="background-color: #d8d8d8;">
                                                            <!--[if mso]><table width="540" cellpadding="0" cellspacing="0"><tr><td width="356" valign="top"><![endif]-->
                                                            <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="356" class="es-m-p0r es-m-p20b esd-container-frame" valign="top" align="center">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="left" class="esd-block-text">
                                                                                            <p style="font-family: &quot;open sans&quot;, &quot;helvetica neue&quot;, helvetica, arial, sans-serif; color: #444444;"><strong>Total</strong></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td><td width="20"></td><td width="164" valign="top"><![endif]-->
                                                            <table cellpadding="0" cellspacing="0" align="right">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="164" align="left" class="esd-container-frame">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="left" class="esd-block-text es-p40r">
                                                                                            <p style="font-family: &quot;open sans&quot;, &quot;helvetica neue&quot;, helvetica, arial, sans-serif; text-align: right;"><strong>$${total}</strong></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                    <td width="600" class="esd-container-frame" align="center" valign="top" esdev-config="h1">
                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                        <tbody>
                                                            <tr>
                                                                <td align="center" class="esd-block-button es-p40t es-p30b">
                                                                    <span class="es-button-border" style="border-radius: 4px; border-color: #2cb543; background: #444444; border-width: 0px;"><a href="${baseUrl}/download/${licenseId}" class="es-button" target="_blank" style="font-family: &quot;open sans&quot;, &quot;helvetica neue&quot;, helvetica, arial, sans-serif; font-size: 14px; font-weight: bold; background: #444444; border-color: #444444; border-radius: 4px; border-width: 10px 50px;">Download .mp3</a></span></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="esd-structure es-p30b" align="left">
                                                            <!--[if mso]><table width="600" cellpadding="0" cellspacing="0"><tr><td width="125" valign="top"><![endif]-->
                                                            <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="125" class="es-m-p0r es-m-p20b esd-container-frame" valign="top" align="center">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="right" class="esd-block-image" style="font-size: 0px;"><a target="_blank"><img class="adapt-img" src="https://fmdjba.stripocdn.email/content/guids/CABINET_23014a4eedafcaf27f17a15d0386b971/images/55891585651596399.png" alt style="display: block;" width="48"></a></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td><td width="15"></td><td width="460" valign="top"><![endif]-->
                                                            <table cellpadding="0" cellspacing="0" align="right">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="460" align="left" class="esd-container-frame">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="left" class="esd-block-text es-p5t es-p40r es-p20l">
                                                                                            <p style="font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif;">Links will expire in 7 days. Please contact us with your Order# to re-issue download links.</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="esd-structure es-p30b" align="left">
                                                            <!--[if mso]><table width="600" cellpadding="0" cellspacing="0"><tr><td width="125" valign="top"><![endif]-->
                                                            <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="125" class="es-m-p0r es-m-p20b esd-container-frame" valign="top" align="center">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="right" class="esd-block-image" style="font-size: 0px;"><a target="_blank"><img class="adapt-img" src="https://fmdjba.stripocdn.email/content/guids/CABINET_23014a4eedafcaf27f17a15d0386b971/images/14811585652007896.png" alt style="display: block;" width="48"></a></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td><td width="15"></td><td width="460" valign="top"><![endif]-->
                                                            <table cellpadding="0" cellspacing="0" align="right">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="460" align="left" class="esd-container-frame">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="left" class="esd-block-text es-p5t es-p40r es-p20l">
                                                                                            <p style="font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif;">Stems are available for most of our music upon request. <br>Feel free to contact us with your Order#.</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="esd-structure es-p30t es-p10b" align="left" bgcolor="#d8d8d8" style="background-color: #d8d8d8;">
                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="600" class="esd-container-frame" align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank"><img class="adapt-img" src="https://fmdjba.stripocdn.email/content/guids/CABINET_23014a4eedafcaf27f17a15d0386b971/images/1421585652094308.png" alt style="display: block;" width="200"></a></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="esd-structure" align="left" bgcolor="#d8d8d8" style="background-color: #d8d8d8;">
                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="600" class="esd-container-frame" align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-text" esd-links-color="#444444" esd-links-underline="underline">
                                                                                            <p style="font-size: 12px; font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif;"><a target="_blank" style="font-size: 12px; font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif; text-align: center; color: #444444; text-decoration: underline;" href="https://legal.patternbased.com/privacy-policy/">Privacy Policy</a> &nbsp; &nbsp;<a target="_blank" style="font-size: 12px; font-family: 'open sans', 'helvetica neue', helvetica, arial, sans-serif; color: #444444; text-decoration: underline;" href="https://legal.patternbased.com/license-agreement/">License Agreement</a></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="esd-structure es-p5t es-p30b" align="left" bgcolor="#d8d8d8" style="background-color: #d8d8d8;">
                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="600" class="esd-container-frame" align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="left" class="esd-block-text">
                                                                                            <p style="font-size: 12px; font-family: &quot;open sans&quot;, &quot;helvetica neue&quot;, helvetica, arial, sans-serif; text-align: center;">© COPYRIGHT 2018-2020 PatternBased Corp</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
    
    </html>`;
    return template;
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
