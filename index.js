const express = require('express');
const user = require('./routes/user');
const manager = require('./routes/manager');
const genre = require('./routes/genre');

const app = express();

app.use(express.json());
app.use('/api/user', user);
app.use('/api/manager', manager);
app.use('/api/genre', genre);

const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}..`)
});

module.exports = app;