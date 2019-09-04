import React, { memo } from 'react';
import { Animated } from 'react-animated-css';
import PropTypes from 'prop-types';

import BasicFilter from 'components/filters/basic';
import FlowFilter from 'components/filters/flow';
import InstrumentsFilter from 'components/filters/instruments';

import './style.scss';

/**
 * Left side panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function LeftPanel({ visible, style }) {
    return (
        <>
            <Animated
                isVisible={visible}
                animationIn="slideInLeft"
                animationOut="slideOutLeft"
                animationInDuration={800}
                animationOutDuration={800}
            >
                <div className="left-panel" style={style}>
                    <BasicFilter name="rhythm" isOpened={true} />
                    <BasicFilter name="speed" isOpened={true} />
                    <BasicFilter name="experimental" isOpened={true} />
                    <BasicFilter name="mood" isOpened={true} />
                    <BasicFilter name="grid" isOpened={true} />
                    <BasicFilter name="duration" />
                    <FlowFilter />
                    <InstrumentsFilter />
                </div>
            </Animated>
        </>
    );
}

LeftPanel.displayName = 'LeftPanel';

LeftPanel.propTypes = {
    visible: PropTypes.bool,
    style: PropTypes.object,
};

LeftPanel.defaultProps = {
    visible: false,
    style: {},
};

export default memo(LeftPanel);
