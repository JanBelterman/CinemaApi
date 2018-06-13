const express = require('express');
const user = require('./routes/user');
const manager = require('./routes/manager');
const genre = require('./routes/genre');
const movie = require('./routes/movie');
const hall = require('./routes/hall');

const app = express();

app.use(express.json());
app.use('/api/user', user);
app.use('/api/manager', manager);
app.use('/api/genre', genre);
app.use('/api/movie', movie);
app.use('/api/hall', hall);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}..`)
});

module.exports = app;