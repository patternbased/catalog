import React, { memo, useEffect, useState } from 'react';

import './style.scss';

/**
 * Back to top button component
 * @returns {React.Component}
 */
function BackToTop() {
    const [scrolled, setScrolled] = useState(false);
    const [style, setStyle] = useState({});

    const scrollHandler = () => {
        if (window.pageYOffset > 80) {
            setScrolled(true);
            setStyle({ opacity: '0.8', visibility: 'visible' });
        } else {
            setScrolled(false);
            setStyle({ opacity: '0', visibility: 'hidden' });
        }
    };

    const backToTop = () => {
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler);
    }, [scrolled]);

    return <div className="back-to-top" style={style} onClick={() => backToTop()}></div>;
}

BackToTop.displayName = 'BackToTop';

export default memo(BackToTop);
