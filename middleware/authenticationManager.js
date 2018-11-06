const jwt = require('jsonwebtoken');
const database = require('../startup/database');

// Authentication function managers
// Ment to be used for endpoints which only managers can access
function auth(req, res, next) {

    // Get token from request header
    const token = req.header('x-auth-token');

    // Check if a token is provided
    if (!token) return res.status(401).send('Access denied: token not provided');

    try {

        // Get the payload with login information from token
        const payload = jwt.verify(token, 'SeCrEtJsOnWeBtOkEn');

        // Check database for either a manager corresponding to the provided login information
        database.query(`SELECT * FROM manager WHERE ID = ${payload.ID}`, (error, result) => {
            if (error) console.log(error);

            // If query found no manager
            if (result.length <= 0) return res.status(401).send('Access denied: incorrect credentials');

            //If query found a manager, then advance
            next();

        });

    } catch (e) {

        // Return response
        res.status(401).send('Access denied: invalid token');

    }

}

module.exports = auth;