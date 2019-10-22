/* eslint-disable quote-props */

const config = require('../../config');
const GoogleSpreadsheet = require('google-spreadsheet');

const spreadsheetConfig = config.googleSpreadsheets.songs;

/**
 * Setup the config for a google spreadsheet document
 * @param {GoogleSpreadsheet} doc google spreadsheet document
 * @param {Object} config a google spreadsheet config
 * @returns {Promise}
 */
const setupConfig = (doc, config) => new Promise(resolve => doc.useServiceAccountAuth(config, resolve));

/**
 * Get the sheets of a google spreadsheet document
 * @param {GoogleSpreadsheet} doc the google spreadsheet document
 * @returns {Promise}
 */
const getSheets = doc =>
    new Promise((resolve, reject) => {
        doc.getInfo((error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info.worksheets);
            }
        });
    });

/**
 * Get rows from a GoogleSpreadsheet document
 * @param {Object} sheet a sheet from a GoogleSpreadsheet
 * @param {Integer} offset the number of rows to skip
 * @param {Integer} limit how many rows to retrieve
 * @returns {Promise}
 */
const getRows = (sheet, offset, limit) =>
    new Promise((resolve, reject) => {
        sheet.getRows({ offset, limit }, (error, rows) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }
        });
    });

/**
 * Get all the data from the symbols spreadsheet
 * @returns {Promise}
 */
module.exports = async () => {
    const doc = new GoogleSpreadsheet(spreadsheetConfig.spreadsheetId);
    await setupConfig(doc, spreadsheetConfig.config);
    const sheets = await getSheets(doc);

    const rows = await getRows(sheets[0], 1, sheets[0].rowCount);

    var separators = [',', ';', ', ', '; '];

    return rows.map(row => ({
        pbId: row.id,
        title: row.title,
        sequence: row.seq,
        rate: row.rate,
        length: row.length,
        musicKey: row.musickey,
        bpm: row.bpm,
        rhythm: row.pbrhythm,
        speed: row.pbspeed,
        mood: row.pbmood,
        experimental: row.pbexperimental,
        grid: row.pborganic,
        stems: row.stemsapspn,
        description: row.description,
        genre: row.genre,
        subgenreA: row.subgenrea,
        subgenreB: row.subgenreb,
        primaryMood: row.primarymood,
        secondaryMoods: row.secondarymoods.split(new RegExp(separators.join('|'), 'g')),
        instruments: row.instruments.split(new RegExp(separators.join('|'), 'g')),
        tags: row.tags.split(new RegExp(separators.join('|'), 'g')),
        arc: row.shapearc,
        similarTracks: row.similarpbtracks.split(new RegExp(separators.join('|'), 'g')),
        similarArtists: row.similarartists.split(new RegExp(separators.join('|'), 'g')),
        licenseType: row.licensetype,
        artistName: row.artistname,
        writers: row.writers,
        label: row.label,
        albumId: row.catnum,
        licensedTo: row.licensedto,
        dateStarted: row.datestarted,
        dateFinished: row.datefinished,
        dateReleased: row.datereleased,
        tools: row.tools.split(new RegExp(separators.join('|'), 'g')),
        story: row.story,
        url: `/assets/songs/${row.catnum}/${row.id}.mp3`,
        cover: `/assets/songs/${row.catnum}/cover.jpg`,
    }));
};
