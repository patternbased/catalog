/* eslint-disable max-lines-per-function */
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import {
    SquarePaymentForm,
    CreditCardNumberInput,
    CreditCardExpirationDateInput,
    CreditCardPostalCodeInput,
    CreditCardCVVInput,
    CreditCardSubmitButton,
} from 'react-square-payment-form';
import Button from 'components/button';

import './style.scss';
import 'react-square-payment-form/lib/default.css';

/**
 * Payment form component
 * @returns {React.Component}
 */
function PaymentForm({ address, total, onSuccess, items }) {
    const [uiErrors, setUiErrors] = useState([]);
    const [processing, setProcessing] = useState(false);

    const cardNonceResponseReceived = async (errors, nonce, cardData, buyerVerificationToken) => {
        setProcessing(true);
        if (errors) {
            setUiErrors(errors.map(error => error.message));
            setProcessing(false);
            return;
        }

        setUiErrors([]);

        await fetch('/api/payment/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nonce: nonce,
                token: buyerVerificationToken,
                amount: total,
                items: items,
                address: address,
            }),
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                setProcessing(false);
                onSuccess(data);
            });
    };

    const createVerificationDetails = () => {
        return {
            amount: total.toString(),
            currencyCode: 'USD',
            intent: 'CHARGE',
            billingContact: {
                familyName: address.lasttName,
                givenName: address.firstName,
                email: address.email,
                country: address.country,
                city: address.city,
                addressLines: address.address2 && address.address2.length > 0 ? [address.address1, address.address2] : [address.address1],
                postalCode: address.postalCode,
            },
        };
    };
    return (
        <div className="payment">
            <SquarePaymentForm
                sandbox={true}
                applicationId={process.env.SQUARE_APP_ID}
                locationId={process.env.SQUARE_LOCATION_ID}
                cardNonceResponseReceived={cardNonceResponseReceived}
                createVerificationDetails={createVerificationDetails}
            >
                <fieldset className="sq-fieldset">
                    <CreditCardNumberInput label="" />
                    <div className="payment__inline">
                        <CreditCardCVVInput label="" />
                        <CreditCardExpirationDateInput label="" />
                    </div>
                    <CreditCardPostalCodeInput label="" />
                </fieldset>
                {uiErrors.length > 0 && (
                    <>
                        {uiErrors.map((err, index) => (
                            <div className="payment__error" key={index}>
                                {err}
                            </div>
                        ))}
                    </>
                )}
                {processing ? (
                    <Button disabled width="100%">
                        Pay with Card
                    </Button>
                ) : (
                    <CreditCardSubmitButton>Pay with Card</CreditCardSubmitButton>
                )}
            </SquarePaymentForm>
        </div>
    );
}

PaymentForm.displayName = 'PaymentForm';

PaymentForm.propTypes = {
    address: PropTypes.shape().isRequired,
    total: PropTypes.number.isRequired,
    onSuccess: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
};

export default memo(PaymentForm);
