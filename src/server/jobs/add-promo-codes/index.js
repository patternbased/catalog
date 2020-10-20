/* eslint-disable no-console */

require('../../db-connection');
const mongoose = require('mongoose');

const getDataFromSpreadsheet = require('./get-data-from-spreadsheet');
const PromoController = require('../../controllers/PromoController');

(async () => {
    const spreadsheetData = await getDataFromSpreadsheet();

    console.log('Saving the data to the db...');
    for (let i = 0; i < spreadsheetData.length; i++) {
        await PromoController.createPromo(spreadsheetData[i]);
    }

    console.log('Data created!');

    mongoose.disconnect();
})();
