import { combineReducers } from 'redux';

import filters from './filters';
import library from './library';

const reducer = combineReducers({
    filters,
    library,
});

export default reducer;
