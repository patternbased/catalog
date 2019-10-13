const Album = require('../models/Album');

class AlbumController {
    /**
     * Returns all albums
     * @returns {Array}
     */
    getAll() {
        return Album.find({}).sort({
            created: -1,
        });
    }

    /**
     * Async insert data into db
     * @param {Object} data object with data
     * @returns {Data}
     */
    async create(data) {
        return await Album.create(data);
    }
}

module.exports = new AlbumController();
