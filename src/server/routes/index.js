const express = require('express');
const path = require('path');

const router = express.Router();

router.use(express.static(path.join(__dirname, '../../../public'), { maxAge: 30 * 60 * 60 * 24 * 1000 }));

router.use(express.static(path.join(__dirname, '../../../dist'), { maxAge: 30 * 60 * 60 * 24 * 1000 }));

router.get('*', (req, res) => {
    // Force redirect to HTTPS
    if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        res.sendFile(path.join(__dirname, '../../../dist/index.html'));
    }
});

module.exports = router;
