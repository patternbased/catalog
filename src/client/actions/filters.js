export const ACTIONS = {
    SET_FILTER: 'filters.setFilter',
    RESET_FILTER: 'filters.resetFilter',
};

/**
 * Sets data for the current user session
 * @param {String} label the label for the user data
 * @param {String} value the value to set
 * @returns {Object}
 */
export const setFilter = (label, value) => ({
    type: ACTIONS.SET_FILTER,
    label,
    value,
});

/**
 * Sets data for the current user session
 * @param {String} label the label for the user data
 * @param {String} value the value to set
 * @returns {Object}
 */
export const resetFilter = label => ({
    type: ACTIONS.RESET_FILTER,
    label,
});
