/* eslint-disable max-lines-per-function */
import React, { memo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { TABLE_FLOW_SHAPES } from 'utils/constants';
import Button from 'components/button';
import SimilarSongsPanel from 'components/similar-songs';
import classnames from 'classnames';
import selectors from 'selectors';
import { addToQueue, setCurrentSong } from 'actions/library';
import { setState } from 'actions/general';
import InfiniteScroll from 'react-infinite-scroll-component';
import BackToTop from 'components/back-to-top';
import Modal from 'components/modal';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import './style.scss';

const headers = ['SONG NAME / ARTIST NAME', 'FLOW', 'DURATION', 'KEY / BPM', 'RTM', 'SPD', 'EXP', 'MOD', 'GRD'];
const songsToDisplay = 20;
/**
 * Songs table component
 * @param {Array} list list of song objects
 * @param {Function} onSelect action to take when selecting a song
 * @returns {React.Component}
 */
function SongsTable({ list, onSelect, listName, page }) {
    const [hovered, setHovered] = useState([]);
    const [similarOpened, setSimilarOpened] = useState(false);
    const [similarTo, setSimilarTo] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [songs, setSongs] = useState([]);
    const [shareItem, setShareItem] = useState();
    const [shareOpened, setShareOpened] = useState(false);
    const appliedFilters = useSelector(selectors.filters.getApplied);
    const currentSong = useSelector(selectors.library.getCurrentSong);
    const scrolled = useSelector(selectors.general.get('scrolled'));
    const dispatch = useDispatch();

    useEffect(() => {
        setSongs(list.slice(0, songsToDisplay));
    }, [list]);

    const addToHovered = index => {
        let copyHovered = [...hovered];
        copyHovered.push(index);
        setHovered(copyHovered);
    };

    const removeFromHovered = index => {
        let copyHovered = [...hovered];
        setHovered(copyHovered.filter(x => x !== index));
    };

    const checkIfHovered = useCallback(
        index => {
            return hovered.indexOf(index) > -1;
        },
        [hovered]
    );

    const playSong = (item, index) => {
        onSelect(item);
        dispatch(setCurrentSong(item));
        dispatch(addToQueue(item));
        dispatch(addToQueue(list[index + 1]));
    };

    const getRowClass = index =>
        classnames('table__body__row', {
            'table__body__row--hovered': checkIfHovered(index),
        });

    const addListToQueue = () => {
        dispatch(addToQueue({ list: list, name: createPlaylistName() }));
    };

    const createPlaylistName = () => {
        let label = '';
        Object.keys(appliedFilters).map(filter => {
            switch (filter) {
                case 'rhythm':
                    label += '<strong>RTM</strong>';
                    break;
                case 'speed':
                    label += '<strong>SPD</strong>';
                    break;
                case 'experimental':
                    label += '<strong>EXP</strong>';
                    break;
                case 'mood':
                    label += '<strong>MOD</strong>';
                    break;
                case 'grid':
                    label += '<strong>GRD</strong>';
                    break;
                case 'duration':
                    label += '<strong>DUR</strong>';
                    break;
                default:
                    break;
            }
            label += ` ${appliedFilters[filter][0]}-${appliedFilters[filter][1]}, `;
        });
        return label;
    };

    const loadMoreData = useCallback(() => {
        if (songs.length >= list.length) {
            setHasMore(false);
            return;
        }

        setTimeout(() => {
            setSongs(songs.concat(list.slice(songs.length, songs.length + songsToDisplay)));
        }, 500);
    }, [songs]);

    const renderAppliedFilters = (label, values) => {
        let allFlows = '';
        let allInstruments = '';
        let allSearches = '';
        let separator = ', ';
        switch (label) {
            case 'search':
                allSearches = values.map((val, index) => {
                    if (index === values.length - 1) {
                        separator = '';
                    }
                    return val.value.charAt(0).toUpperCase() + val.value.substring(1) + separator;
                });
                return allSearches;
            case 'flow':
                allFlows = values.map((val, index) => {
                    if (index === values.length - 1) {
                        separator = '';
                    }
                    return val.charAt(0).toUpperCase() + val.substring(1) + separator;
                });
                return allFlows;
            case 'instruments':
                allInstruments = values.map((val, index) => {
                    if (index === values.length - 1) {
                        separator = '';
                    }
                    return val.charAt(0).toUpperCase() + val.substring(1) + separator;
                });
                return allInstruments;
            default:
                return `${values[0]}-${values[1]}`;
        }
    };

    const openShareModal = item => {
        setShareItem(item);
        setShareOpened(true);
    };

    const getTableMainClass = classnames('table__sticky', {
        'table__sticky--big': !scrolled,
        'table__sticky--small': scrolled,
        'table__sticky--regular': page === 'home',
    });

    return (
        <>
            <div className="table">
                <div className={getTableMainClass}>
                    {(Object.keys(appliedFilters).length > 0 || listName) && (
                        <div className="table__filters">
                            <img
                                src="/assets/images/table/results-play.png"
                                className="table__filters__icon"
                                onClick={() => addListToQueue()}
                            />
                            <div className="table__filters__applied">
                                {listName && <div className="table__filters__applied__single">{listName}</div>}
                                {!listName && (
                                    <>
                                        {Object.keys(appliedFilters).map((filter, index) => (
                                            <div className="table__filters__applied__single" key={index}>
                                                <span className="table__filters__applied__single-bold">
                                                    {filter.charAt(0).toUpperCase() + filter.substring(1)}
                                                </span>

                                                {renderAppliedFilters(filter, appliedFilters[filter])}
                                                {index < Object.keys(appliedFilters).length - 1 && ', '}
                                            </div>
                                        ))}
                                    </>
                                )}
                                <div className="table__filters__applied__extra">
                                    <div className="table__filters__applied__count">
                                        <strong>{list.length}</strong> Tracks
                                    </div>
                                    <div className="table__filters__applied__share"></div>
                                    <BackToTop />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="table__header">
                        {headers.map((item, index) => (
                            <div className="table__header__label" key={index}>
                                <p>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="table__body">
                    <InfiniteScroll
                        dataLength={songs.length}
                        next={() => loadMoreData()}
                        hasMore={hasMore}
                        loader={<h4>Loading...</h4>}
                    >
                        {songs.map((item, index) => (
                            <div
                                className={getRowClass(index)}
                                style={{ backgroundColor: checkIfHovered(index) ? '#0092C5' : 'white' }}
                                key={index}
                                onMouseOver={() => addToHovered(index)}
                                onMouseOut={() => removeFromHovered(index)}
                            >
                                <>
                                    <div className="table__body__row-title">
                                        <div className="table__body__row-title__container">
                                            <img
                                                src={
                                                    checkIfHovered(index)
                                                        ? '/assets/images/table/play-btn.png'
                                                        : currentSong && currentSong.pbId === item.pbId
                                                        ? '/assets/images/table/play-active.svg'
                                                        : item.cover
                                                }
                                                onClick={() => playSong(item, index)}
                                            />
                                            <div className="table__body__row-title__wrapper">
                                                <p className="table__body__row-title__wrapper-song-title">
                                                    {item.title} <span>by {item.artistName}</span>
                                                </p>
                                                <p className="table__body__row-title__wrapper-song-artist">
                                                    <span className="table__body__row-title__wrapper-song-artist--name">
                                                        by {item.artistName}
                                                    </span>
                                                    <span className="table__body__row-title__wrapper-song-artist--description">
                                                        {`${item.description.substr(0, 150)}...`}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="table__body__row-title__actions">
                                            <div
                                                className="table__body__row-title__actions-button table__body__row-title__actions-button--similar"
                                                onClick={() => {
                                                    setSimilarOpened(true);
                                                    setSimilarTo(item);
                                                    dispatch(setState('similarOpened', true));
                                                }}
                                            />
                                            <div
                                                className="table__body__row-title__actions-button table__body__row-title__actions-button--share"
                                                onClick={() => openShareModal(item)}
                                            />
                                            <Button
                                                className="table__body__row-title__actions-license"
                                                width={80}
                                                height={40}
                                            >
                                                License
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="table__body__row-flow">
                                        {TABLE_FLOW_SHAPES[item.arc.toLowerCase()] && (
                                            <img
                                                src={
                                                    TABLE_FLOW_SHAPES.find(x => x.name === item.arc.toLowerCase()).image
                                                }
                                            />
                                        )}
                                    </div>
                                    <div className="table__body__row-duration">
                                        <strong>
                                            <p>{item.length}</p>
                                        </strong>
                                    </div>
                                    <div className="table__body__row-bpm">
                                        <p>
                                            <strong>Key</strong> {item.musicKey}
                                        </p>
                                        <p>
                                            <strong>BPM</strong> {item.bpm}
                                        </p>
                                    </div>
                                    <div
                                        className="table__body__row-filter"
                                        style={{ backgroundImage: `url('/assets/images/table/rtm.png')` }}
                                    >
                                        <p>{item.rhythm}</p>
                                    </div>
                                    <div
                                        className="table__body__row-filter"
                                        style={{ backgroundImage: `url('/assets/images/table/spd.png')` }}
                                    >
                                        <p>{item.speed}</p>
                                    </div>
                                    <div
                                        className="table__body__row-filter"
                                        style={{ backgroundImage: `url('/assets/images/table/exp.png')` }}
                                    >
                                        <p>{item.experimental}</p>
                                    </div>
                                    <div
                                        className="table__body__row-filter"
                                        style={{ backgroundImage: `url('/assets/images/table/mod.png')` }}
                                    >
                                        <p>{item.mood}</p>
                                    </div>
                                    <div
                                        className="table__body__row-filter"
                                        style={{ backgroundImage: `url('/assets/images/table/grd.png')` }}
                                    >
                                        <p>{item.grid}</p>
                                    </div>
                                </>
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>
            </div>
            {similarTo && (
                <SimilarSongsPanel
                    visible={similarOpened}
                    onClose={() => setSimilarOpened(false)}
                    similarTo={similarTo}
                />
            )}
            {shareOpened && (
                <Modal opened={shareOpened} modifier="share">
                    <img
                        src="/assets/images/close-icon.png"
                        onClick={() => setShareOpened(false)}
                        className="share__close"
                    />
                    <div className="share__header">Share This Song</div>
                    <div className="share__item">
                        <img src={shareItem.cover} />
                        <div>
                            <div className="share__item__title">{shareItem.title}</div>
                            <div className="share__item__artist">by {shareItem.artistName}</div>
                        </div>
                    </div>
                    <CopyToClipboard text={`http://localhost:3500/?ids=${shareItem.pbId}`}>
                        <div className="share__button">Copy Share Link</div>
                    </CopyToClipboard>
                </Modal>
            )}
        </>
    );
}

SongsTable.propTypes = {
    list: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    listName: PropTypes.string,
    page: PropTypes.string,
};

SongsTable.displayName = 'SongsTable';

export default memo(SongsTable);
