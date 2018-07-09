const express = require('express');
const userRoute = require('./routes/user');
const managerRoute = require('./routes/manager');
const genreRoute = require('./routes/genre');
const movieRoute = require('./routes/movie');
const hallRoute = require('./routes/hall');
const hallInstanceRoute = require('./routes/hallInstance');
const seatInstanceRoute = require('./routes/seatInstance');
const showingRoute = require('./routes/showing');
const ticketRoute = require('./routes/ticket');

const app = express();

app.use(express.json());
app.use('/api/user', userRoute);
app.use('/api/manager', managerRoute);
app.use('/api/genre', genreRoute);
app.use('/api/movie', movieRoute);
app.use('/api/hall', hallRoute);
app.use('/api/hallInstance', hallInstanceRoute);
app.use('/api/seatInstance', seatInstanceRoute);
app.use('/api/showing', showingRoute);
app.use('/api/ticket', ticketRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}..`)
});

module.exports = app;