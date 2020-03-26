import React, { memo, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import FormIcon from 'assets/images/custom-license.svg';

import { setState } from 'actions/general';

import './style.scss';

/**
 * Button component
 * @param {String} type banner type: none, fullLicense or specialLicense
 * @returns {React.Component}
 */
function SpecialLicenseBanner({ type }) {
    const [isHovered, setIsHovered] = useState(false);
    const dispatch = useDispatch();

    const bannerClass = useMemo(
        () =>
            classnames('banner', {
                'banner--full': type === 'fullLicense',
                'banner--special': type === 'specialLicense',
                'banner--hide': type === 'none',
            }),
        [type]
    );

    return (
        <div
            className={bannerClass}
            onMouseOverCapture={() => setIsHovered(true)}
            onMouseOutCapture={() => setIsHovered(false)}
            onClick={() => {
                if (type === 'fullLicense') {
                    dispatch(setState('fullLicenseOpened', true));
                } else {
                    dispatch(setState('specialRateOpened', true));
                }
            }}
        >
            <div className="banner__overlay" />
            {isHovered ? (
                <div className="banner__inline">
                    <FormIcon />
                    Contact Us
                </div>
            ) : (
                <div className="banner__content">
                    {type === 'fullLicense' ? (
                        <>Full catalog licensing is also available</>
                    ) : (
                        <>
                            Special rates are available for projects of:
                            <div className="banner__content__bolded">The Environment</div>
                            <div className="banner__content__bolded">Human Rights</div>
                            <div className="banner__content__bolded">Animal Protection</div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

SpecialLicenseBanner.propTypes = {
    type: PropTypes.oneOf(['fullLicense', 'specialLicense', 'none']),
};

SpecialLicenseBanner.defaultProps = {
    type: 'fullLicense',
};

SpecialLicenseBanner.displayName = 'SpecialLicenseBanner';

export default memo(SpecialLicenseBanner);
