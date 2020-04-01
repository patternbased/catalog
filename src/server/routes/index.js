const express = require('express');
const path = require('path');

const router = express.Router();

router.use(express.static(path.join(__dirname, '../../../public'), { maxAge: 30 * 60 * 60 * 24 * 1000 }));

router.use(express.static(path.join(__dirname, '../../../dist'), { maxAge: 30 * 60 * 60 * 24 * 1000 }));

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../dist/index.html'));
});

module.exports = router;
