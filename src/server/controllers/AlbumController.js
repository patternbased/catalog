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
     * Returns album data
     * @param {String} name name of the album to get
     * @returns {Object}
     */
    getAlbumByName(name) {
        return Album.findOne({ slug: name });
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
