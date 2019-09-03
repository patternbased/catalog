import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

/**
 * Helper function to scroll to top when react router changes the page
 * @param {Object} props the props
 * @returns {React.Component}
 */
function ScrollToTop({ children, location }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return children;
}

ScrollToTop.displayName = 'ScrollToTop';

export default withRouter(ScrollToTop);
