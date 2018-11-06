// Required modules
const express = require('express');
const jwt = require('jsonwebtoken');
const database = require('../startup/database');
const { validate } = require('../models/login');

// Get router from server
const router = express.Router();

// Endpoint for loggin in
router.post('/login', (req, res) => {

    // Validate client input
    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    // Get user from request
    let user = {
        username: req.body.username,
        password: req.body.password
    };

    // Get user from database
    database.query(`SELECT * FROM user WHERE username = '${user.username}'`, (error, result) => {
        if (error) console.log(error);

        // If no user is found, return response
        if (result.length == 0) return res.status(401).send('Access denied. Not a valid user');

        // Check if password is correct
        if (user.password !== result[0].password) return res.status(401).send('Access denied. Password is incorrect');

        // User format to return
        user = {
            username: req.body.username,
            password: req.body.password,
            token: jwt.sign({ ID: result[0].ID}, 'SeCrEtJsOnWeBtOkEn')
        };

        // Login successful, return user to client
        res.status(200).send(user);

    });

});

// Endpoint for registering a new user
router.post('/register', (req, res) => {

    // Validate raw input
    const { error } = validate(req.body);
    if (error) return res.status(412).send(error.details[0].message);

    // Get user from client
    let user = {
        username: req.body.username,
        password: req.body.password
    };

    // Get user from databse
    database.query(`SELECT * FROM user WHERE username = '${req.body.username}'`, (error, result) => {
        if (error) console.log(error);

        // If user aleady exists, return response
        if (result.length > 0) return res.status(405).send('Cannot register: User already exists');

        // Create user
        database.query('INSERT INTO user SET?', user, (error, result) => {

            // Query user to get the generated ID (needed for creating the token)
            database.query(`SELECT * FROM user WHERE ID = '${result.insertId}'`, (error, result) => {

                // Extend user with data
                user = {
                    username: user.username,
                    password: user.password,
                    token: jwt.sign({ ID: result[0].ID}, 'SeCrEtJsOnWeBtOkEn')
                }

                // Send succesfull register response
                res.status(200).send(user);

            });

        });

    });

});

// Export this module (router)
module.exports = router;