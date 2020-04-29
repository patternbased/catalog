/* eslint-disable max-lines-per-function */
import React, { memo, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import MenuFooter from './menu-footer';

import { setState } from 'actions/general';

import CloseIcon from 'assets/images/Close_Icon_Gray.svg';

import './style.scss';

/**
 * Menu panel component
 * @param {Boolean} visible boolean to determine if the panel is opened or not
 * @param {Object} style json with custom CSS styling
 * @returns {React.Component}
 */
function MenuPanel({ visible, style }) {
    const panelClass = useMemo(
        () =>
            classnames('menu-panel', {
                'menu-panel--visible': visible,
            }),
        [visible]
    );

    const dispatch = useDispatch();

    return (
        <div>
            <div className={panelClass} style={style}>
                <CloseIcon onClick={() => dispatch(setState('menuOpened', false))} className="menu-panel__close" />
                <div className="menu-panel__container">
                    <div className="menu-panel__menu">
                        <div className="menu-panel__menu__link">
                            <Link to="/about">About</Link>
                        </div>
                        <div
                            className="menu-panel__menu__link"
                            onClick={() => dispatch(setState('contactOpened', true))}
                        >
                            Contact
                        </div>
                        <div className="menu-panel__menu__link">Artists</div>
                        <div
                            className="menu-panel__menu__link"
                            onClick={() => dispatch(setState('reqSuggestionsOpened', true))}
                        >
                            Request Suggestions
                        </div>
                    </div>
                    <MenuFooter />
                </div>
            </div>
        </div>
    );
}

MenuPanel.displayName = 'MenuPanel';

MenuPanel.propTypes = {
    visible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    style: PropTypes.object,
};

MenuPanel.defaultProps = {
    visible: false,
    style: {},
};

export default memo(MenuPanel);
