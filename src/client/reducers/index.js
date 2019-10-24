import { combineReducers } from 'redux';

import filters from './filters';
import library from './library';
import general from './general';

const reducer = combineReducers({
    filters,
    library,
    general,
});

export default reducer;
