const Preset = require('../models/Preset');

class PresetController {
    /**
     * Async insert data into db
     * @param {Object} data object with data
     * @returns {Data}
     */
    async create(data) {
        return await Preset.create(data);
    }

    /**
     * Returns popular presets
     * @returns {Array}
     */
    getPopular() {
        return Preset.find({})
            .sort({ clicks: -1 })
            .limit(8);
    }

    /**
     * Increments no. of clicks on a preset
     * @param {String} preset the name of the preset
     * @returns {Array}
     */
    incrementClick(preset) {
        return Preset.findOneAndUpdate({ name: preset }, { $inc: { clicks: 1 } });
    }
}

module.exports = new PresetController();
