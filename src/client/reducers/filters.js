import { createReducer } from './utils';
import { ACTIONS } from '../actions/filters';
import { omit } from 'lodash';

const initialState = {
    default: {
        rhythm: [0, 10],
        speed: [0, 10],
        experimental: [0, 10],
        mood: [0, 10],
        grid: [0, 10],
        duration: [0, 20],
        flow: [],
        instruments: [],
        search: [],
    },
    applied: {},
};

const setFilter = (state, action) => ({
    ...state,
    applied: {
        ...state.applied,
        [action.label]: action.value,
    },
});

const resetFilter = (state, action) => ({
    ...state,
    applied: omit(state.applied, action.label),
});

const resetAllFilters = state => ({
    ...state,
    applied: {},
});

export default createReducer(initialState, {
    [ACTIONS.SET_FILTER]: setFilter,
    [ACTIONS.RESET_FILTER]: resetFilter,
    [ACTIONS.RESET_ALL_FILTERS]: resetAllFilters,
});
