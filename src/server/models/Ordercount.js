const mongoose = require('mongoose');
const { Schema } = mongoose;

const Ordercount = new Schema({
    count: { type: Number, default: 10000 },
    name: String,
    dateAdded: { type: Date, default: Date.now },
    dateEdited: { type: Date, default: Date.now },
});

Ordercount.options.toJSON = Ordercount.options.toJSON || {};
Ordercount.options.toJSON.transform = (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.dateEdited;
};

module.exports = mongoose.model('Ordercount', Ordercount);
