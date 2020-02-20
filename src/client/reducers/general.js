import { createReducer } from './utils';
import { ACTIONS } from '../actions/general';

const initialState = {
    filtersOpened: true,
    presetsOpened: false,
    queueOpened: false,
    menuOpened: false,
    reqSuggestionsOpened: false,
    similarOpened: false,
    scrolled: false,
};

const setState = (state, action) => ({
    ...state,
    [action.label]: action.value,
});

export default createReducer(initialState, {
    [ACTIONS.SET_STATE]: setState,
});
