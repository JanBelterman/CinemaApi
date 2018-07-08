const express = require('express');
const user = require('./routes/user');
const manager = require('./routes/manager');
const genre = require('./routes/genre');
const movie = require('./routes/movie');
const hall = require('./routes/hall');
const hallInstance = require('./routes/hallInstance');
const seatInstance = require('./routes/seatInstance');
const showing = require('./routes/showing');

const app = express();

app.use(express.json());
app.use('/api/user', user);
app.use('/api/manager', manager);
app.use('/api/genre', genre);
app.use('/api/movie', movie);
app.use('/api/hall', hall);
app.use('/api/hallInstance', hallInstance);
app.use('/api/seatInstance', seatInstance);
app.use('/api/showing', showing);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}..`)
});

module.exports = app;