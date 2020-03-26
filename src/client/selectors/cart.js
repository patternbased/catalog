export default {
    getCartItems: state => state.cart.items,
    getCartItemsNo: state => state.cart.items.length,
    getCartSubtotal: state => state.cart.subtotal,
    getCartTotal: state => state.cart.total,
};
