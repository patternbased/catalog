export default {
    get: label => state => state.filters[label] || '',

    getAll: state => state.filters,
};
