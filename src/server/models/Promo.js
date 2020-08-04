const mongoose = require('mongoose');
const { Schema } = mongoose;

const Promo = new Schema({
    name: String,
    type: String,
    value: Number,
    usePerUser: Number,
    startsOn: { type: Date, default: Date.now },
    endsOn: { type: Date, default: Date.now },
    dateAdded: { type: Date, default: Date.now },
    dateEdited: { type: Date, default: Date.now },
});

Promo.options.toJSON = Promo.options.toJSON || {};
Promo.options.toJSON.transform = (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.dateAdded;
    delete ret.dateEdited;
};

module.exports = mongoose.model('Promo', Promo);
