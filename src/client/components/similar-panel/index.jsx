/* eslint-disable max-lines-per-function */
import React, { memo, useMemo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './style.scss';

/**
 * Similar songs panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function SimilarPanel({ visible, style }) {
    const panelClass = useMemo(
        () =>
            classnames('similar-panel', {
                'similar-panel--visible': visible,
            }),
        [visible]
    );

    return (
        <div>
            <div className={panelClass} style={style}>
                <div className="similar-panel__container"></div>
            </div>
        </div>
    );
}

SimilarPanel.displayName = 'SimilarPanel';

SimilarPanel.propTypes = {
    visible: PropTypes.bool,
    style: PropTypes.object,
};

SimilarPanel.defaultProps = {
    visible: false,
    style: {},
};

export default memo(SimilarPanel);
