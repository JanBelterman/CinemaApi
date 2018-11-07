const jwt = require('jsonwebtoken')
const config = require('config')

// Authenticates users
function auth(req, res, next) {

    // Get token from request header
    const token = req.header('x-auth-token')
    // Check if a token is provided
    if (!token) return res.status(401).send('Access denied: no token provided')

    try {
        req.user = jwt.verify(token, config.get('jwtPrivateKey'))
        next();
    } catch (e) {
        res.status(401).send('Access denied: invalid token')
    }

}

module.exports = auth;