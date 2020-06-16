import { createReducer } from './utils';
import { ACTIONS } from '../actions/general';

const initialState = {
    filtersOpened: false,
    presetsOpened: false,
    queueOpened: false,
    menuOpened: false,
    reqSuggestionsOpened: false,
    customWorkOpened: false,
    customLicenseOpened: false,
    contactOpened: false,
    reqComposingOpened: false,
    similarOpened: false,
    licenseOpened: false,
    specialRateOpened: false,
    fullLicenseOpened: false,
    cartOpened: false,
    checkoutOpened: false,
    scrolled: false,
    songPlaying: false,
};

const setState = (state, action) => {
    if (action.label === 'licenseOpened' && action.value) {
        return {
            ...state,
            queueOpened: false,
            similarOpened: false,
            menuOpened: false,
            reqSuggestionsOpened: false,
            customWorkOpened: false,
            customLicenseOpened: false,
            specialRateOpened: false,
            fullLicenseOpened: false,
            contactOpened: false,
            reqComposingOpened: false,
            cartOpened: false,
            checkoutOpened: false,
            [action.label]: action.value,
        };
    } else if (action.label === 'customWorkOpened' && action.value) {
        return {
            ...state,
            queueOpened: false,
            similarOpened: false,
            menuOpened: false,
            reqSuggestionsOpened: false,
            customLicenseOpened: false,
            specialRateOpened: false,
            fullLicenseOpened: false,
            contactOpened: false,
            reqComposingOpened: false,
            cartOpened: false,
            checkoutOpened: false,
            [action.label]: action.value,
        };
    } else if (action.label === 'menuOpened' && action.value) {
        return {
            ...state,
            queueOpened: false,
            similarOpened: false,
            reqSuggestionsOpened: false,
            customWorkOpened: false,
            customLicenseOpened: false,
            specialRateOpened: false,
            fullLicenseOpened: false,
            contactOpened: false,
            reqComposingOpened: false,
            cartOpened: false,
            licenseOpened: false,
            checkoutOpened: false,
            [action.label]: action.value,
        };
    } else if (action.label === 'cartOpened' && action.value) {
        return {
            ...state,
            queueOpened: false,
            similarOpened: false,
            menuOpened: false,
            reqSuggestionsOpened: false,
            customWorkOpened: false,
            customLicenseOpened: false,
            specialRateOpened: false,
            fullLicenseOpened: false,
            contactOpened: false,
            reqComposingOpened: false,
            licenseOpened: false,
            checkoutOpened: false,
            [action.label]: action.value,
        };
    } else if (
        ['customLicenseOpened', 'specialRateOpened', 'fullLicenseOpened'].includes(action.label) &&
        action.value
    ) {
        return {
            ...state,
            licenseOpened: false,
            cartOpened: false,
            checkoutOpened: false,
            [action.label]: action.value,
        };
    } else {
        return {
            ...state,
            [action.label]: action.value,
        };
    }
};

export default createReducer(initialState, {
    [ACTIONS.SET_STATE]: setState,
});
