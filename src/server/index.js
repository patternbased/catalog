/* eslint-disable no-console */
require('dotenv').config();
require('./db-connection');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const connectFlash = require('connect-flash');
const expressHandlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const args = require('yargs').argv;
const passport = require('passport');
const compression = require('compression');
const routes = require('./routes');
const config = require('./config');

const PORT = args.PORT || config.port;
const handlebarsEngine = expressHandlebars.create({ extname: '.hbs' });

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(connectFlash());
app.use(
    session({
        secret: 'Br84!3LEP5!%)^',
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Setup handlebars engine
app.engine('.hbs', handlebarsEngine.engine);
app.set('views', path.join(__dirname, './views'));
app.set('view engine', '.hbs');

app.use('/api', require('./routes/api'));
app.use('/', routes);

// Enable compression
app.use(compression());
app.get('*.js', function (req, res, next) {
    req.url = req.url.concat('.gz');
    res.set('Content-Encoding', 'gzip');
    next();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
