/* eslint-disable max-lines-per-function */
import React, { memo, useState } from 'react';
import {
    SquarePaymentForm,
    CreditCardNumberInput,
    CreditCardExpirationDateInput,
    CreditCardPostalCodeInput,
    CreditCardCVVInput,
    CreditCardSubmitButton,
} from 'react-square-payment-form';

import './style.scss';
import 'react-square-payment-form/lib/default.css';

/**
 * Payment form component
 * @returns {React.Component}
 */
function PaymentForm() {
    const [errors, setErrors] = useState({});

    const cardNonceResponseReceived = (errors, nonce, cardData, buyerVerificationToken) => {
        if (errors) {
            setErrors({ errorMessages: errors.map(error => error.message) });
            return;
        }

        setErrors({ errorMessages: [] });
        alert('nonce created: ' + nonce + ', buyerVerificationToken: ' + buyerVerificationToken);
    };

    const createVerificationDetails = () => {
        return {
            amount: '100.00',
            currencyCode: 'USD',
            intent: 'CHARGE',
            billingContact: {
                familyName: 'Smith',
                givenName: 'John',
                email: 'jsmith@example.com',
                country: 'GB',
                city: 'London',
                addressLines: ["1235 Emperor's Gate"],
                postalCode: 'SW7 4JA',
                phone: '020 7946 0532',
            },
        };
    };
    return (
        <div className="payment">
            <SquarePaymentForm
                sandbox={true}
                applicationId={'sandbox-sq0idb-JnkDSwkHVuB9mATI6c5XDg'}
                locationId={'P533ZVS3J0Z0M'}
                cardNonceResponseReceived={cardNonceResponseReceived}
                createVerificationDetails={createVerificationDetails}
            >
                <fieldset className="sq-fieldset">
                    <CreditCardNumberInput />
                    <div className="sq-form-half">
                        <CreditCardCVVInput />
                    </div>
                    <div className="sq-form-half">
                        <CreditCardExpirationDateInput />
                    </div>

                    <CreditCardPostalCodeInput placeholder="ZIP" />
                </fieldset>

                <CreditCardSubmitButton>Pay with Card</CreditCardSubmitButton>
            </SquarePaymentForm>
        </div>
    );
}

PaymentForm.displayName = 'PaymentForm';

export default memo(PaymentForm);
