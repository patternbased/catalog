import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import classnames from 'classnames';
import Button from 'components/button';

import { setPromoCode } from 'actions/cart';

import { api } from '../../services';

import './style.scss';

/**
 * Promo Code component
 * @returns {React.Component}
 */
function PromoCode() {
    const [showInput, setShowInput] = useState(false);
    const [errorsHovered, setErrorsHovered] = useState([]);
    const dispatch = useDispatch();

    const toggleErrorHovered = (error) => {
        let errorCopy = [...errorsHovered];
        if (errorCopy.includes(error)) {
            errorCopy = errorCopy.filter((e) => e !== error);
        } else {
            errorCopy.push(error);
        }
        setErrorsHovered(errorCopy);
    };

    return (
        <div className={classnames('promo', { 'promo--centered': showInput })}>
            {showInput ? (
                <Formik
                    initialValues={{
                        promo: '',
                    }}
                    validate={(values) => {
                        const errors = {};
                        if (!values.promo) {
                            errors.promo = 'Please enter a promo code.';
                        }

                        return errors;
                    }}
                    validateOnBlur={true}
                    validateOnChange={true}
                    onSubmit={(values, { setSubmitting, setErrors }) => {
                        api.get(`/api/promo/${values.promo}`).then((res) => {
                            if (res.status === 200) {
                                setTimeout(() => {
                                    setShowInput(false);
                                    dispatch(setPromoCode(res.promo));
                                }, 400);
                            } else {
                                setErrors({ promo: 'Sorry! This code is not valid.' });
                            }
                            setSubmitting(false);
                        });
                    }}
                >
                    {({ isSubmitting, errors }) => (
                        <Form>
                            <div
                                className={classnames({
                                    'input-error': errors.promo,
                                })}
                                onMouseOver={() => toggleErrorHovered('promo')}
                                onMouseOut={() => toggleErrorHovered('promo')}
                            >
                                <Field type="text" name="promo" placeholder="Enter a Promo Code" />
                                {errors.promo && errorsHovered.includes('promo') && (
                                    <div className="error-tooltip">{errors.promo}</div>
                                )}
                            </div>
                            <Button type="submit" disabled={isSubmitting} width={210} height={40} className="dark">
                                Apply Promo Code
                            </Button>
                        </Form>
                    )}
                </Formik>
            ) : (
                <Button onClick={() => setShowInput(true)} width={120} height={26}>
                    Add Promo Code
                </Button>
            )}
        </div>
    );
}

PromoCode.displayName = 'PromoCode';

PromoCode.propTypes = {};

export default memo(PromoCode);
