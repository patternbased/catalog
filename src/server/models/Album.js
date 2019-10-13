const mongoose = require('mongoose');
const { Schema } = mongoose;

const Album = new Schema({
    pbId: String,
    title: String,
    artistId: String,
    songsIds: Array,
    dateAdded: { type: Date, default: Date.now },
    dateEdited: { type: Date, default: Date.now },
});

Album.options.toJSON = Album.options.toJSON || {};
Album.options.toJSON.transform = (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.dateAdded;
    delete ret.dateEdited;
};

module.exports = mongoose.model('Album', Album);
