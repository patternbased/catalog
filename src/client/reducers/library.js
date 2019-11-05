import { createReducer } from './utils';
import { ACTIONS } from '../actions/library';

/**
 * Stores the stock list and calculates Values and Sectors/Interests weights based on that data.
 * Also stores initial slider positions based on those calculations.
 *
 * @param {Object} state current reducer state
 * @param {Object} action the action of type { data: Array of symbols }
 * @returns {Object} the updated state
 */
const getSongList = (state, action) => {
    return {
        ...state,
        songs: action.data.songs,
    };
};

const setCurrentPlaylist = (state, action) => ({
    ...state,
    current: action.value,
});

const addToQueue = (state, action) => {
    const copy = [...state.queue];
    if (!copy.includes(action.value)) {
        return {
            ...state,
            queue: [...state.queue, action.value],
        };
    } else {
        return {
            ...state,
        };
    }
};

const setCurrentSong = (state, action) => ({
    ...state,
    currentSong: action.value,
});

const clearQueue = state => ({
    ...state,
    queue: [],
});

export default createReducer(
    { queue: [] },
    {
        [ACTIONS.GET_SONG_LIST]: getSongList,
        [ACTIONS.SET_CURRENT_PLAYLIST]: setCurrentPlaylist,
        [ACTIONS.ADD_TO_QUEUE]: addToQueue,
        [ACTIONS.SET_CURRENT_SONG]: setCurrentSong,
        [ACTIONS.CLEAR_QUEUE]: clearQueue,
    }
);
