const Promo = require('../models/Promo');

class PromoController {
    /**
     * Returns promo code data
     * @param {String} name name of the promo code to get
     * @returns {Array}
     */
    getPromoByName(name) {
        return Promo.findOne({ name });
    }

    /**
     * Async insert data into db
     * @param {Object} data object with data
     * @returns {Data}
     */
    async createPromo(data) {
        return await Promo.create(data);
    }
}

module.exports = new PromoController();
