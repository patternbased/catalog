const mongoose = require('mongoose');
const { Schema } = mongoose;

const Song = new Schema({
    pbId: { type: String, unique: true },
    title: String,
    sequence: Number,
    rate: Number,
    length: String,
    musicKey: String,
    bpm: String,
    rhythm: Number,
    speed: Number,
    mood: Number,
    experimental: Number,
    grid: Number,
    stems: String,
    description: String,
    genre: String,
    subgenreA: String,
    subgenreB: String,
    primaryMood: String,
    secondaryMoods: Array,
    instruments: Array,
    tags: Array,
    arc: String,
    similarTracks: Array,
    similarArtists: Array,
    licenseType: String,
    artistName: String,
    writers: Array,
    label: String,
    albumId: String,
    albumTitle: String,
    licensedTo: String,
    dateAdded: { type: Date, default: Date.now },
    dateEdited: { type: Date, default: Date.now },
    dateStarted: Date,
    dateFinished: Date,
    dateReleased: Date,
    tools: Array,
    story: String,
    isrcCode: String,
    url: String,
    image: String,
    cover: String,
});

Song.options.toJSON = Song.options.toJSON || {};
Song.options.toJSON.transform = (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.dateAdded;
    delete ret.dateEdited;
};

module.exports = mongoose.model('Song', Song);
