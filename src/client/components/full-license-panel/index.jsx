/* eslint-disable max-lines-per-function */
import React, { memo, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import Button from 'components/button';
import SuccessPanel from 'components/success-panel';
import selectors from 'selectors';

import CloseIcon from 'assets/images/Close_Icon_Gray.svg';

import { setState } from 'actions/general';

import './style.scss';

/**
 * Full Catalog License panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function FullLicensePanel({ visible, style }) {
    const [isValid, setIsValid] = useState(true);
    const [errorsHovered, setErrorsHovered] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);

    const song = useSelector(selectors.library.getLicenseSong);

    const panelClass = useMemo(
        () =>
            classnames('full-license-panel', {
                'full-license-panel--visible': visible,
            }),
        [visible]
    );

    const formDescriptionClass = useMemo(
        () =>
            classnames('full-license-panel__header__description', {
                'full-license-panel__header__description--error': !isValid,
            }),
        [isValid]
    );

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
        <div>
            {song && (
                <div className={panelClass} style={style}>
                    {isSuccess ? (
                        <SuccessPanel
                            onClose={() => {
                                dispatch(setState('fullLicenseOpened', false));
                                setTimeout(() => {
                                    setIsSuccess(false);
                                }, 500);
                            }}
                        />
                    ) : (
                        <div className="full-license-panel__container">
                            <div className="full-license-panel__header">
                                <div className="full-license-panel__header__title">
                                    <CloseIcon
                                        onClick={() => {
                                            dispatch(setState('fullLicenseOpened', false));
                                        }}
                                    />
                                    Full Catalog License
                                </div>
                                <div className="full-license-panel__header__song">
                                    <img className="full-license-panel__header__song__image" src={song.image} />
                                    <div className="full-license-panel__header__song__details">
                                        <div className="full-license-panel__header__song__details__title">
                                            All Tracks in PB Catalog
                                        </div>
                                        <div className="full-license-panel__header__song__details__artist">
                                            Unlimited licensing per project
                                        </div>
                                    </div>
                                </div>
                                <div className={formDescriptionClass}>
                                    {isValid ? (
                                        'We offer a full catalog license per project. Tell us about your project for a quote.'
                                    ) : (
                                        <>
                                            <span>Sorry, there was a problem.</span>
                                            Find detail highlighted below
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="full-license-panel__form">
                                <Formik
                                    initialValues={{
                                        name: '',
                                        email: '',
                                        company: '',
                                        project: '',
                                        details: '',
                                        url: '',
                                        agreement: false,
                                    }}
                                    validate={(values) => {
                                        const errors = {};
                                        if (!values.name) {
                                            errors.name = 'Please enter a name.';
                                        }
                                        if (!values.email) {
                                            errors.email = 'Please enter an email.';
                                        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                            errors.email = 'Please enter a valid email address.';
                                        }
                                        if (!values.project) {
                                            errors.project = 'Please enter a project name.';
                                        }
                                        if (!values.details) {
                                            errors.details = 'Please enter a project description.';
                                        }
                                        if (!values.agreement) {
                                            errors.agreement = 'Please check the Privacy Policy agreement.';
                                        }
                                        setIsValid(Object.keys(errors).length === 0);
                                        return errors;
                                    }}
                                    validateOnBlur={false}
                                    validateOnChange={false}
                                    onSubmit={(values, { setSubmitting }) => {
                                        const emailData = {
                                            email: values.email,
                                            subject: 'New form submission for PB Full License quote',
                                            text: `For song: ${song.title} by ${song.artist}, Name: ${values.name}, Email: ${values.email}, Company: ${values.company}, Project: ${values.project}, License Type: ${values.license}, Details: ${values.details}, URL: ${values.url}`,
                                        };
                                        fetch('/api/email/send', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ emailData: emailData }),
                                        }).then((res) => {
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
                                            <Field type="text" name="company" placeholder="Company Name (Optional)" />
                                            <div
                                                className={classnames({
                                                    'input-error': errors.project,
                                                })}
                                                onMouseOver={() => toggleErrorHovered('project')}
                                                onMouseOut={() => toggleErrorHovered('project')}
                                            >
                                                <Field type="text" name="project" placeholder="Project" />
                                                {errors.project && errorsHovered.includes('project') && (
                                                    <div className="error-tooltip">{errors.project}</div>
                                                )}
                                            </div>
                                            <div
                                                className={classnames('textarea', {
                                                    'input-error': errors.details,
                                                })}
                                                onMouseOver={() => toggleErrorHovered('details')}
                                                onMouseOut={() => toggleErrorHovered('details')}
                                            >
                                                <Field as="textarea" name="details" placeholder="Details" />
                                                {errors.details && errorsHovered.includes('details') && (
                                                    <div className="error-tooltip">{errors.details}</div>
                                                )}
                                            </div>
                                            <Field type="text" name="url" placeholder="Footage URL (Optional)" />
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
                                                                id="customAgreement"
                                                                type="checkbox"
                                                                checked={field.value}
                                                                onChange={() => {
                                                                    setFieldValue('agreement', !field.value);
                                                                }}
                                                            />
                                                            <label htmlFor="customAgreement">
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
                                                            {errors.agreement &&
                                                                errorsHovered.includes('agreement') && (
                                                                    <div className="error-tooltip">
                                                                        {errors.agreement}
                                                                    </div>
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
            )}
        </div>
    );
}

FullLicensePanel.displayName = 'FullLicensePanel';

FullLicensePanel.propTypes = {
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    chosenType: PropTypes.string,
    style: PropTypes.object,
};

FullLicensePanel.defaultProps = {
    visible: false,
    chosenType: '',
    style: {},
};

export default memo(FullLicensePanel);
