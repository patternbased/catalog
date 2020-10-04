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
import BandcampSvg from 'assets/images/menu/SM_Bandcamp.svg';
import TikTokSvg from 'assets/images/menu/SM_TikTok.svg';
import LinkedinSvg from 'assets/images/menu/SM_Linkedin.svg';

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
                    <br /> Music production and database by <a href="https://josephminadeo.com/">Joseph Minadeo</a>
                    <br /> UI, UX and visual design by <a href="http://siorikitajima.com/">Siori Kitajima</a>
                    <br /> UX and code by <a href="https://lauras.ro/">Laura Apetroaei</a>
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
                <a href="https://albums.patternbased.com" target="_blank" rel="noopener noreferrer">
                    <BandcampSvg />
                </a>
                <a href="https://instagram.com/patternbased" target="_blank" rel="noopener noreferrer">
                    <InstagramSvg />
                </a>
                <a href="https://github.com/patternbased" target="_blank" rel="noopener noreferrer">
                    <GithubSvg />
                </a>
                <a href="https://ello.co/patternbased" target="_blank" rel="noopener noreferrer">
                    <ElloSvg />
                </a>
                <a href="https://facebook.com/patternbased" target="_blank" rel="noopener noreferrer">
                    <FacebookSvg />
                </a>
                <a href="https://soundcloud.com/patternbased" target="_blank" rel="noopener noreferrer">
                    <SoundCloudSvg />
                </a>
                <a href="http://patternbased.tumblr.com/" target="_blank" rel="noopener noreferrer">
                    <TumblrSvg />
                </a>
                <a href="https://www.youtube.com/user/patternbased/" target="_blank" rel="noopener noreferrer">
                    <YoutubeSvg />
                </a>
                <a href="https://vimeo.com/patternbased" target="_blank" rel="noopener noreferrer">
                    <VimeoSvg />
                </a>
                <a href="https://www.linkedin.com/company/435813/" target="_blank" rel="noopener noreferrer">
                    <LinkedinSvg />
                </a>
                <a href="https://www.tiktok.com/@patternbased" target="_blank" rel="noopener noreferrer">
                    <TikTokSvg />
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
