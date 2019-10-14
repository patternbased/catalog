import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers/index';

import persistStore, { getPersistedState } from './middlewares/persist-store';

const store = createStore(
    reducer,
    getPersistedState(),
    compose(
        applyMiddleware(persistStore(['filters', 'library'])),
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : x => x
    )
);
export default store;
