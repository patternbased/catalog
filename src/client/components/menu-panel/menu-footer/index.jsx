import React, { memo } from 'react';
import classnames from 'classnames';

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
function MenuFooter({ full = false }) {
    return (
        <div
            className={classnames('menu-footer', {
                'menu-footer--full': full,
            })}
        >
            {full && (
                <div className="menu-footer__copy">
                    Created by PatternBased
                    <br /> Directed and curated by Joseph Minadeo
                    <br /> Designed by Siori Kitajima
                    <br /> Coded by Lowla
                    <br />
                    <br />
                    Beautiful photos by amazing photographers from Unsplash.com. If you’d like to know the artist, right
                    click to open the image in new tab. The file name contains the artist name and the ID# for you to
                    find the original image in Unsplash.com.
                </div>
            )}
            <div className="menu-footer__logo">
                <a href="http://patternbased.com/" target="_blank" rel="noopener noreferrer">
                    <LogoSvg width="200px" height="38px" />
                </a>
            </div>
            {!full && (
                <>
                    <div className="menu-footer__link">
                        <a
                            href="https://legal.patternbased.com/privacy-policy/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Privacy Policy
                        </a>
                    </div>
                    <div className="menu-footer__link">
                        <a
                            href="https://legal.patternbased.com/license-agreement/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            License Agreement
                        </a>
                    </div>
                </>
            )}
            <div
                className={classnames('menu-footer__social', {
                    'menu-footer__social--full': full,
                })}
            >
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
            {full && (
                <div className="menu-footer__links">
                    <div className="menu-footer__link">
                        <a
                            href="https://legal.patternbased.com/privacy-policy/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Privacy Policy
                        </a>
                    </div>
                    <div className="menu-footer__link">
                        <a
                            href="https://legal.patternbased.com/license-agreement/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            License Agreement
                        </a>
                    </div>
                </div>
            )}
            <div
                className={classnames('menu-footer__copyright', {
                    'menu-footer__copyright--full': full,
                })}
            >
                © COPYRIGHT 2018-2020 PatternBased Corp
            </div>
        </div>
    );
}

MenuFooter.displayName = 'MenuFooter';

export default memo(MenuFooter);
