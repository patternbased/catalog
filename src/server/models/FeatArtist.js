const mongoose = require('mongoose');
const { Schema } = mongoose;

const FeatArtist = new Schema({
    name: String,
    url: String,
    slug: String,
    dateAdded: { type: Date, default: Date.now },
    dateEdited: { type: Date, default: Date.now },
});

FeatArtist.options.toJSON = FeatArtist.options.toJSON || {};
FeatArtist.options.toJSON.transform = (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.dateAdded;
    delete ret.dateEdited;
};

module.exports = mongoose.model('FeatArtist', FeatArtist);
