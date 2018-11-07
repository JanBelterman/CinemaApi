const express = require('express')
const auth = require('../middleware/auth')
const database = require('../startup/database')
const { validate } = require('../models/ticket')
const { ticketsRepo } = require('../repos/tickets')

const router = express.Router()

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Create ticket & reserve seat
    let ticket = {
        showingID: req.body.showingID,
        userID: req.user.ID,
        seatInstanceID: req.body.seatInstanceID
    }
    ticket.ID = await ticketsRepo.create(ticket)
    await ticketsRepo.reserveSeat(ticket.seatInstanceID)

    return res.status(200).send(ticket)
})

router.get('/', auth, async (req, res) => {

    // Get tickets
    let tickets = await getTickets(req.user.ID);
    // Get showings
    let i;
    for (i = 0; i < tickets.length; i++) {
        let showing = await getShowing(tickets[i].showing.ID);
        if (showing != null) {
            tickets[i].showing.hallInstance.ID = showing.hallInstanceID;
            tickets[i].showing.movie.ID = showing.movieID;
            tickets[i].showing.date = showing.date;
        }
        let hallInstance = await getHallInstance(tickets[i].showing.hallInstance.ID);
        if (hallInstance != null) {
            tickets[i].showing.hallInstance.hall.ID = hallInstance.hallID;
        }
        let hall = await getHall(tickets[i].showing.hallInstance.hall.ID);
        if (hall != null) {
            tickets[i].showing.hallInstance.hall.hallNr = hall.hallNr;
        }
        let movie = await getMovie(tickets[i].showing.movie.ID);
        if (movie != null) {
            tickets[i].showing.movie.title = movie.title;
        }
        let seatInstance = await getSeatInstance(tickets[i].seatInstance.ID);
        if (seatInstance != null) {
            tickets[i].seatInstance.seat.ID = seatInstance.seatID;
        }
        let seat = await getSeat(tickets[i].seatInstance.seat.ID);
        if (seat != null) {
            tickets[i].seatInstance.seat.seatNr = seat.seatNr;
            tickets[i].seatInstance.seat.seatRow.ID = seat.seatRowID;
        }
        let seatRow = await getSeatRow(tickets[i].seatInstance.seat.seatRow.ID);
        if (seatRow != null) {
            tickets[i].seatInstance.seat.seatRow.rowNr = seatRow.rowNr;
        }
    }
    // Sending responses
    res.status(200).send(tickets);
});

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
                };
                tickets.push(ticket);
            }
            resolve(tickets);
        });
    });
}

module.exports = router;