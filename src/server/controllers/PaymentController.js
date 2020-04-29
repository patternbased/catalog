const Payment = require('../models/Payment');
const Ordercount = require('../models/Ordercount');
const { v1 } = require('uuid');
const axios = require('axios');

class PaymentController {
    /**
     * Returns all payments
     * @returns {Array}
     */
    getAll() {
        return Payment.find({}).sort({
            created: -1,
        });
    }

    /**
     * Returns payment data
     * @param {String} id id of the payment to get
     * @returns {Array}
     */
    getPaymentById(id) {
        return Payment.findOne({ id: id });
    }

    /**
     * Async insert data into db
     * @param {Object} data object with data
     * @returns {Data}
     */
    async create(data) {
        return await Payment.create(data);
    }

    /**
     * Returns order data
     * @param {String} id id of the order to get
     * @returns {Array}
     */
    getOrderById(id) {
        return Payment.findOne({ orderId: id });
    }

    /**
     * Async create Square Payment
     * @param {String} nonce sq none
     * @param {String} token sq customer token
     * @param {Number} amount amount to charge
     * @param {Array} items purchased items
     * @param {Object} address user and address data
     * @returns {Data}
     */
    async createPayment(nonce, token, amount, items, address) {
        const payload = {
            source_id: nonce,
            verification_token: token,
            autocomplete: true,
            location_id: process.env.SQUARE_LOCATION_ID,
            amount_money: {
                amount: amount * 100,
                currency: 'USD',
            },
            idempotency_key: v1(),
        };

        await Ordercount.findByIdAndUpdate('5e820f73e7179a17e21e1d43', { $inc: { count: 1 } });
        const orderCounter = await Ordercount.findById('5e820f73e7179a17e21e1d43');
        return axios({
            method: 'post',
            url:
                process.env.NODE_ENV === 'production'
                    ? 'https://connect.squareup.com/v2/payments'
                    : 'https://connect.squareupsandbox.com/v2/payments',
            data: payload,
            headers: { Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}` },
        })
            .then(async function (response) {
                return await Payment.create({
                    amount: amount,
                    customer: address,
                    purchasedItems: items,
                    orderId: response.data.payment.order_id,
                    receipt: response.data.payment.receipt_number,
                    receiptUrl: response.data.payment.receipt_url,
                    orderNo: orderCounter.count,
                });
            })
            .catch(function (error) {
                return error;
            });
    }
}

module.exports = new PaymentController();
