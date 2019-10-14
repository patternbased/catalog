const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const SongController = require('../controllers/SongController');
const memoizeFunction = require('../utils/memoize-function');

const oneDay = 24 * 60 * 60 * 1000;
const cachedSongList = memoizeFunction(() => SongController.getAll(), oneDay);

router.get('/get-all-songs', async (req, res) => {
    const songs = await cachedSongList();

    res.send({
        songs,
    });
});

module.exports = router;
