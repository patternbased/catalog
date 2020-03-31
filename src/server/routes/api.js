const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const SongController = require('../controllers/SongController');
const PresetController = require('../controllers/PresetController');
const ShareController = require('../controllers/ShareController');
const ArtistController = require('../controllers/ArtistController');
const PaymentController = require('../controllers/PaymentController');
const memoizeFunction = require('../utils/memoize-function');

const oneWeek = 7 * 24 * 60 * 60 * 1000;
const cachedSongList = memoizeFunction(() => SongController.getAll(), oneWeek);

router.get('/all-songs', async (req, res) => {
    const songs = await cachedSongList();

    res.send({
        songs,
    });
});

router.get('/popular-presets', async (req, res) => {
    const presets = await PresetController.getPopular();

    res.send({
        presets,
    });
});

router.post('/increment-preset', async (req, res) => {
    const presets = await PresetController.incrementClick(req.body.preset);

    res.send({
        presets,
    });
});

router.post('/email/send', async (req, res) => {
    const sent = await ShareController.sendEmail(req.body.emailData);

    res.send({
        sent,
    });
});

router.post('/email/order/send', async (req, res) => {
    const sent = await ShareController.sendOrderEmail(req.body.emailData);

    res.send({
        sent,
    });
});

router.post('/payment/create', async (req, res) => {
    const sent = await PaymentController.createPayment(
        req.body.nonce,
        req.body.token,
        req.body.amount,
        req.body.items,
        req.body.address
    );

    res.send({
        data: sent,
    });
});

router.post('/create-share', async (req, res) => {
    const share = await ShareController.create(req.body.data);

    res.send({
        share,
    });
});

router.get('/shared-list/:id', async (req, res) => {
    const shared = await ShareController.getShare(req.params.id);

    res.send({
        shared,
    });
});

router.get('/artist/:name', async (req, res) => {
    const artist = await ArtistController.getArtistByName(req.params.name);

    res.send({
        artist,
    });
});

router.get('/invoice/:id', async (req, res) => {
    const invoice = await PaymentController.getOrderById(req.params.id);

    res.send({
        invoice,
    });
});

module.exports = router;
