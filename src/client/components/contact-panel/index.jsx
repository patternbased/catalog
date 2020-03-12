/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import Button from 'components/button';
import SuccessPanel from 'components/success-panel';

import CloseIcon from 'assets/images/Close_Icon_Gray.svg';

import { setState } from 'actions/general';

import './style.scss';

/**
 * Contact Us panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function Contact({ visible, style }) {
    const [isValid, setIsValid] = useState(true);
    const [errorsHovered, setErrorsHovered] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);

    const panelClass = useMemo(
        () =>
            classnames('contact-panel', {
                'contact-panel--visible': visible,
            }),
        [visible]
    );

    const formDescriptionClass = useMemo(
        () =>
            classnames('contact-panel__header__description', {
                'contact-panel__header__description--error': !isValid,
            }),
        [isValid]
    );

    const dispatch = useDispatch();

    const toggleErrorHovered = error => {
        let errorCopy = [...errorsHovered];
        if (errorCopy.includes(error)) {
            errorCopy = errorCopy.filter(e => e !== error);
        } else {
            errorCopy.push(error);
        }
        setErrorsHovered(errorCopy);
    };

    return (
        <div>
            <div className={panelClass} style={style}>
                {isSuccess ? (
                    <SuccessPanel
                        onClose={() => {
                            dispatch(setState('contactOpened', false));
                            setTimeout(() => {
                                setIsSuccess(false);
                            }, 500);
                        }}
                    />
                ) : (
                    <div className="contact-panel__container">
                        <div className="contact-panel__header">
                            <div className="contact-panel__header__title">
                                <CloseIcon onClick={() => dispatch(setState('contactOpened', false))} />
                                Contact Us
                            </div>
                            {!isValid && (
                                <div className={formDescriptionClass}>
                                    <span>Sorry, there was a problem.</span>
                                    Find detail highlighted below
                                </div>
                            )}
                        </div>
                        <div className="contact-panel__form">
                            <Formik
                                initialValues={{
                                    name: '',
                                    email: '',
                                    company: '',
                                    subject: '',
                                    message: '',
                                    agreement: false,
                                }}
                                validate={values => {
                                    const errors = {};
                                    if (!values.name) {
                                        errors.name = 'Please enter a name.';
                                    }
                                    if (!values.email) {
                                        errors.email = 'Please enter an email.';
                                    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                        errors.email = 'Please enter a valid email address.';
                                    }
                                    if (!values.subject) {
                                        errors.subject = 'Please enter a subject.';
                                    }
                                    if (!values.message) {
                                        errors.message = 'Please enter a message.';
                                    }
                                    if (!values.agreement) {
                                        errors.agreement = 'Please check the Privacy Policy agreement.';
                                    }
                                    setIsValid(Object.keys(errors).length === 0);
                                    return errors;
                                }}
                                onSubmit={(values, { setSubmitting }) => {
                                    const emailData = {
                                        email: values.email,
                                        subject: `PB Contact Form - ${values.subject}`,
                                        text: `Name: ${values.name}, Email: ${values.email}, Company: ${values.company}, Message: ${values.message}`,
                                    };
                                    fetch('/api/email/send', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ emailData: emailData }),
                                    }).then(res => {
                                        setTimeout(() => {
                                            setIsSuccess(true);
                                            setSubmitting(false);
                                        }, 400);
                                    });
                                }}
                            >
                                {({ isSubmitting, setFieldValue, errors }) => (
                                    <Form>
                                        <div
                                            className={classnames({
                                                'input-error': errors.name,
                                            })}
                                            onMouseOver={() => toggleErrorHovered('name')}
                                            onMouseOut={() => toggleErrorHovered('name')}
                                        >
                                            <Field type="text" name="name" placeholder="Name" />
                                            {errors.name && errorsHovered.includes('name') && (
                                                <div className="error-tooltip">{errors.name}</div>
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
                                        <Field type="text" name="company" placeholder="Company (Optional)" />
                                        <div
                                            className={classnames({
                                                'input-error': errors.subject,
                                            })}
                                            onMouseOver={() => toggleErrorHovered('subject')}
                                            onMouseOut={() => toggleErrorHovered('subject')}
                                        >
                                            <Field type="text" name="subject" placeholder="Subject" />
                                            {errors.subject && errorsHovered.includes('subject') && (
                                                <div className="error-tooltip">{errors.subject}</div>
                                            )}
                                        </div>
                                        <div
                                            className={classnames({
                                                'input-error': errors.message,
                                            })}
                                            onMouseOver={() => toggleErrorHovered('message')}
                                            onMouseOut={() => toggleErrorHovered('message')}
                                        >
                                            <Field as="textarea" name="message" placeholder="Message" />
                                            {errors.message && errorsHovered.includes('message') && (
                                                <div className="error-tooltip">{errors.message}</div>
                                            )}
                                        </div>
                                        <div
                                            className={classnames('checkbox-wrap', {
                                                'input-error': errors.agreement,
                                            })}
                                            onMouseOver={() => toggleErrorHovered('agreement')}
                                            onMouseOut={() => toggleErrorHovered('agreement')}
                                        >
                                            <Field name="agreement">
                                                {({ field, form }) => (
                                                    <div className="check-box">
                                                        {field.value && <CloseIcon />}
                                                        <input
                                                            id="contactAgreement"
                                                            type="checkbox"
                                                            checked={field.value}
                                                            onChange={() => {
                                                                setFieldValue('agreement', !field.value);
                                                            }}
                                                        />
                                                        <label htmlFor="contactAgreement">
                                                            <span>
                                                                I agree that I have read PatternBased’s{' '}
                                                                <a
                                                                    href="https://legal.patternbased.com/privacy-policy/"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Privacy Policy
                                                                </a>
                                                                .
                                                            </span>
                                                        </label>
                                                        {errors.agreement && errorsHovered.includes('agreement') && (
                                                            <div className="error-tooltip">{errors.agreement}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </Field>
                                        </div>
                                        <Button type="submit" disabled={isSubmitting} width="100%">
                                            Submit
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

Contact.displayName = 'Contact';

Contact.propTypes = {
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    style: PropTypes.object,
};

Contact.defaultProps = {
    visible: false,
    style: {},
};

export default memo(Contact);
