const mongoose = require('mongoose');
const { Schema } = mongoose;

const Writer = new Schema({
    pbId: String,
    name: String,
    slug: String,
    bio: String,
    image: String,
    imageAlt: String,
    website: String,
    bandcamp: String,
    soundcloud: String,
    instagram: String,
    facebook: String,
    spotify: String,
    albumsIds: Array,
    relatedArtists: Array,
    show: Boolean,
    featuredTracks: String,
    dateAdded: { type: Date, default: Date.now },
    dateEdited: { type: Date, default: Date.now },
});

Writer.options.toJSON = Writer.options.toJSON || {};
Writer.options.toJSON.transform = (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.dateAdded;
    delete ret.dateEdited;
};

module.exports = mongoose.model('Writer', Writer);
