const http = require('http');
const createError = require('http-errors');
const express = require('express');
const { ExpressPeerServer } = require('peer');

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const indexRouter = require('./routes/index');
const roomsRouter = require('./routes/rooms');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet())

app.use('/', indexRouter);
app.use('/rooms', roomsRouter);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use('/peerjs', peerServer);

peerServer.on('connection', (client) => {
    console.log('A peer client connected');
});

peerServer.on('disconnect', (client) => {
    console.log('A peer client disconnected');
});

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
    res.render('error');
});

module.exports = {
    app,
    server
}
