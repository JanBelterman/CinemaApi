const express = require('express');
const jwt = require('jsonwebtoken');
const database = require('../database');
const { validate } = require('../models/login');

const router = express.Router();

router.post('/login', (req, res) => {

    // Validate raw request data
    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    // Get manager
    let manager = {
        username: req.body.username,
        password: req.body.password    
    }

    // Query manager
    database.query(`SELECT * FROM manager WHERE username = '${manager.username}'`, (error, result) => {
        if (error) console.log(error);

        // Check if manager exists
        if (!result[0]) return res.status(401).send('Access denied. Not a valid manager');

        // Check if password is correct
        if (manager.password !== result[0].password) return res.status(401).send('Access denied. Password is incorrect');

        // Extend manager with token
        manager = {
            username: manager.username,
            password: manager.password,
            token: jwt.sign({ ID: result[0].ID}, 'SeCrEtJsOnWeBtOkEn')
        };

        // Send succesfull login response
        res.status(200).send(manager);

    });

});

router.post('/register', (req, res) => {

    // Validate raw input
    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    // Get manager
    let manager = {
        username: req.body.username,
        password: req.body.password
    };

    // Query database for manager
    database.query(`SELECT * FROM manager WHERE username = '${manager.username}'`, (error, result) => {
        if (error) console.log(error);

        // Check if manager exitsts
        if (result[0]) return res.status(405).send('Cannot register: Manager already exists');

        // Create manager
        database.query('INSERT INTO manager SET?', manager, (error, result) => {
            if (error) console.log(error);

            // Query database for generated ID (user for signing the token)
            database.query(`SELECT * FROM manager WHERE ID = '${result.insertId}'`, (error, result) => {
                if (error) console.log(error);

                // Extend manager with token
                manager = {
                    username: manager.username,
                    password: manager.password,
                    token: jwt.sign({ ID: result[0].ID}, 'SeCrEtJsOnWeBtOkEn')
                };

                // Send succesfull register response
                res.status(200).send(manager);

            });

        });

    });

});

module.exports = router;