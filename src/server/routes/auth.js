const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const config = require('../config');

const router = express.Router();

router.get('/login', (req, res) => {
    if (!req.user) {
        res.render('login', {
            layout: false,
            info: req.flash('info'),
            error: req.flash('error'),
        });
    } else {
        res.redirect('/');
    }
});

router.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/auth/login',
        failureFlash: true,
    }),
    (req, res) => {
        const redirectTo = req.session.redirectTo;
        if (redirectTo) {
            delete req.session.redirectTo;
            return res.redirect(redirectTo);
        }
        res.redirect('/');
    }
);

router.get('/logout', (req, res) => {
    if (req.user) {
        req.flash('info', "You've been logged out successfully.");
    }

    req.logout();
    res.redirect('/auth/login');
});

// Setup passport strategy
passport.use(
    new LocalStrategy((username, password, done) => {
        const user = username.trim();
        const found = config.auth.find(x => x.user === user);
        if (!found || found.password !== password) {
            return done(null, false, 'Invalid credentials.');
        }

        return done(null, {
            user: found.user,
        });
    })
);

passport.serializeUser((user, done) => {
    done(null, user.user);
});

passport.deserializeUser((user, done) => {
    done(null, {
        user: config.auth.find(x => x.user === user),
    });
});

module.exports = router;
