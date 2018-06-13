const joi = require('joi');

function validate(movie) {

    const movie = {
        ID: joi.number().integer().required(),
        title: joi.string().required(),
        description: joi.string().required(),
        runtime: joi.number().integer().required(),
        genreID: joi.number().integer().required(),
        director: joi.string().required(),
        production: joi.string().required(),
        releaseDate: joi.string().required(),
        rating: joi.number().integer(),
        imageURL: joi.string().required()
    };

    return joi.validate(movie, schema);

}

module.exports.validate = validate;