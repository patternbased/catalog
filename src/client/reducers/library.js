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

const setCurrentQueue = (state, action) => ({
    ...state,
    queue: action.value,
});

const addToQueue = (state, action) => {
    const copy = [...state.queue];
    const found = copy.find(i => i.pbId === action.value.pbId);
    if (found) {
        return {
            ...state,
        };
    } else {
        return {
            ...state,
            queue: [...state.queue, action.value],
        };
    }
};

const setCurrentSong = (state, action) => ({
    ...state,
    currentSong: action.value,
});

const setCustomWorkSong = (state, action) => ({
    ...state,
    customWorkSong: action.value,
});

const clearQueue = state => ({
    ...state,
    queue: [],
});

const removeFromQueue = (state, action) => ({
    ...state,
    queue: [...state.queue.filter(x => x !== action.value)],
});

const reorderQueue = (state, action) => ({
    ...state,
    queue: action.value,
});

export default createReducer(
    { queue: [] },
    {
        [ACTIONS.GET_SONG_LIST]: getSongList,
        [ACTIONS.SET_CURRENT_PLAYLIST]: setCurrentPlaylist,
        [ACTIONS.SET_CURRENT_QUEUE]: setCurrentQueue,
        [ACTIONS.ADD_TO_QUEUE]: addToQueue,
        [ACTIONS.SET_CURRENT_SONG]: setCurrentSong,
        [ACTIONS.CLEAR_QUEUE]: clearQueue,
        [ACTIONS.REMOVE_FROM_QUEUE]: removeFromQueue,
        [ACTIONS.REORDER_QUEUE]: reorderQueue,
        [ACTIONS.SET_CUSTOM_WORK_SONG]: setCustomWorkSong,
    }
);
