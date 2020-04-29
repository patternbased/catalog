const Song = require('../models/Song');

class SongController {
    /**
     * Returns all songs
     * @returns {Array}
     */
    getAll() {
        return Song.find({}).sort({
            created: -1,
        });
    }

    /**
     * Returns songs from an album
     * @param {String} id id of the album
     * @returns {Array}
     */
    getAlbumSongs(id) {
        return Song.find({ albumId: id });
    }

    /**
     * Async insert data into db
     * @param {Object} data object with data
     * @returns {Data}
     */
    async create(data) {
        return await Song.create(data);
    }
}

module.exports = new SongController();
