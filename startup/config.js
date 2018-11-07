const config = require('config');

module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
    if (!config.get('databaseHost')) {
        throw new Error('FATAL ERROR: database host is not defined.');
    }
    if (!config.get('databaseUser')) {
        throw new Error('FATAL ERROR: database user is not defined.');
    }
    if (!config.get('databasePassword')) {
        throw new Error('FATAL ERROR: database password is not defined.');
    }
    if (!config.get('databaseName')) {
        throw new Error('FATAL ERROR: database name is not defined.');
    }
};