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
    const songsSheet = sheets.find((s) => s.title === 'Songs');
    const albumsSheet = sheets.find((s) => s.title === 'Albums');
    const allArtistsSheet = sheets.find((s) => s.title === 'Artists');
    const featArtistsSheet = sheets.find((s) => s.title === 'FeatArtists');

    const rows = await getRows(songsSheet, 2, songsSheet.rowCount);
    const albums = await getRows(albumsSheet, 1, albumsSheet.rowCount);
    let visualArtists = await getRows(allArtistsSheet, 2, allArtistsSheet.rowCount);
    const featArtists = await getRows(featArtistsSheet, 1, featArtistsSheet.rowCount);
    visualArtists = visualArtists.filter((a) => a.type === 'V');

    var separators = [', ', '; ', ',', ';'];

    return rows.map((row) => {
        const songArt = albums.find((a) => a.albumid === row.catnum);
        const coverArt = [];
        if (songArt) {
            const albumArtArray = songArt.albumart.split(';');
            albumArtArray.map((art) => {
                const found = visualArtists.find((v) => v.artistname.toLowerCase().trim() === art.toLowerCase().trim());
                if (found) {
                    coverArt.push({
                        name: art,
                        url: found.url,
                    });
                }
            });
        }
        const featArts = [];
        if (row.featartist) {
            const allArtists = row.featartist.split(new RegExp(separators.join('|'), 'g'));
            for (var i = 0; i < allArtists.length; i++) {
                const found = featArtists.find(
                    (v) => v.artistname.toLowerCase().trim() === allArtists[i].toLowerCase().trim()
                );
                if (found) {
                    featArts.push({
                        name: found.artistname,
                        url: found.url,
                    });
                }
            }
        }
        return {
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
            stems: row.stems,
            description: row.description,
            genre: row.genre,
            subgenreA: row.subgenrea,
            subgenreB: row.subgenreb,
            primaryMood: row.primarymood,
            secondaryMoods: row.secondarymoods ? row.secondarymoods.split(new RegExp(separators.join('|'), 'g')) : [],
            instruments: row.instruments ? row.instruments.split(new RegExp(separators.join('|'), 'g')) : [],
            tags: row.tags ? row.tags.split(new RegExp(separators.join('|'), 'g')) : [],
            arc: row.shapearc,
            similarTracks: row.similarpbtracks ? row.similarpbtracks.split(new RegExp(separators.join('|'), 'g')) : [],
            similarArtists: row.similarartists ? row.similarartists.split(new RegExp(separators.join('|'), 'g')) : [],
            licenseType: row.licensetype,
            artistName: row.artistname,
            featArtist: featArts,
            writers: row.writers ? row.writers.split(new RegExp(separators.join('|'), 'g')) : [],
            label: row.label,
            albumId: row.catnum === 'PBL01' || row.catnum === '' ? 'PBC01' : row.catnum,
            albumTitle: row.albumtitle,
            licensedTo: row.licensedto,
            dateStarted: row.datestarted,
            dateFinished: row.datefinished,
            dateReleased: row.datereleased.split(';')[0],
            tools: row.tools ? row.tools.split(new RegExp(separators.join('|'), 'g')) : [],
            story: row.story,
            isrcCode: row.isrccode,
            url: `https://pblibrary.s3.us-east-2.amazonaws.com/${row.catnum}/${row.id}.mp3`,
            image: ['PB26', 'PB36', 'PB37'].includes(row.catnum)
                ? `https://pblibrary.s3.us-east-2.amazonaws.com/${row.catnum}/${row.id}.jpg`
                : `https://pblibrary.s3.us-east-2.amazonaws.com/${row.catnum}/cover.jpg`,
            cover: ['PB26', 'PB36', 'PB37'].includes(row.catnum)
                ? `https://pblibrary.s3.us-east-2.amazonaws.com/${row.catnum}/${row.id}_thumb.jpg`
                : `https://pblibrary.s3.us-east-2.amazonaws.com/${row.catnum}/cover-thumb.jpg`,
            coverArt: coverArt,
            bandcamp: row.bandcampurl,
            soundcloud: row.soundcloudurl,
            spotify: row.spotifyurl,
            appleMusic: row.applemusicurl,
            deezer: row.deezerurl,
            vimeo: row.vimeourl,
            tidal: row.tidalurl,
            youtube: row.youtubeurl,
        };
    });
};
