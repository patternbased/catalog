import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Song By component
 * @param {String} project the name of the project
 * @param {Array} feat array of FeatArtist names
 * @param {String} classNames CSS classes
 * @returns {React.Component}
 */
function SongBy({ project, feat, classNames }) {
    return (
        <span className={classNames}>
            by <Link to={`/project/${project.toLowerCase().split(' ').join('-')}`}>{project}</Link>
            {feat.length > 0 && (
                <>
                    (feat.
                    {feat.map((art, index) => (
                        <span key={index}>
                            <a href={art.url} target="_blank" rel="noopener noreferrer">
                                {art.name}
                            </a>
                            {index < feat.length - 1 && ', '}
                        </span>
                    ))}
                    )
                </>
            )}
        </span>
    );
}

SongBy.propTypes = {
    project: PropTypes.string,
    feat: PropTypes.array,
    classNames: PropTypes.string,
};

SongBy.defaultProps = {
    project: '',
    feat: [],
    classNames: '',
};

SongBy.displayName = 'SongBy';

export default memo(SongBy);
