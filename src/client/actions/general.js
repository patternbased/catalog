export const ACTIONS = {
    SET_STATE: 'general.setState',
};

/**
 * Sets values for a certain state
 * @param {String} label the label of the state
 * @param {String} value the value to set
 * @returns {Object}
 */
export const setState = (label, value) => ({
    type: ACTIONS.SET_STATE,
    label,
    value,
});
