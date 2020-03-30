import { createReducer } from './utils';
import { ACTIONS } from '../actions/cart';
import uuid from 'react-uuid';

const initialState = {
    items: [],
    subtotal: 0,
    total: 0,
};

const addToCart = (state, action) => {
    const current = [...state.items];
    const itemId = uuid();
    const toAdd = {
        type: action.licType,
        price: action.price,
        song: action.song,
        id: itemId,
    };
    current.push(toAdd);
    let total = 0;
    current.map(i => (total += i.price));
    return {
        ...state,
        items: current,
        subtotal: total,
        total: total,
    };
};

const removeFromCart = (state, action) => {
    let current = [...state.items];
    current = current.filter(x => x.id !== action.songId);
    let total = 0;
    current.map(i => (total += i.price));
    return {
        ...state,
        items: current,
        subtotal: total,
        total: total,
    };
};

const clearCartData = state => {
    return {
        ...state,
        items: [],
        subtotal: 0,
        total: 0,
    };
};

export default createReducer(initialState, {
    [ACTIONS.ADD_TO_CART]: addToCart,
    [ACTIONS.REMOVE_FROM_CART]: removeFromCart,
    [ACTIONS.CLEAR_CART]: clearCartData,
});
