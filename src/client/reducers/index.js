import { combineReducers } from 'redux';

import filters from './filters';
import songs from './songs';

const reducer = combineReducers({
    filters,
    songs,
});

export default reducer;
