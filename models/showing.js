const joi = require('joi');

function validate(showing) {

    const schema = {
        hallInstanceID: joi.number().integer().required(),
        movieID: joi.number().integer().required(),
        date: joi.string().required()
    };

    return joi.validate(showing, schema);

}

module.exports.validate = validate;