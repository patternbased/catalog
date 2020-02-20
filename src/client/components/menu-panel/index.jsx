/* eslint-disable max-lines-per-function */
import React, { memo, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import LogoSvg from 'assets/images/header/PatternBased_CatalogSearch_logo.svg';
import SoundCloudSvg from 'assets/images/menu/SM_SoundCloud.svg';
import TumblrSvg from 'assets/images/menu/SM_Tumblr.svg';
import VimeoSvg from 'assets/images/menu/SM_Vimeo.svg';
import YoutubeSvg from 'assets/images/menu/SM_Youtube.svg';
import InstagramSvg from 'assets/images/menu/SM_Instagram.svg';
import ElloSvg from 'assets/images/menu/SM_Ello.svg';
import GithubSvg from 'assets/images/menu/SM_Github.svg';
import FacebookSvg from 'assets/images/menu/SM_Facebook.svg';

import { setState } from 'actions/general';

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
                <div className="menu-panel__container">
                    <div className="menu-panel__menu">
                        <div className="menu-panel__menu__link">About</div>
                        <div className="menu-panel__menu__link">Contact</div>
                        <div className="menu-panel__menu__link">Artists</div>
                        <div
                            className="menu-panel__menu__link"
                            onClick={() => dispatch(setState('reqSuggestionsOpened', true))}
                        >
                            Request Suggestions
                        </div>
                    </div>
                    <div className="menu-panel__info">
                        <div className="menu-panel__info__logo">
                            <a href="http://patternbased.com/" target="_blank" rel="noopener noreferrer">
                                <LogoSvg width="200px" height="38px" />
                            </a>
                        </div>
                        <div className="menu-panel__info__link">
                            <a
                                href="https://legal.patternbased.com/privacy-policy/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Privacy Policy
                            </a>
                        </div>
                        <div className="menu-panel__info__link">
                            <a
                                href="https://legal.patternbased.com/license-agreement/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                License Agreement
                            </a>
                        </div>
                        <div className="menu-panel__info__social">
                            <a href="https://soundcloud.com/patternbased" target="_blank" rel="noopener noreferrer">
                                <SoundCloudSvg />
                            </a>
                            <a href="http://patternbased.tumblr.com/" target="_blank" rel="noopener noreferrer">
                                <TumblrSvg />
                            </a>
                            <a href="https://vimeo.com/patternbased" target="_blank" rel="noopener noreferrer">
                                <VimeoSvg />
                            </a>
                            <a
                                href="https://www.youtube.com/user/patternbased/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <YoutubeSvg />
                            </a>
                            <a href="https://instagram.com/patternbased" target="_blank" rel="noopener noreferrer">
                                <InstagramSvg />
                            </a>
                            <a href="https://ello.co/patternbased" target="_blank" rel="noopener noreferrer">
                                <ElloSvg />
                            </a>
                            <a href="https://github.com/patternbased" target="_blank" rel="noopener noreferrer">
                                <GithubSvg />
                            </a>
                            <a href="https://facebook.com/patternbased" target="_blank" rel="noopener noreferrer">
                                <FacebookSvg />
                            </a>
                        </div>
                        <div className="menu-panel__info__copyright">© COPYRIGHT 2018-2020 PatternBased Corp</div>
                    </div>
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
