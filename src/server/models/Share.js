const mongoose = require('mongoose');
const { Schema } = mongoose;

const Share = new Schema({
    shareId: String,
    name: String,
    type: String,
    songs: Array,
    filters: Object,
    dateAdded: { type: Date, default: Date.now },
    dateEdited: { type: Date, default: Date.now },
});

Share.options.toJSON = Share.options.toJSON || {};
Share.options.toJSON.transform = (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.dateAdded;
    delete ret.dateEdited;
};

module.exports = mongoose.model('Share', Share);
