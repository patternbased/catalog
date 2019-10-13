import { createReducer } from './utils';
import { ACTIONS } from '../actions/songs';

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
        all: action.data,
    };
};

export default createReducer(
    {},
    {
        [ACTIONS.GET_SONG_LIST]: getSongList,
    }
);
