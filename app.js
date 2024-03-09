var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');
var cache = require('memory-cache');

const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url;
        let cachedBody = cache.get(key);
        if (cachedBody) {
            res.send(cachedBody);
            return;
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                cache.put(key, body, duration * 1000);
                res.sendResponse(body);
            };
            next();
        }
    };
};

var indexRouter = require('./routes/index');
var searchRouter = require('./routes/search');
var citeRouter = require('./routes/cite');
var profileRouter = require('./routes/profile');
var scholarRouter = require('./routes/scholar');

var app = express();
var limiter = rateLimit({
    windowMs: 1 * 60 * 100,
    max: 10,
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(cacheMiddleware(1000));

app.use('/', indexRouter);
app.use('/', searchRouter);
app.use('/', citeRouter);
app.use('/', profileRouter);
app.use('/', scholarRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
});

module.exports = app;
