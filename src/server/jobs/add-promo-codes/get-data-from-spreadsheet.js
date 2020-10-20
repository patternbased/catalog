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
    const promoSheet = sheets.find((s) => s.title === 'Promo');

    const rows = await getRows(promoSheet, 1, promoSheet.rowCount);

    return rows.map((row) => {
        return {
            name: row.code,
            type: row.discmethod.toLowerCase(),
            value: row.discvalue,
            expMethod: row.expmethod.toLowerCase(),
            usePerUser: row.expmethod.toLowerCase() === 'counter' ? row.expvalue : null,
            endsOn: row.expmethod.toLowerCase() === 'date' ? new Date(row.expvalue) : null,
        };
    });
};
