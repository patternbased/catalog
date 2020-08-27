const mongoose = require('mongoose');
const { Schema } = mongoose;

const Payment = new Schema({
    amount: String,
    currency: { type: String, default: 'USD' },
    customer: Object,
    purchasedItems: Array,
    orderId: String,
    receipt: String,
    receiptUrl: String,
    orderNo: String,
    promoCode: Object,
    dateAdded: { type: Date, default: Date.now },
    dateEdited: { type: Date, default: Date.now },
});

Payment.options.toJSON = Payment.options.toJSON || {};
Payment.options.toJSON.transform = (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.dateEdited;
};

module.exports = mongoose.model('Payment', Payment);
