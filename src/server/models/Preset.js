const mongoose = require('mongoose');
const { Schema } = mongoose;

const Preset = new Schema({
    name: String,
    clicks: { type: Number, default: 0 },
    dateAdded: { type: Date, default: Date.now },
    dateEdited: { type: Date, default: Date.now },
});

Preset.options.toJSON = Preset.options.toJSON || {};
Preset.options.toJSON.transform = (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.dateAdded;
    delete ret.dateEdited;
};

module.exports = mongoose.model('Preset', Preset);
