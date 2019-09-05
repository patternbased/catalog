export const ACTIONS = {
    SET_FILTER: 'filters.setFilter',
    RESET_FILTER: 'filters.resetFilter',
    RESET_ALL_FILTERS: 'filters.resetAllFilters',
};

/**
 * Sets values for a filter
 * @param {String} label the label of the filter
 * @param {String} value the value to set
 * @returns {Object}
 */
export const setFilter = (label, value) => ({
    type: ACTIONS.SET_FILTER,
    label,
    value,
});

/**
 * Resets values for a filter
 * @param {String} label the label of the filter

 * @returns {Object}
 */
export const resetFilter = label => ({
    type: ACTIONS.RESET_FILTER,
    label,
});

/**
 * Resets values for ALL filters
 * @returns {Object}
 */
export const resetAllFilters = () => ({
    type: ACTIONS.RESET_ALL_FILTERS,
});
