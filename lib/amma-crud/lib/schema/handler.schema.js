"use strict";
var Joi = require('joi');
var CoreHandlerOption = Joi.object({
    collectionName: Joi.string().required(),
    schema: Joi.object().required()
});
var CoreGetAllOption = Joi.object({
    collectionName: Joi.string().required(),
    schema: Joi.object().required(),
    projections: Joi.alternatives().try(Joi.string(), Joi.object())
});
var CoreGetOption = Joi.object({
    collectionName: Joi.string().required(),
    schema: Joi.object().required(),
    idPath: Joi.string().required(),
    notFoundMessage: Joi.string(),
    projections: Joi.alternatives().try(Joi.string(), Joi.object())
});
var CoreCreateOption = Joi.object({
    collectionName: Joi.string().required(),
    schema: Joi.object().required(),
    idExistsMessage: Joi.string(),
    projections: Joi.alternatives().try(Joi.string(), Joi.object())
});
var CoreUpdateOption = Joi.object({
    collectionName: Joi.string().required(),
    schema: Joi.object().required(),
    idPath: Joi.string().required(),
    notFoundMessage: Joi.string(),
    projections: Joi.alternatives().try(Joi.string(), Joi.object())
});
var CoreRemoveOption = Joi.object({
    collectionName: Joi.string().required(),
    schema: Joi.object().required(),
    idPath: Joi.string().required()
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    CoreHandlerOption: CoreHandlerOption,
    CoreGetAllOption: CoreGetAllOption,
    CoreGetOption: CoreGetOption,
    CoreCreateOption: CoreCreateOption,
    CoreUpdateOption: CoreUpdateOption,
    CoreRemoveOption: CoreRemoveOption
};
