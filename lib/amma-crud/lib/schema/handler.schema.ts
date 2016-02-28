import Joi = require('joi');

const CoreHandlerOption = Joi.object({
    collectionName: Joi.string().required(),
    schema: Joi.object().required()
});
const CoreGetAllOption = Joi.object({
    collectionName: Joi.string().required(),
    schema: Joi.object().required(),
    projections: Joi.alternatives().try(Joi.string(), Joi.object())
});
const CoreGetOption = Joi.object({
    collectionName: Joi.string().required(),
    schema: Joi.object().required(),
    idPath: Joi.string().required(),
    notFoundMessage: Joi.string(),
    projections: Joi.alternatives().try(Joi.string(), Joi.object())
});
const CoreCreateOption = Joi.object({
    collectionName: Joi.string().required(),
    schema: Joi.object().required(),
    idExistsMessage: Joi.string(),
    projections: Joi.alternatives().try(Joi.string(), Joi.object())
});

const CoreUpdateOption = Joi.object({
    collectionName: Joi.string().required(),
    schema: Joi.object().required(),
    idPath: Joi.string().required(),
    notFoundMessage: Joi.string(),
    projections: Joi.alternatives().try(Joi.string(), Joi.object())
});

const CoreRemoveOption = Joi.object({
    collectionName: Joi.string().required(),
    schema: Joi.object().required(),
    idPath: Joi.string().required()
});

export default {
    CoreHandlerOption: CoreHandlerOption,
    CoreGetAllOption: CoreGetAllOption,
    CoreGetOption: CoreGetOption,
    CoreCreateOption: CoreCreateOption,
    CoreUpdateOption: CoreUpdateOption,
    CoreRemoveOption: CoreRemoveOption
};