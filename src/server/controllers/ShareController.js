const Share = require('../models/Share');

class ShareController {
    /**
     * Async insert data into db
     * @param {Object} data object with data
     * @returns {Data}
     */
    async create(data) {
        return await Share.create(data);
    }

    /**
     * Returns share list
     * @param {String} id id of list to get
     * @returns {Array}
     */
    getShare(id) {
        return Share.find({ shareId: id });
    }

    /**
     * Sends out an email
     * @param {Object} emailData details to use in the email
     * @returns {Boolean}
     */
    sendEmail(emailData) {
        const mailOptions = {
            user: 'lauraapetroaei@gmail.com',
            pass: 'wolsykmdhujxnxvg',
            to: 'patternbased@gmail.com',
            from: `${emailData.email} <${emailData.email}>`,
            replyTo: emailData.email,
            subject: emailData.subject,
            text: emailData.text,
        };
        const send = require('gmail-send')(mailOptions);
        send(mailOptions)
            .then(({ result, full }) => console.log(result))
            .catch((error) => console.error('ERROR', error));
        return true;
    }

    /**
     * Sends Order Confirmation email
     * @param {Object} emailData details to use in the email
     * @returns {Boolean}
     */
    sendOrderEmail(emailData) {
        const mailOptions = {
            user: 'lauraapetroaei@gmail.com',
            pass: 'wolsykmdhujxnxvg',
            to: emailData.email,
            from: 'PatternBased <patternbased@gmail.com>',
            replyTo: 'patternbased@gmail.com',
            subject: emailData.subject,
            html: emailData.text,
        };
        const send = require('gmail-send')(mailOptions);
        send(mailOptions)
            .then(({ result, full }) => console.log(result))
            .catch((error) => console.error('ERROR', error));
        return true;
    }
}

module.exports = new ShareController();
