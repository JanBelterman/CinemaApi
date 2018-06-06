const jwt = require('jsonwebtoken');

function auth(req, res, next) {

    const token = req.header('x-auth-token');

    if (!token) return res.status(401).send('Access denied: token not provided');

    try {

        const payload = jwt.verify(token, 'SeCrEtJsOnWeBtOkEn');

        req.userID = payload.userID;

        next();

    } catch (e) {

        res.status(401).send('Access denied: invalid token');

    }

}

module.exports = auth;