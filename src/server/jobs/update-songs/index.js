/* eslint-disable no-console */

require('../../db-connection');
const mongoose = require('mongoose');

const getDataFromSpreadsheet = require('./get-data-from-spreadsheet');
const SongController = require('../../controllers/SongController');
const Song = require('../../models/Song');

(async () => {
    const spreadsheetData = await getDataFromSpreadsheet();

    console.log('Saving the data to the db...');
    for (let i = 0; i < spreadsheetData.length; i++) {
        if (spreadsheetData[i].sequence) {
            const existingSong = await Song.find({ pbId: spreadsheetData[i].pbId });
            if (existingSong.length) {
                await SongController.update(spreadsheetData[i]);
            } else {
                await SongController.create(spreadsheetData[i]);
            }
        }
    }

    console.log('Data created!');

    mongoose.disconnect();
})();
