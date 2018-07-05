const express = require('express');
const auth = require('../middleware/authentication');
const authManager = require('../middleware/authenticationManager');
const database = require('../database');

const router = express.Router();

router.get('/:ID', auth, async (req, res) => {

    function getHallInstance(hallInstance) {
        
        return new Promise((resolve, reject) => {

            // Query the all hall instances for a hall instance with the correct ID
            database.query(`SELECT * FROM hallInstance WHERE ID = ${hallInstance.ID}`, (error, result) => {
                if (error) console.log(error);

                // Check if there is a hall instance found
                if (!result[0]) return res.status(412).send(`Request terminated: no hallInstance found with ID: ${hallInstance.ID}`);

                // Get the hall instance
                hallInstance = {
                ID: result[0].ID,
                hallID: result[0].hallID,
                seatRowInstances: []
                }

                resolve(hallInstance);

            });

        });

    }

    function getSeatRowInstances(hallInstance) {
        
        return new Promise((resolve, reject) => {

            // Query all seat row instances within a certain hall instance
            database.query(`SELECT * FROM seatRowInstance WHERE hallInstanceID = ${hallInstance.ID}`, (error, result) => {
                if (error) console.log(error);

                // List with seat row instances
                let seatRowInstances = [];

                // For all seat row instances
                let i = 0;
                while (i < result.length) {

                    // Get that seat row instance
                    let seatRowInstance = {
                        ID: result[i].ID,
                        hallInstanceID: result[i].hallInstanceID,
                        seatRowID: result[i].seatRowID,
                        seatInstances: []
                    }

                    // Add that seat row instance to the list
                    seatRowInstances.push(seatRowInstance);
                    i++;

                }

                // Return the list with seat row instances
                resolve(seatRowInstances);

            });

        });

    }

    function getSeatInstances(seatRowInstance) { 
        
        return new Promise((resolve, reject) => {

            // Query all seat instances within this seat row instance
            database.query(`SELECT * FROM seatInstance WHERE seatRowInstanceID = ${seatRowInstance.ID}`, (error, result) => {
                if (error) console.log(error);

                // The list with seat instances
                let seatInstances = [];

                // For all found seats instances
                let i = 0;
                while (i < result.length) {

                    // Get that seat
                    let seatInstance = {
                    ID: result[j].ID,
                    seatRowInstanceID: result[j].seatRowInstanceID,
                    seatID: result[j].seatID,
                    status: result[j].status
                    }

                    // Add that seat instance to the list
                    seats.push(seatInstance);
                    i++;

                }

                // Return the seat instances
                resolve(seatInstances);

            });

        });

    }

    // Create the hall instance
    let hallInstance = {
        ID: req.params.ID,
        hallID: 0,
        seatRowInstances: []
    }

    // Get hall instance
    hallInstance = await getHallInstance(hallInstance);

    // Get the seat row instances
    hallInstance.seatRowInstances = await getSeatRowInstances(hallInstance);

    // Get the seat instances for every seat row instance of the hall instance
    let counter = 0;
    while (counter < hallInstance.seatRowInstances.length) {

        // Get the seat instances and assign them to this seat row instance
        hallInstance.seatRowInstances[counter].seatInstances = await getSeatInstances(hallInstance.seatRowInstances[counter]);

        counter++;

    }

    // Return response containing the hall
    return res.status(200).send(hallInstance);

});

router.post('/', authManager, async (req, res) => {

    function insertHallInstance(hallInstance) {

        return new Promise((resolve, reject) => {

            database.query(`INSERT INTO hallInstance (hallID) VALUES ('${hallInstance.hallID}')`, (error, result) => {
                if (error) console.log(error);
        
                resolve(result.insertId);

            });

        });

    }

    function insertSeatRowInstance(seatRowInstance, hallInstanceID) {

        return new Promise((resolve, reject) => {

            database.query(`INSERT INTO seatRowInstance (hallInstanceID, seatRowID) VALUES (${hallInstanceID}, '${seatRowInstance.seatRowID}')`, (error, result) => {
                if (error) console.log(error);
                
                resolve(result.insertId);

            });

        });

    }

    function insertSeatInstances(seatRowInstance, seatRowInstanceID) {

        return new Promise((resolve, reject) => {

            console.log("Adding seat instances of seat row: \n", seatRowInstance);

            // Add all seat instances to the database
            let i = 0;
            while (i < seatRowInstance.seatInstances.length) {

                // Add a seat instance to the database
                database.query(`INSERT INTO seatInstance (seatRowInstanceID, seatID, status) VALUES (${seatRowInstanceID}, '${seatRowInstance.seatInstances[i].seatID}', '${seatRowInstance.seatInstances[i].status}')`, (error, result) => {
                    if (error) console.log(error);

                });

                i++;

            }

            // Return
            resolve();

        });

    }

    // Get the client hall instance
    let hallInstance = req.body;

    // Add the hall instance to the hall instance table and get the generated ID
    hallInstance.ID = await insertHallInstance(hallInstance);

    // For all seat row instances
    let counter = 0;
    while (counter < hallInstance.seatRowInstances.length) {

        // Add the seat row instance to the seat row instance table and get the generated ID
        seatRowInstanceID = await insertSeatRowInstance(hallInstance.seatRowInstances[counter], hallInstance.ID);

        // Add all of the seat instances to the seat instance table
        await insertSeatInstances(hallInstance.seatRowInstances[counter], seatRowInstanceID);

        // Proceed to the next seat row instance
        counter++;

    }

    // Return response to client
    return res.status(200).send('HallInstance added');

});

module.exports = router;