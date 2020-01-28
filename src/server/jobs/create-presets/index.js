/* eslint-disable no-console */

require('../../db-connection');
const mongoose = require('mongoose');

const PresetController = require('../../controllers/PresetController');
const presetsData = [
    'Commerce and Happiness',
    'Horror Drones',
    'Highly Rhythmic',
    'Peaceful Ambient',
    'Highly Electronic',
    'Highly Organic',
    'Dark Technical Rhythms',
    'Pure Commerce',
    'Organic Melancholy',
    'Conspiracy Theories',
    'Mixed Feelings Ambient',
    'Experimental',
    'Uplifting',
    'Chill Beats',
    'Grimey Beats',
    'Dark Organic Ambient',
];

(async () => {
    console.log('Saving the data to the db...');

    for (let i = 0; i < presetsData.length; i++) {
        await PresetController.create({ name: presetsData[i] });
    }

    console.log('Data created!');

    mongoose.disconnect();
})();
