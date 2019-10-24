export default {
    get: label => state => state.general[label] || '',
};
