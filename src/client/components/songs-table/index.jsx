/* eslint-disable max-lines-per-function */
import React, { memo, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import uuid from 'react-uuid';
import ReactGA from 'react-ga';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classnames from 'classnames';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TABLE_FLOW_SHAPES } from 'utils/constants';
import Button from 'components/button';
import SimilarSongsPanel from 'components/similar-songs';
import BackToTop from 'components/back-to-top';
import Modal from 'components/modal';
import selectors from 'selectors';

import { addToQueue, setCurrentSong, setCustomWorkSong, setLicenseSong } from 'actions/library';
import { setState } from 'actions/general';

import CopyLinkSvg from 'assets/images/copy-link.svg';
import DoneSvg from 'assets/images/done-check.svg';
import PianoSvg from 'assets/images/single-song/CustomWork_dark.svg';
import SimilarSvg from 'assets/images/SimilarSong_Icon_dark.svg';
import ShareSvg from 'assets/images/share-icon-dark.svg';

import './style.scss';

const headers = {
    'SONG NAME / ARTIST NAME': false,
    FLOW: false,
    DURATION: false,
    'KEY / BPM': false,
    RTM: true,
    SPD: true,
    EXP: true,
    MOD: true,
    ORG: true,
};
const songsToDisplay = 20;
const baseUrl =
    process.env.NODE_ENV === 'production' ? 'https://catalog.patternbased.com' : 'https://patternbased.herokuapp.com/';
/**
 * Songs table component
 * @param {Array} list list of song objects
 * @param {Function} onSelect action to take when selecting a song
 * @returns {React.Component}
 */
function SongsTable({ list, onSelect, listName, page, short = false, extraClass = '' }) {
    const [hovered, setHovered] = useState([]);
    const [similarTo, setSimilarTo] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [songs, setSongs] = useState([]);
    const [shareItem, setShareItem] = useState();
    const [shareOpened, setShareOpened] = useState(false);
    const [shareResultOpened, setShareResultOpened] = useState(false);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [shareSongLinkCopied, setShareSongLinkCopied] = useState(false);
    const appliedFilters = useSelector(selectors.filters.getApplied);
    const currentSong = useSelector(selectors.library.getCurrentSong);
    const scrolled = useSelector(selectors.general.get('scrolled'));
    const similarOpened = useSelector(selectors.general.get('similarOpened'));
    const filtersPanelOpened = useSelector(selectors.general.get('filtersOpened'));
    const presetsPanelOpened = useSelector(selectors.general.get('presetsOpened'));
    const dispatch = useDispatch();

    useEffect(() => {
        setSongs(list.slice(0, songsToDisplay));
    }, [list]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [appliedFilters]);

    const addToHovered = (index) => {
        let copyHovered = [...hovered];
        copyHovered.push(index);
        setHovered(copyHovered);
    };

    const removeFromHovered = (index) => {
        let copyHovered = [...hovered];
        setHovered(copyHovered.filter((x) => x !== index));
    };

    const checkIfHovered = useCallback(
        (index) => {
            return hovered.indexOf(index) > -1;
        },
        [hovered]
    );

    const playSong = (item) => {
        onSelect(item);
        dispatch(setCurrentSong(item));
        dispatch(addToQueue(item));
        ReactGA.event({
            category: 'Songs table',
            action: 'Play song',
            label: `Play ${item.artistName} - ${item.title}`,
        });
    };

    const getRowClass = (index) =>
        classnames('table__body__row', {
            'table__body__row--hovered': checkIfHovered(index),
        });

    const addListToQueue = () => {
        onSelect(list[0]);
        dispatch(setCurrentSong(list[0]));
        dispatch(addToQueue({ list: list, name: createPlaylistName() }));
    };

    const createPlaylistName = (isShare = false) => {
        let label = '';
        Object.keys(appliedFilters).map((filter) => {
            switch (filter) {
                case 'rhythm':
                    label += isShare ? '<strong>R</strong> ' : '<strong>RTM</strong>';
                    break;
                case 'speed':
                    label += isShare ? '<strong>S</strong> ' : '<strong>SPD</strong>';
                    break;
                case 'experimental':
                    label += isShare ? '<strong>E</strong> ' : '<strong>EXP</strong>';
                    break;
                case 'mood':
                    label += isShare ? '<strong>M</strong> ' : '<strong>MOD</strong>';
                    break;
                case 'grid':
                    label += isShare ? '<strong>O</strong> ' : '<strong>ORG</strong>';
                    break;
                case 'duration':
                    label += isShare ? '<strong>D</strong> ' : '<strong>DUR</strong>';
                    break;
                default:
                    break;
            }
            label += appliedFilters[filter] ? ` ${appliedFilters[filter][0]}-${appliedFilters[filter][1]}, ` : '';
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
        let allDurations = '';
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
            case 'duration':
                allDurations = values.map((val, index) => {
                    if (index === values.length - 1) {
                        separator = '';
                    }
                    return `${val} min` + `${separator}`;
                });
                return allDurations;
            default:
                return `${values[0]}-${values[1]}`;
        }
    };

    const openShareModal = (item) => {
        setShareItem(item);
        setShareOpened(true);
    };

    const getTableMainClass = classnames('table__sticky', {
        'table__sticky--big': !scrolled,
        'table__sticky--small': scrolled,
        'table__sticky--regular': page === 'home',
        'table__sticky--short': short,
    });

    const [shareResultsName, setShareResulsName] = useState('');
    const shareListId = uuid();
    const shareSongId = uuid();

    useEffect(() => {
        setShareResulsName(createPlaylistName(true));
    }, [list]);

    const copyShareLink = () => {
        const shareData = {
            name: shareResultsName,
            type: 'search',
            songs: songs.map((s) => s.pbId),
            shareId: shareListId,
            filters: appliedFilters,
        };
        fetch('/api/create-share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: shareData }),
        }).then((res) => {
            setShareLinkCopied(true);
            ReactGA.event({
                category: 'Songs table',
                action: 'Share song clicked',
                label: `Share ${shareResultsName}`,
            });
        });
    };

    const copyShareSongLink = () => {
        const shareData = {
            name: shareItem.title,
            type: 'song',
            songs: [shareItem.pbId],
            shareId: shareSongId,
        };
        fetch('/api/create-share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: shareData }),
        }).then((res) => {
            setShareSongLinkCopied(true);
            ReactGA.event({
                category: 'Songs table',
                action: 'Share song clicked',
                label: `Share ${shareItem.title}`,
            });
        });
    };

    return (
        <>
            <div
                className={classnames('table', {
                    [extraClass]: extraClass.length > 0,
                })}
            >
                <div className={getTableMainClass}>
                    {!page && (Object.keys(appliedFilters).length > 0 || listName) && (
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
                                                    {filter === 'grid'
                                                        ? 'Organic'
                                                        : filter.charAt(0).toUpperCase() + filter.substring(1)}
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
                                    <div
                                        className="table__filters__applied__share"
                                        onClick={() => setShareResultOpened(true)}
                                    ></div>
                                    <BackToTop />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="table__header">
                        {Object.keys(headers).map((item, index) => (
                            <div
                                className={classnames('table__header__label', {
                                    'table-hide': headers[item] && (filtersPanelOpened || presetsPanelOpened),
                                    'mobile-hide': headers[item],
                                    'hide-when-opened':
                                        !item.includes('NAME') &&
                                        (filtersPanelOpened || presetsPanelOpened || window.innerWidth < 541),
                                    'hide-all': item.includes('NAME') && window.innerWidth < 541,
                                })}
                                key={index}
                            >
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
                                                    checkIfHovered(index) && window.innerWidth > 768
                                                        ? '/assets/images/table/play-btn.png'
                                                        : currentSong && currentSong.pbId === item.pbId
                                                        ? '/assets/images/table/play-active.svg'
                                                        : item.cover
                                                }
                                                onClick={() => playSong(item)}
                                            />
                                            <div className="table__body__row-title__wrapper">
                                                <p className="table__body__row-title__wrapper-song-title">
                                                    <Link
                                                        to={`/song/${item.pbId}-${item.title
                                                            .toLowerCase()
                                                            .split(' ')
                                                            .join('-')}`}
                                                    >
                                                        <span>{item.title}</span>{' '}
                                                    </Link>
                                                    <Link
                                                        to={`/project/${item.artistName
                                                            .toLowerCase()
                                                            .split(' ')
                                                            .join('-')}`}
                                                    >
                                                        <span className="table__body__row-title__wrapper-song-title table__body__row-title__wrapper-song-title--artist">
                                                            by {item.artistName}
                                                        </span>
                                                    </Link>
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
                                            <PianoSvg
                                                className="table__body__row-title__actions-button"
                                                onClick={() => {
                                                    dispatch(
                                                        setCustomWorkSong({
                                                            title: item.title,
                                                            artist: item.artistName,
                                                            image: item.cover,
                                                        })
                                                    );
                                                    dispatch(setState('customWorkOpened', true));
                                                }}
                                            />
                                            <SimilarSvg
                                                className="table__body__row-title__actions-button"
                                                onClick={() => {
                                                    setSimilarTo(item);
                                                    dispatch(setState('similarOpened', true));
                                                    ReactGA.event({
                                                        category: 'Songs table',
                                                        action: 'Similar songs clicked',
                                                        label: `Similar to ${item.artistName} - ${item.title}`,
                                                    });
                                                }}
                                            />
                                            <ShareSvg
                                                className="table__body__row-title__actions-button"
                                                onClick={() => openShareModal(item)}
                                            />
                                            <Button
                                                className="table__body__row-title__actions-license"
                                                width={80}
                                                height={40}
                                                onClick={() => {
                                                    dispatch(
                                                        setLicenseSong({
                                                            title: item.title,
                                                            artist: item.artistName,
                                                            image: item.cover,
                                                            url: item.url,
                                                            album: item.albumTitle,
                                                            trackNo: item.sequence,
                                                        })
                                                    );
                                                    dispatch(setState('licenseOpened', true));
                                                    ReactGA.event({
                                                        category: 'Songs table',
                                                        action: 'License clicked',
                                                        label: `License for ${item.artistName} - ${item.title}`,
                                                    });
                                                }}
                                            >
                                                License
                                            </Button>
                                        </div>
                                    </div>
                                    <div
                                        className={classnames('table__body__row-flow', {
                                            'hide-when-opened':
                                                filtersPanelOpened || presetsPanelOpened || window.innerWidth < 541,
                                        })}
                                    >
                                        {TABLE_FLOW_SHAPES.find(
                                            (x) => x.name.toLowerCase() === item.arc.toLowerCase()
                                        ) && (
                                            <img
                                                src={
                                                    TABLE_FLOW_SHAPES.find(
                                                        (x) => x.name.toLowerCase() === item.arc.toLowerCase()
                                                    ).image
                                                }
                                            />
                                        )}
                                    </div>
                                    <div
                                        className={classnames('table__body__row-duration', {
                                            'hide-when-opened':
                                                filtersPanelOpened || presetsPanelOpened || window.innerWidth < 541,
                                        })}
                                    >
                                        <strong>
                                            <p>{item.length.split(':').slice(1).slice(-2).join(':')}</p>
                                        </strong>
                                    </div>
                                    <div
                                        className={classnames('table__body__row-bpm', {
                                            'hide-when-opened':
                                                filtersPanelOpened || presetsPanelOpened || window.innerWidth < 541,
                                        })}
                                    >
                                        <p>
                                            <strong>Key</strong> {item.musicKey}
                                        </p>
                                        <p>
                                            <strong>BPM</strong> {item.bpm}
                                        </p>
                                    </div>
                                    <div
                                        className={classnames('table__body__row-filter', {
                                            'table-hide': filtersPanelOpened || presetsPanelOpened,
                                        })}
                                        style={{ backgroundImage: `url('/assets/images/table/rtm.png')` }}
                                    >
                                        <p>{item.rhythm}</p>
                                    </div>
                                    <div
                                        className={classnames('table__body__row-filter', {
                                            'table-hide': filtersPanelOpened || presetsPanelOpened,
                                        })}
                                        style={{ backgroundImage: `url('/assets/images/table/spd.png')` }}
                                    >
                                        <p>{item.speed}</p>
                                    </div>
                                    <div
                                        className={classnames('table__body__row-filter', {
                                            'table-hide': filtersPanelOpened || presetsPanelOpened,
                                        })}
                                        style={{ backgroundImage: `url('/assets/images/table/exp.png')` }}
                                    >
                                        <p>{item.experimental}</p>
                                    </div>
                                    <div
                                        className={classnames('table__body__row-filter', {
                                            'table-hide': filtersPanelOpened || presetsPanelOpened,
                                        })}
                                        style={{ backgroundImage: `url('/assets/images/table/mod.png')` }}
                                    >
                                        <p>{item.mood}</p>
                                    </div>
                                    <div
                                        className={classnames('table__body__row-filter', {
                                            'table-hide': filtersPanelOpened || presetsPanelOpened,
                                        })}
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
                    onClose={() => dispatch(setState('similarOpened', false))}
                    similarTo={similarTo}
                />
            )}
            {shareResultOpened && (
                <Modal opened={shareResultOpened} modifier="share queue-share">
                    <img
                        src="/assets/images/close-icon.png"
                        onClick={() => setShareResultOpened(false)}
                        className="share__close"
                    />
                    <div className="share__header">Share This Search</div>
                    <div className="share__item">
                        <img src="/assets/images/table/results-play.png" />
                        <div>
                            <div
                                className="share__item__title"
                                dangerouslySetInnerHTML={{ __html: shareResultsName }}
                            ></div>
                            <div className="share__item__artist">{list.length} Tracks</div>
                        </div>
                    </div>

                    <CopyToClipboard text={`${baseUrl}?shareId=${shareListId}`} onCopy={() => copyShareLink()}>
                        {shareLinkCopied ? (
                            <div className="share__button share__button--copied">
                                <DoneSvg />
                                Copied to clipboard!
                            </div>
                        ) : (
                            <div className="share__button">
                                <CopyLinkSvg />
                                Copy Share Link
                            </div>
                        )}
                    </CopyToClipboard>
                </Modal>
            )}
            {shareOpened && (
                <Modal opened={shareOpened} modifier="share queue-share">
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
                    <CopyToClipboard text={`${baseUrl}?shareId=${shareSongId}`} onCopy={() => copyShareSongLink()}>
                        {shareSongLinkCopied ? (
                            <div className="share__button share__button--copied">
                                <DoneSvg />
                                Copied to clipboard!
                            </div>
                        ) : (
                            <div className="share__button">
                                <CopyLinkSvg />
                                Copy Share Link
                            </div>
                        )}
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
    short: PropTypes.bool,
    extraClass: PropTypes.string,
};

SongsTable.displayName = 'SongsTable';

export default memo(SongsTable);
