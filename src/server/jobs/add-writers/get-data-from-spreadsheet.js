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
    const writersSheet = sheets.find((s) => s.title === 'Artists');

    const wRows = await getRows(writersSheet, 1, writersSheet.rowCount);

    var separators = [';', '; '];

    return wRows.map((row) => {
        if (row.relatedentities.length > 0) {
            if (row.type === 'A') {
                return {
                    name: row.artistname,
                    slug: row.artistname.toLowerCase().split(' ').join('-'),
                    bio: row.bio,
                    image: `https://pblibrary.s3.us-east-2.amazonaws.com/artists/${row.img}`,
                    imageAlt: row.imgattr,
                    website: row.url,
                    bandcamp: row.bandcampurl,
                    soundcloud: row.soundcloudurl,
                    instagram: row.instagramurl,
                    facebook: row.facebookurl,
                    spotify: row.spotifyurl,
                    show: row.show === 'Y' ? true : false,
                    featuredTracks: row.featuredsongs,
                    relatedArtists: row.relatedentities.split(new RegExp(separators.join('|'), 'g')).map((artist) => {
                        const artistImg = wRows.find(
                            (r) => r.artistname.trim().toLowerCase() === artist.trim().toLowerCase()
                        );
                        return {
                            name: artist.trim(),
                            image: artistImg
                                ? `https://pblibrary.s3.us-east-2.amazonaws.com/artists/${artistImg.img}`
                                : '',
                        };
                    }),
                };
            }
        }
    });
};
