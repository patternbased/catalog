import React from 'react';
import { Animated } from 'react-animated-css';

import BasicFilter from 'components/filters/basic-filter';

import './style.scss';

/**
 * Left side panel component
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
                    <BasicFilter name="rhythm" />
                    <BasicFilter name="speed" />
                    <BasicFilter name="experimental" />
                    <BasicFilter name="mood" />
                    <BasicFilter name="grid" />
                </div>
            </Animated>
        </>
    );
}

LeftPanel.displayName = 'LeftPanel';

export default LeftPanel;
