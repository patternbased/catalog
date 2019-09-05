import { createReducer } from './utils';
import { ACTIONS } from '../actions/filters';

const initialState = {
    rhythm: [0, 10],
    speed: [0, 10],
    experimental: [0, 10],
    mood: [0, 10],
    grid: [0, 10],
    duration: [0, 10],
    flow: [],
    instruments: [],
};

const setFilter = (state, action) => ({
    ...state,
    [action.label]: action.value,
});

const resetFilter = (state, action) => ({
    ...state,
    [action.label]: initialState[action.label],
});

const resetAllFilters = () => ({
    ...initialState,
});

export default createReducer(initialState, {
    [ACTIONS.SET_FILTER]: setFilter,
    [ACTIONS.RESET_FILTER]: resetFilter,
    [ACTIONS.RESET_ALL_FILTERS]: resetAllFilters,
});
