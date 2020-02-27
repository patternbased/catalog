import React, { memo } from 'react';

import LogoSvg from 'assets/images/menu/Menu_Logo.svg';
import SoundCloudSvg from 'assets/images/menu/SM_SoundCloud.svg';
import TumblrSvg from 'assets/images/menu/SM_Tumblr.svg';
import VimeoSvg from 'assets/images/menu/SM_Vimeo.svg';
import YoutubeSvg from 'assets/images/menu/SM_Youtube.svg';
import InstagramSvg from 'assets/images/menu/SM_Instagram.svg';
import ElloSvg from 'assets/images/menu/SM_Ello.svg';
import GithubSvg from 'assets/images/menu/SM_Github.svg';
import FacebookSvg from 'assets/images/menu/SM_Facebook.svg';

import './style.scss';

/**
 * Menu footer component
 * @returns {React.Component}
 */
function MenuFooter() {
    return (
        <div className="menu-footer">
            <div className="menu-footer__logo">
                <a href="http://patternbased.com/" target="_blank" rel="noopener noreferrer">
                    <LogoSvg width="200px" height="38px" />
                </a>
            </div>
            <div className="menu-footer__link">
                <a href="https://legal.patternbased.com/privacy-policy/" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                </a>
            </div>
            <div className="menu-footer__link">
                <a href="https://legal.patternbased.com/license-agreement/" target="_blank" rel="noopener noreferrer">
                    License Agreement
                </a>
            </div>
            <div className="menu-footer__social">
                <a href="https://soundcloud.com/patternbased" target="_blank" rel="noopener noreferrer">
                    <SoundCloudSvg />
                </a>
                <a href="http://patternbased.tumblr.com/" target="_blank" rel="noopener noreferrer">
                    <TumblrSvg />
                </a>
                <a href="https://vimeo.com/patternbased" target="_blank" rel="noopener noreferrer">
                    <VimeoSvg />
                </a>
                <a href="https://www.youtube.com/user/patternbased/" target="_blank" rel="noopener noreferrer">
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
            <div className="menu-footer__copyright">© COPYRIGHT 2018-2020 PatternBased Corp</div>
        </div>
    );
}

MenuFooter.displayName = 'MenuFooter';

export default memo(MenuFooter);
