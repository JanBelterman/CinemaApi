const express = require('express');
const users = require('../routes/user');
const manager = require('../routes/manager');
const genres = require('../routes/genre');
const movies = require('../routes/movie');
const halls = require('../routes/hall');
const hallInstances = require('../routes/hallInstance');
const seatInstances = require('../routes/seatInstance');
const showings = require('../routes/showing');
const tickets = require('../routes/ticket');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/managers', manager);
    app.use('/api/genres', genres);
    app.use('/api/movies',  movies);
    app.use('/api/halls', halls);
    app.use('/api/hallInstances', hallInstances);
    app.use('/api/seatInstances', seatInstances);
    app.use('/api/showings', showings);
    app.use('/api/tickets', tickets);
}