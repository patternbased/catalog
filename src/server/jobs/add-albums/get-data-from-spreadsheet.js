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
const setupConfig = (doc, config) => new Promise((resolve) => doc.useServiceAccountAuth(config, resolve));

/**
 * Get the sheets of a google spreadsheet document
 * @param {GoogleSpreadsheet} doc the google spreadsheet document
 * @returns {Promise}
 */
const getSheets = (doc) =>
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
    const albumsSheet = sheets.find((s) => s.title === 'Albums');
    const allArtistsSheet = sheets.find((s) => s.title === 'Artists');

    const rows = await getRows(albumsSheet, 1, albumsSheet.rowCount);
    let visualArtists = await getRows(allArtistsSheet, 2, allArtistsSheet.rowCount);
    visualArtists = visualArtists.filter((a) => a.type === 'V');

    return rows.map((row) => {
        const coverArt = [];
        const albumArtArray = row.albumart.split(';');
        albumArtArray.map((art) => {
            const found = visualArtists.find((v) => v.artistname.toLowerCase().trim() === art.toLowerCase().trim());
            if (found) {
                coverArt.push({
                    name: art,
                    url: found.url,
                });
            }
        });

        return {
            pbId: row.albumid,
            slug: row.title.toLowerCase().split(' ').join('-'),
            title: row.title,
            artistName: row.project,
            year: row.year,
            tracks: row.tracks,
            rate: row.rate,
            description: row.description,
            upcCode: row.upccode,
            coverArt: coverArt,
            cover: `https://pblibrary.s3.us-east-2.amazonaws.com/${row.albumid}/cover-thumb.jpg`,
        };
    });
};
