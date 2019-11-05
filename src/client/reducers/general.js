import { createReducer } from './utils';
import { ACTIONS } from '../actions/general';

const initialState = {
    filtersOpened: false,
    presetsOpened: false,
    queueOpened: false,
    similarOpened: false,
};

const setState = (state, action) => ({
    ...state,
    [action.label]: action.value,
});

export default createReducer(initialState, {
    [ACTIONS.SET_STATE]: setState,
});
