const Artist = require('../models/Artist');
const Writer = require('../models/Writer');

class ArtistController {
    /**
     * Returns all artists
     * @returns {Array}
     */
    getAll() {
        return Artist.find({}).sort({
            created: -1,
        });
    }

    /**
     * Returns artist data
     * @param {String} name name of the artist to get
     * @returns {Array}
     */
    getArtistByName(name) {
        return Artist.findOne({ slug: name });
    }

    /**
     * Returns writer data
     * @param {String} name name of the writer to get
     * @returns {Array}
     */
    getWriterByName(name) {
        return Writer.findOne({ slug: name });
    }

    /**
     * Async insert data into db
     * @param {Object} data object with data
     * @returns {Data}
     */
    async create(data) {
        return await Artist.create(data);
    }

    /**
     * Async insert data into db
     * @param {Object} data object with data
     * @returns {Data}
     */
    async createWriter(data) {
        return await Writer.create(data);
    }
}

module.exports = new ArtistController();
