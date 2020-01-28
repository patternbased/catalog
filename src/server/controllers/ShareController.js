const Share = require('../models/Share');

class ShareController {
    /**
     * Async insert data into db
     * @param {Object} data object with data
     * @returns {Data}
     */
    async create(data) {
        return await Share.create(data);
    }

    /**
     * Returns share list
     * @param {String} id id of list to get
     * @returns {Array}
     */
    getShare(id) {
        return Share.find({ shareId: id });
    }
}

module.exports = new ShareController();
