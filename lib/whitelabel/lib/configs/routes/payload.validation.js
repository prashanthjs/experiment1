var Joi = require('joi');
var _ = require('lodash');
var addressValidation = require('../../../../common/validation/address.validation');
var commonValidation = require('../../../../common/validation/common.validation');
var createPayload = {
    _id: Joi.string().alphanum().required().min(2),
    title: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string(),
    parent: Joi.string(),
    url: Joi.string().uri(),
    address: Joi.object().keys(addressValidation),
    description: Joi.string(),
    isActive: Joi.boolean()
};
var updatePayload = {
    _id: Joi.string().alphanum().required().min(2),
    title: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string(),
    parent: Joi.string().allow('').optional(),
    url: Joi.string().uri(),
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
