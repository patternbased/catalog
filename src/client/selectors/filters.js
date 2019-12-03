export default {
    get: label => state => state.filters.applied[label] || '',

    getDefault: state => state.filters.default,
    getApplied: state => state.filters.applied,
};
