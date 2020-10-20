import { createReducer } from './utils';
import { ACTIONS } from '../actions/cart';
import uuid from 'react-uuid';

const initialState = {
    items: [],
    subtotal: 0,
    total: 0,
    promo: null,
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
    let subtotal = 0;
    current.map((i) => (subtotal += i.price));
    const promoCode = state.promo;
    if (promoCode) {
        if (promoCode.type === 'percent') {
            const vOff = (promoCode.value / 100) * subtotal;
            total = subtotal - vOff;
        } else {
            total = subtotal - promoCode.value;
        }
    } else {
        total = subtotal;
    }
    return {
        ...state,
        items: current,
        subtotal: subtotal,
        total: total,
    };
};

const removeFromCart = (state, action) => {
    let current = [...state.items];
    current = current.filter((x) => x.id !== action.songId);
    let total = 0;
    current.map((i) => (total += i.price));
    return {
        ...state,
        items: current,
        subtotal: total,
        total: total,
    };
};

const clearCartData = (state) => {
    return {
        ...state,
        items: [],
        subtotal: 0,
        total: 0,
        promo: null,
    };
};

const setPromoCode = (state, action) => {
    const promoCode = action.promo;
    const sttl = state.subtotal;
    let total = 0;
    if (promoCode) {
        if (promoCode.type === 'percent') {
            const vOff = (promoCode.value / 100) * sttl;
            total = sttl - vOff;
            promoCode.valueOff = vOff;
        } else {
            total = sttl - promoCode.value;
            promoCode.valueOff = promoCode.value;
        }
    }
    return {
        ...state,
        promo: promoCode,
        total: total,
    };
};

export default createReducer(initialState, {
    [ACTIONS.ADD_TO_CART]: addToCart,
    [ACTIONS.REMOVE_FROM_CART]: removeFromCart,
    [ACTIONS.CLEAR_CART]: clearCartData,
    [ACTIONS.SET_PROMO_CODE]: setPromoCode,
});
