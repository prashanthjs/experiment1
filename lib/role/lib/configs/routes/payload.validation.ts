import Joi = require('joi');
import _ = require('lodash');
const commonValidation = require('../../../../common/validation/common.validation');

const createPayload = {
    _id: Joi.string().alphanum().required().min(2),
    privileges: Joi.array().items(Joi.string()),
    isLocked: Joi.boolean()
};


const updatePayload = {
    _id: Joi.string().alphanum().required().min(2),
    privileges: Joi.array().items(Joi.string()),
    isLocked: Joi.boolean()
};

_.merge(updatePayload, commonValidation);
_.merge(createPayload, commonValidation);
module.exports = {
    createPayload: createPayload,
    updatePayload: updatePayload
};
