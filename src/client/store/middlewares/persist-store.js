import pick from 'lodash/pick';
import debounce from 'lodash/debounce';

const persistState = debounce((state, reducersToPersist) => {
    const stateToPersist = pick(state, reducersToPersist);

    localStorage.setItem('APP_STATE', JSON.stringify(stateToPersist));
}, 500);

export const getPersistedState = () => {
    if (localStorage.getItem('APP_STATE')) {
        return JSON.parse(localStorage.getItem('APP_STATE'));
    }

    return {};
};

export default reducersToPersist => store => next => action => {
    const result = next(action);

    persistState(store.getState(), reducersToPersist);

    return result;
};
