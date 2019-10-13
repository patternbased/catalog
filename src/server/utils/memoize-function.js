/**
 * A utility function to cache the results of another function for a certain amount of time
 * Basically it runs the function once in `cacheTime` milliseconds
 * @param {Function} func the function whose results to cache
 * @param {integer} cacheTime (milliseconds) how long to cache the results before running the function again
 * @returns {Object}
 */
const memoizeFunction = (func, cacheTime) => {
    let lastCall = null;
    let cache = null;

    return function cached() {
        if (arguments.length) {
            throw new Error('The cached function should be used only without any arguments');
        }

        if (!cache || Date.now() - lastCall > cacheTime) {
            lastCall = Date.now();
            cache = func();
        }

        return cache;
    };
};

module.exports = memoizeFunction;
