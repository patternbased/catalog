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
     * Returns songs by PB id
     * @param {String} id id of the song
     * @returns {Array}
     */
    getSongByPBId(id) {
        return Song.find({ pbId: id });
    }

    /**
     * Returns songs by name
     * @param {String} name name of the song
     * @returns {Array}
     */
    getSongByName(name) {
        return Song.find({ title: { $regex: name, options: 'i' } });
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

    /**
     * Async update data into db
     * @param {Object} data object with data
     * @returns {Data}
     */
    async update(data) {
        return await Song.findOneAndUpdate({ pbId: data.pbId }, data);
    }
}

module.exports = new SongController();
