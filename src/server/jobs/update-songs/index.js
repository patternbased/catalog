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
        spreadsheetData[i].then(async (data) => {
            if (data && data.sequence) {
                console.log('here 2');
                const existingSong = await Song.find({ pbId: data.pbId });
                if (existingSong.length) {
                    console.log('here 3');
                    await SongController.update(data);
                } else {
                    console.log('here 4');
                    await SongController.create(data);
                }
            } else {
                console.log('here 5');
            }
        });
    }

    console.log('Data created!');

    // mongoose.disconnect();
})();
