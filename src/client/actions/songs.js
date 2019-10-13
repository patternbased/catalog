import { api } from '../services';
import 'babel-polyfill';

export const ACTIONS = {
    GET_SONG_LIST: 'songs.getSongList',
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
