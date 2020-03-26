import { combineReducers } from 'redux';

import filters from './filters';
import library from './library';
import general from './general';
import cart from './cart';

const reducer = combineReducers({
    filters,
    library,
    general,
    cart,
});

export default reducer;
