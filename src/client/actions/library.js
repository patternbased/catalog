import { api } from '../services';
import 'babel-polyfill';

export const ACTIONS = {
    GET_SONG_LIST: 'library.getSongList',
    SET_CURRENT_PLAYLIST: 'library.setCurrentPlaylist',
    ADD_TO_QUEUE: 'library.addToQueue',
    SET_CURRENT_SONG: 'library.setCurrentSong',
    CLEAR_QUEUE: 'library.clearQueue',
};

/**
 * Populates redux stock list
 * @returns {Function}
 */
export const getSongList = () => async dispatch => {
    const data = await api.get('/api/get-all-songs');

    if (!data.error) {
        dispatch({
            type: ACTIONS.GET_SONG_LIST,
            data,
        });
    }
};

/**
 * Sets the current playlist
 * @param {Array} value the value to set
 * @returns {Object}
 */
export const setCurrentPlaylist = value => ({
    type: ACTIONS.SET_CURRENT_PLAYLIST,
    value,
});

/**
 * Adds songs to the queue
 * @param {Object} value the song to add
 * @returns {Object}
 */
export const addToQueue = value => ({
    type: ACTIONS.ADD_TO_QUEUE,
    value,
});

/**
 * Sets the current song
 * @param {Object} value the song to add
 * @returns {Object}
 */
export const setCurrentSong = value => ({
    type: ACTIONS.SET_CURRENT_SONG,
    value,
});

/**
 * Sets the current song
 * @param {Object} value the song to add
 * @returns {Object}
 */
export const clearQueue = () => ({
    type: ACTIONS.CLEAR_QUEUE,
});
