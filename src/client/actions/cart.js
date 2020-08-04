export const ACTIONS = {
    ADD_TO_CART: 'cart.addToCart',
    REMOVE_FROM_CART: 'cart.removeFromCart',
    CLEAR_CART: 'cart.clearCartData',
    SET_PROMO_CODE: 'cart.setPromoCode',
};

/**
 * Adds a license to cart
 * @param {String} licType the license type
 * @param {Number} price the price of the license
 * @param {Object} song the song for which the license is bought
 * @returns {Object}
 */
export const addToCart = (licType, price, song) => ({
    type: ACTIONS.ADD_TO_CART,
    licType,
    price,
    song,
});

/**
 * Removes a license from cart
 * @param {String} songId the id of the cart item
 * @returns {Object}
 */
export const removeFromCart = (songId) => ({
    type: ACTIONS.REMOVE_FROM_CART,
    songId,
});

/**
 * Clears the entire cart
 * @returns {Object}
 */
export const clearCartData = () => ({
    type: ACTIONS.CLEAR_CART,
});

/**
 * Adds a promo code
 * @param {Object} promo the code
 * @returns {Object}
 */
export const setPromoCode = (promo) => ({
    type: ACTIONS.SET_PROMO_CODE,
    promo,
});
