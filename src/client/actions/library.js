import { api } from '../services';
import 'babel-polyfill';
import library from 'reducers/library';

export const ACTIONS = {
    GET_SONG_LIST: 'library.getSongList',
    SET_CURRENT_PLAYLIST: 'library.setCurrentPlaylist',
    SET_CURRENT_QUEUE: 'library.setCurrentQueue',
    ADD_TO_QUEUE: 'library.addToQueue',
    SET_CURRENT_SONG: 'library.setCurrentSong',
    CLEAR_QUEUE: 'library.clearQueue',
    REMOVE_FROM_QUEUE: 'library.removeFromQueue',
    REORDER_QUEUE: 'library.reorderQueue',
    SET_CUSTOM_WORK_SONG: 'library.setCustomWorkSong',
};

/**
 * Populates redux stock list
 * @returns {Function}
 */
export const getSongList = () => async dispatch => {
    const data = await api.get('/api/all-songs');

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
 * Sets the current queue
 * @param {Array} value the value to set
 * @returns {Object}
 */
export const setCurrentQueue = value => ({
    type: ACTIONS.SET_CURRENT_QUEUE,
    value,
});

/**
 * Reorders the Queue
 * @param {Array} value the value to set
 * @returns {Object}
 */
export const reorderQueue = value => ({
    type: ACTIONS.REORDER_QUEUE,
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
 * Sets the current song for Request Custom Work form
 * @param {Object} value the song to add
 * @returns {Object}
 */
export const setCustomWorkSong = value => ({
    type: ACTIONS.SET_CUSTOM_WORK_SONG,
    value,
});

/**
 * Clears the entire queue
 * @returns {Object}
 */
export const clearQueue = () => ({
    type: ACTIONS.CLEAR_QUEUE,
});

/**
 * Removes a song from queue
 * @param {Object} value the song to add
 * @returns {Object}
 */
export const removeFromQueue = value => ({
    type: ACTIONS.REMOVE_FROM_QUEUE,
    value,
});
