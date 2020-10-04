const Artist = require('../models/Artist');
const Writer = require('../models/Writer');
const Song = require('../models/Song');

class ArtistController {
    /**
     * Returns all artists(projects)
     * @returns {Array}
     */
    getAll() {
        return Artist.find().sort({
            created: -1,
        });
    }

    /**
     * Returns all writers(artists)
     * @returns {Array}
     */
    getAllWriters() {
        return Writer.find().sort({
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
     * Return artist's featured tracks mentioned in DB
     * @param {String} tracks
     * @returns {Array}
     */
    async getArtistFeatured(tracks) {
        const allTracks = tracks.split(new RegExp([';', '; '].join('|'), 'g'));
        const songs = [];
        for (var i = 0; i < allTracks.length; i++) {
            const song = await Song.findOne({ pbId: allTracks[i].trim() });
            song && songs.push(song);
        }
        return songs;
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
