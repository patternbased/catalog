const express = require('express');
const path = require('path');
const config = require('../config');
const auth = require('./auth');

const router = express.Router();

router.use('/auth', auth);
router.use(express.static(path.join(__dirname, '../../../public'), { maxAge: 30 * 60 * 60 * 24 * 1000 }));

// Redirect to login in case there's no one logged in
router.use('*', (req, res, next) => {
    if (config.auth && config.auth.length > 0 && !req.user) {
        if (!req.session.redirectTo) {
            req.session.redirectTo = req.originalUrl;
        }
        return res.redirect('/auth/login');
    }

    return next();
});

router.use(express.static(path.join(__dirname, '../../../dist'), { maxAge: 30 * 60 * 60 * 24 * 1000 }));

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../dist/index.html'));
});

module.exports = router;
