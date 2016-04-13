import Joi = require('joi');
import _ = require('lodash');
const addressValidation = require('../../../../common/validation/address.validation');
const commonValidation = require('../../../../common/validation/common.validation');

let createPayload = {
    _id: Joi.string().alphanum().required().min(2),
    title: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string(),
    parent: Joi.string(),
    website: Joi.string().uri(),
    address: Joi.object().keys(addressValidation),
    description: Joi.string(),
    isActive: Joi.boolean()
};

let updatePayload = {
    _id: Joi.string().alphanum().required().min(2),
    title: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string(),
    parent: Joi.string().allow('').optional(),
    website: Joi.string().uri(),
    address: Joi.object().keys(addressValidation),
    description: Joi.string(),
    isActive: Joi.boolean()
};
_.merge(updatePayload, commonValidation);
_.merge(createPayload, commonValidation);
module.exports = {
    createPayload: createPayload,
    updatePayload: updatePayload
};
