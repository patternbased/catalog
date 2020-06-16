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
    process.env.NODE_ENV === 'production' ? 'https://catalog.patternbased.com' : 'https://patternbased.herokuapp.com';

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

    const completePurchase = (val) => {
        const emailData = {
            email: userFields.email,
            subject: `PatternBased Catalog - New Order# ${val.data.orderNo}`,
            text: `Name: ${userFields.firstName} ${userFields.lastName}, 
            Email: ${userFields.email}, 
            Company: ${userFields.company},
            Purchased Items: ${items.map((item) => {
                return `${item.type} (${item.song.title} / ${item.song.artist})`;
            })}`,
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
        }).then((res) => {
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

    const toggleErrorHovered = (error) => {
        let errorCopy = [...errorsHovered];
        if (errorCopy.includes(error)) {
            errorCopy = errorCopy.filter((e) => e !== error);
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
                                            We will send you wav format file(s) within 24 hours. Stems are available for
                                            most of our music upon request. Feel free to contact us with your Order#.
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
                                                {userFields.address2 && userFields.address2.length > 0
                                                    ? `${userFields.address1} ${userFields.address2}`
                                                    : userFields.address1}
                                                <br />
                                                {`${userFields.city}, ${userFields.country}`}
                                            </div>
                                        </div>
                                        <div className="checkout-panel__body__payment__title">Payment Information</div>
                                        <PaymentForm
                                            address={userFields}
                                            total={total}
                                            items={items}
                                            onSuccess={(val) => completePurchase(val)}
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
                                            validate={(values) => {
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
                                            validateOnBlur={false}
                                            validateOnChange={false}
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
                                                                        onChange={(val) => {
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
    const renderItems = () => {
        return `<tbody>
                ${pItems.map(
                    (item, index) =>
                        `<tr key={${index}}>
                <td class="invoice__body__table__long" style="color: #444;font-size: 14px;line-height: 20px;text-align: center;padding-left: 50px;text-align: left;">
                    ${item.type} (${item.song.title} / ${item.song.artist})
                </td>
                <td style="color: #444;font-size: 14px;line-height: 20px;text-align: center;">1</td>
                <td style="color: #444;font-size: 14px;line-height: 20px;text-align: center;padding-right: 50px;">$${item.price}</td>
            </tr>`
                )}
            </tbdoy>`;
    };
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
        <!--[if !mso]><!-- --
        <!--<![endif]-->
    </head>
    
    <body>
        <div
        class="email"
        style="width: 600px;margin: 0 auto;padding-top: 30px;background-color: white"
    >
        <div class="heading">
            <div class="logo" style="text-align: center;">
                <img
                    src="https://pblibrary.s3.us-east-2.amazonaws.com/emailImages/logo.png"
                    style="width: 36px;height: 36px;"
                />
            </div>
            <div
                class="title"
                style="font-size: 24px;line-height: 29px;font-weight: bold;text-align: center;color: #444;margin: 10px 0 30px;"
            >
                ORDER CONFIRMATION
            </div>
            <div
                class="subtitle"
                style="font-size: 14px;line-height: 19px;text-align: center;color: #444;margin-bottom: 20px;"
            >
                Dear ${fields.firstName} ${fields.lastName},
                <br />
                We have received your order, thank you!
            </div>
            <div
                class="orderno"
                style="text-align: center;font-size: 16px;line-height: 22px;font-weight: bold;color: #444;font-weight: bold;"
            >
                Order# ${orderNo} (<a
                    href="${baseUrl}/invoice/${licenseId}"
                    style="text-align: center;font-size: 16px;line-height: 22px;font-weight: bold;color: #0092c5;font-weight: bold;"
                >
                    View Invoice
                </a>)
            </div>
            <div
                class="date"
                style="font-size: 14px;line-height: 19px;text-align: center;color: #444;margin-bottom: 20px;"
            >
                Date: ${dateAdded}
            </div>
        </div>
        <div class="invoice__body__table">
            <table
                style="width: 100%;border-collapse: collapse;"
            >
                <thead style="background-color: #d8d8d8;">
                    <tr>
                        <th
                            class="invoice__body__table__long"
                            style="height: 30px;color: #444;font-size: 12px;font-weight: bold;line-height: 17px;text-align: center;padding-left: 50px;text-align: left;"
                        >
                            Description (Track title / Artist)
                        </th>
                        <th
                            style="height: 30px;color: #444;font-size: 12px;font-weight: bold;line-height: 17px;text-align: center;"
                        >
                            Amount
                        </th>
                        <th
                            style="height: 30px;color: #444;font-size: 12px;font-weight: bold;line-height: 17px;text-align: center;padding-right: 50px;"
                        >
                            Price
                        </th>
                    </tr>
                </thead>
                ${renderItems()}
                <tbody>
                    <tr class="border" style="border-top: 4px solid #d8d8d8;">
                        <td
                            class="invoice__body__table__long"
                            style="padding-top: 10px;padding-bottom: 10px;color: #444;font-size: 14px;line-height: 20px;text-align: left;padding-left: 50px;"
                        >
                            Subtotal
                        </td>
                        <td
                            style="padding-top: 10px;padding-bottom: 10px;color: #444;font-size: 14px;line-height: 20px;text-align: center;"
                        ></td>
                        <td style="padding-top: 10px;padding-bottom: 10px;color: #444;font-size: 14px;line-height: 20px;text-align: center;padding-right: 50px;"
                        >
                            $${subtotal}
                        </td>
                    </tr>
                </tbody>
                <thead class="footer" style="background-color: #d8d8d8;">
                    <tr>
                        <th class="invoice__body__table__long" style="font-size: 14px;height: 30px;color: #444;font-weight: bold;line-height: 17px;text-align: center;padding-left: 50px;text-align: left;">
                            Total
                        </th>
                        <th style="font-size: 14px;height: 30px;color: #444;font-weight: bold;line-height: 17px;text-align: center;"></th>
                        <th style="font-size: 14px;height: 30px;color: #444;font-weight: bold;line-height: 17px;text-align: center;text-align: center;padding-right: 50px;">$${total}</th>
                    </tr>
                </thead>
            </table>
        </div>
        <div
            class="download"
            style="text-align: center;margin: 40px 0 30px;"
        >
            <a
                href="${baseUrl}/download/${licenseId}}"
                style="width: 210px;border-radius: 4px;background-color: #444444;display: block;text-align: center;padding: 10px 0;margin: 0 auto;color: white;text-decoration: none;font-size: 14px;font-weight: bold;line-height: 19px;"
            >
                Download .mp3
            </a>
        </div>
        <div class="texts">
            <div
                class="texts__single"
                style="max-width: 440px;margin: 0 auto;display: flex;align-items: center;justify-content: center;margin-bottom: 26px;"
            >
                <img
                    src="https://pblibrary.s3.us-east-2.amazonaws.com/emailImages/email_icon_blue.png"
                    style="width: 48px;height: 48px;margin-right: 15px;box-sizing: border-box;"
                />
                <div
                    class="texts__text"
                    style="font-size: 14px;line-height: 20px;color: #444;"
                >
                    Links will expire in 14 days. Please
                    <a
                        href="mailto:info@patternbased.com"
                        style="color: #0092c5;font-size: 14px;line-height: 20px;"
                    >
                        contact us
                    </a>
                    with your Order# to re-issue download links.
                </div>
            </div>
            <div
                class="texts__single"
                style="max-width: 440px;margin: 0 auto;display: flex;align-items: center;justify-content: center;margin-bottom: 26px;"
            >
                <img
                    src="https://pblibrary.s3.us-east-2.amazonaws.com/emailImages/Stems_icon_blue.png"
                    style="width: 48px;height: 48px;margin-right: 15px;box-sizing: border-box;"
                />
                <div
                    class="texts__text"
                    style="font-size: 14px;line-height: 20px;color: #444;"
                >
                We will send you wav format file(s) within 24 hours. Stems are available for most of our music upon request. Feel free to
                    <a
                        href="mailto:info@patternbased.com"
                        style="color: #0092c5;font-size: 14px;line-height: 20px;"
                    >
                        contact us
                    </a>
                    with your Order#.
                </div>
            </div>
        </div>
        <div
            class="footer"
            style="background-color: #d8d8d8;padding: 30px 175px;"
        >
            <img
                src="https://pblibrary.s3.us-east-2.amazonaws.com/emailImages/PatternBased_CatalogSearch_logo_v2.png"
                style="width: 200px;margin: 0 auto 10px;display: block;"
            />
            <div class="links" style="text-align: center;">
                <a
                    href="https://legal.patternbased.com/privacy-policy/"
                    style="font-size: 12px;line-height: 18px;color: #444;margin-right: 20px;"
                >
                    Privacy Policy
                </a>
                <a
                    href="https://legal.patternbased.com/license-agreement/"
                    style="font-size: 12px;line-height: 18px;color: #444;"
                >
                    License agreement
                </a>
            </div>
            <div
                class="copyright"
                style="font-size: 12px;line-height: 18px;color: #444;"
            >
                © COPYRIGHT 2018-2020 PatternBased Corp
            </div>
        </div>
    </div>
    </body>
    
    </html>`;
    return template;
};

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
