const jwt = require('jsonwebtoken');
const database = require('../database');

// Authentication function for both managers and user
// Meant to be used for endpoints which both users and manager can access
function auth(req, res, next) {

    // Get token from request header
    const token = req.header('x-auth-token');

    // Check if a token is provided
    if (!token) return res.status(401).send('Access denied: token not provided');

    try {

        // Get the payload with login information from token
        const payload = jwt.verify(token, 'SeCrEtJsOnWeBtOkEn');

        // Check database for either a manager or a user corresponding to the provided login information
        // Check for a user first
        database.query(`SELECT * FROM user WHERE ID = ${payload.ID}`, (error, result) => {
            if (error) console.log(error);

            // If the query found a user, then advance
            if (result.length >= 1) return next();

            // If the query found no user than look for a manager
            database.query(`SELECT * FROM manager WHERE ID = ${payload.ID}`, (error, result) => {
                if (error) console.log(error);

                // If query found no manager
                if (result.length <= 0) return res.status(401).send('Access denied: incorrect credentials');

                //If query found a manager, then advance
                next();

            });

        });

    } catch (e) {

        // Return response
        res.status(401).send('Access denied: invalid token');

    }

}

module.exports = auth;