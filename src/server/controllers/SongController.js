const Song = require('../models/Song');

class SongController {
    /**
     * Returns all songs
     * @returns {Array}
     */
    getAll() {
        return Song.find({})
            .select(
                'pbId url title sequence rate length musicKey bpm rhythm speed mood experimental grid description instruments arc similarTracks artistName featArtist writers albumId albumTitle image cover convertedUrl'
            )
            .sort({
                created: -1,
            });
    }

    /**
     * Returns songs by PB id
     * @param {String} id id of the song
     * @returns {Object}
     */
    getSongByPBId(id) {
        return Song.findOne({ pbId: id });
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
