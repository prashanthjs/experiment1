"use strict";
var Boom = require('boom');
var Joi = require('joi');
var StoreValidator = (function () {
    function StoreValidator() {
        var _this = this;
        this.storeValidator = function (id, next) {
            if (!id) {
                return next();
            }
            Joi.assert(id, Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())), 'Invalid data provided to hapi method');
            var ids = [];
            if (!Array.isArray(id)) {
                ids.push(id);
            }
            else {
                ids = id;
            }
            _this.getDbService().getModel().find({
                _id: {
                    $in: ids
                }
            }, function (err, docs) {
                if (err) {
                    next(Boom.badImplementation(err));
                }
                else if (!docs) {
                    next(Boom.forbidden('Invalid store id(s) provided'));
                }
                else {
                    if (docs.length === ids.length) {
                        next();
                    }
                    else {
                        next(Boom.forbidden('Invalid store id(s) provided'));
                    }
                }
            });
        };
    }
    StoreValidator.prototype.setServer = function (server) {
        this.server = server;
    };
    StoreValidator.prototype.getDbService = function () {
        return this.server.settings.app.services.storeDbService;
    };
    return StoreValidator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StoreValidator;
