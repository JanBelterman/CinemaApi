const joi = require('joi');

function validate(ticket) {

    const schema = {
        showingID: joi.number().integer().required(),
        seatInstanceID: joi.number().integer().required()
    };

    return joi.validate(ticket, schema);

}

module.exports.validate = validate;