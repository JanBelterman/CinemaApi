const express = require('express');
const auth = require('../middleware/authentication');
const database = require('../database');
const { validate } = require('../models/ticket');

const router = express.Router();

router.post('/', auth, (req, res) => {

    // Validate ticket
    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    req.body.userID = req.user.ID;

    console.log(req.body);

    // Add ticket
    database.query('INSERT INTO ticket SET ?', req.body, (error, result) => {
        if (error) console.log(error);

        const ticket = {
            ID: result.insertId,
            showingID: req.body.showingID,
            seatInstanceID: req.body.seatInstanceID
        };

        database.query(`UPDATE seatInstance SET status = 2 WHERE ID = ${req.body.seatInstanceID}`, (error, result) => {
            if (error) console.log(error);
            return res.status(200).send(ticket);
        });
    });

});

router.get('/', auth, async (req, res) => {

    // Get tickets
    let tickets = await getTickets(req.user.ID);

    console.log('Tickets gotten: \n', JSON.stringify(tickets[0], null, 4));

    // Get showings
    let i;
    for (i = 0; i < tickets.length; i++) {
        let showing = await getShowing(tickets[i].showing.ID);
        tickets[i].showing.hallInstance.ID = showing.hallInstanceID;
        tickets[i].showing.movie.ID = showing.movieID;
        tickets[i].showing.date = showing.date;
    }

    console.log('Showings gotten: \n', JSON.stringify(tickets[0], null, 4));

    // Get hall instances
    for (i = 0; i < tickets.length; i++) {
        let hallInstance = await getHallInstance(tickets[i].showing.hallInstance.ID);
        tickets[i].showing.hallInstance.hall.ID = hallInstance.hallID;
    }

    console.log('Hall instances gotten: \n', JSON.stringify(tickets[0], null, 4));

    // Get the halls
    for (i = 0; i < tickets.length; i++) {
        let hall = await getHall(tickets[i].showing.hallInstance.hall.ID);
        tickets[i].showing.hallInstance.hall.hallNr = hall.hallNr;
    }

    console.log('Halls gotten: \n', JSON.stringify(tickets[0], null, 4));

    // Get the movies
    for (i = 0; i < tickets.length; i++) {
        let movie = await getMovie(tickets[i].showing.movie.ID);
        tickets[i].showing.movie.title = movie.title;
    }

    console.log('Movies gotten: \n', JSON.stringify(tickets[0], null, 4));

    // Get the seat instances
    for (i = 0; i < tickets.length; i++) {
        let seatInstance = await getSeatInstance(tickets[i].seatInstance.ID);
        tickets[i].seatInstance.seat.ID = seatInstance.seatID;
    }

    console.log('Seat instances gotten: \n', JSON.stringify(tickets[0], null, 4));

    // Get the seats
    for (i = 0; i < tickets.length; i++) {
        let seat = await getSeat(tickets[i].seatInstance.seat.ID);
        tickets[i].seatInstance.seat.seatNr = seat.seatNr;
        tickets[i].seatInstance.seat.seatRow.ID = seat.seatRowID;
    }

    console.log('Seats gotten: \n', JSON.stringify(tickets[0], null, 4));

    // Get the seat rows
    for (i = 0; i < tickets.length; i++) {
        let seatRow = await getSeatRow(tickets[i].seatInstance.seat.seatRow.ID);
        tickets[i].seatInstance.seat.seatRow.rowNr = seatRow.rowNr;
    }

    console.log('Seat rows gotten: \n', JSON.stringify(tickets[0], null, 4));

    // Sending responses
    res.status(200).send(tickets);

    function getTickets(userID) {

        return new Promise((resolve, reject) => {

            database.query(`SELECT * FROM ticket WHERE userID = ${userID}`, (error, result) => {
                if (error) console.log(error);

                let tickets = [];

                let i;
                for (i = 0; i < result.length; i++) {
                    let ticket = {
                        ID: result[i].ID,
                        showing: {
                            ID: result[i].showingID,
                            hallInstance: {
                                ID: 9999,
                                hall: {
                                    ID: 9999,
                                    hallNr: 9999
                                }
                            },
                            movie: {
                                ID: 9999,
                                title: "Default title"
                            },
                            date: "9999-99-99-99-99"
                        },
                        userID: result[i].showingID,
                        seatInstance: {
                            ID: result[i].seatInstanceID,
                            seat: {
                                ID: 9999,
                                seatNr: 9999,
                                seatRow: {
                                    ID: 9999,
                                    rowNr: 9999
                                }
                            }
                        }
                    }
                    tickets.push(ticket);
                }

                resolve(tickets);

            });

        });

    }

    function getShowing(showingID) {

        return new Promise((resolve, reject) => {

            database.query(`SELECT * FROM showing WHERE ID = ${showingID}`, (error, result) => {
                if (error) console.log(error);

                resolve(result[0]);

            });

        });

    }

    function getHallInstance(hallInstanceID) {

        return new Promise((resolve, reject) => {

            database.query(`SELECT * FROM hallInstance WHERE ID = ${hallInstanceID}`, (error, result) => {
                if (error) console.log(error);

                resolve(result[0]);

            });

        });

    }

    function getHall(hallID) {

        return new Promise((resolve, reject) => {

            database.query(`SELECT * FROM hall WHERE ID = ${hallID}`, (error, result) => {
                if (error) console.log(error);

                resolve(result[0]);

            });

        });

    }

    function getMovie(movieID) {

        return new Promise((resolve, reject) => {

            database.query(`SELECT * FROM movie WHERE ID = ${movieID}`, (error, result) => {
                if (error) console.log(error);

                resolve(result[0]);

            });

        });

    }

    function getSeatInstance(seatInstanceID) {

        return new Promise((resolve, reject) => {

            database.query(`SELECT * FROM seatInstance WHERE ID = ${seatInstanceID}`, (error, result) => {
                if (error) console.log(error);

                resolve(result[0]);

            });

        });

    }

    function getSeat(seatID) {

        return new Promise((resolve, reject) => {

            database.query(`SELECT * FROM seat WHERE ID = ${seatID}`, (error, result) => {
                if (error) console.log(error);

                resolve(result[0]);

            });

        });

    }

    function getSeatRow(seatRowID) {

        return new Promise((resolve, reject) => {

            database.query(`SELECT * FROM seatRow WHERE ID = ${seatRowID}`, (error, result) => {
                if (error) console.log(error);

                resolve(result[0]);

            });

        });

    }

});

module.exports = router;