const express = require('express');
const auth = require('../middleware/authentication');
const authManager = require('../middleware/authenticationManager');
const database = require('../database');

const router = express.Router();

router.get('/:ID', auth, async (req, res) => {

    function getHallInstance(hallInstance) {
        
        return new Promise((resolve, reject) => {

            // Query the all halls for a hall with the correct ID
            database.query(`SELECT * FROM hallInstance WHERE ID = ${hallInstance.ID}`, (error, result) => {
                if (error) console.log(error);

                // Check if there is a hall found
                if (!result[0]) return res.status(412).send(`Request terminated: no hallInstance found with ID: ${hallInstance.ID}`);

                // Get the hall
                hallInstance = {
                ID: result[0].ID,
                hallID: result[0].hallID,
                seatRowInstances: []
                }

                resolve(hallInstance);

            });

        });

    }

    function getSeatRows(hallInstance) {
        
        return new Promise((resolve, reject) => {

            // Query all seat rows within a certain hall
            database.query(`SELECT * FROM seatRowInstance WHERE hallInstanceID = ${hallInstance.ID}`, (error, result) => {
                if (error) console.log(error);

                let seatRowInstances = [];

                // For all seat rows
                let i = 0;
                while (i < result.length) {

                    // Get that seat row
                    let seatRowInstance = {
                        ID: result[i].ID,
                        hallInstanceID: result[i].hallInstanceID,
                        seatRowID: result[i].seatRowID,
                        seatInstances: []
                    }

                    // Add that seat row to the hall
                    seatRowInstances.push(seatRowInstance);
                    i++;

                }

                resolve(seatRowInstances);

            });

        });

    }

    function getSeats(seatRowInstance) { 
        
        return new Promise((resolve, reject) => {

            // Query all seats within that seat row
            database.query(`SELECT * FROM seatInstance WHERE seatRowInstanceID = ${seatRowInstance.ID}`, (error, result) => {
                if (error) console.log(error);

                let seatInstances = [];

                // For all seats
                let j = 0;
                while (j < result.length) {

                    // Get that seat
                    let seatInstance = {
                    ID: result[j].ID,
                    seatRowInstanceID: result[j].seatRowInstanceID,
                    seatID: result[j].seatID,
                    status: result[j].status
                    }

                    // Add that seat to the seats of the seat row
                    seats.push(seatInstance);
                    j++;

                }

                resolve(seatInstances);

            });

        });

    }

    let hallInstance = {
        ID: req.params.ID,
        hallID: 0,
        seatRowInstances: []
    }

    hallInstance = await getHall(hallInstance);

    let seatRowInstances = await getSeatRows(hallInstance);
    hallInstance.seatRowInstances = seatRowInstances

    let counter = 0;
    while (counter < hallInstance.seatRowInstances.length) {

        hallInstance.seatRowInstances[counter].seatInstances = await getSeats(hallInstance.seatRowInstances[counter]);

        counter++;

    }

    // Return response containing the hall
    return res.status(200).send(hallInstance);


});

module.exports = router;