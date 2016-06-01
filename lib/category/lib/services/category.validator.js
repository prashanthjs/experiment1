"use strict";
var Boom = require('boom');
var Joi = require('joi');
var CategoryValidator = (function () {
    function CategoryValidator() {
        var _this = this;
        this.parentChecker = function (id, next) {
            if (!id) {
                return next();
            }
            Joi.assert(id, Joi.string().required(), 'Invalid data provided to hapi method');
            _this.getDbService().findById(id, null, function (err, result) {
                if (err) {
                    return next(Boom.badImplementation(err));
                }
                else {
                    if (!result) {
                        return next(Boom.forbidden('Invalid parent category provided'));
                    }
                    return next();
                }
            });
        };
    }
    CategoryValidator.prototype.setServer = function (server) {
        this.server = server;
    };
    CategoryValidator.prototype.getDbService = function () {
        return this.server.settings.app.services.categoryDbService;
    };
    return CategoryValidator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CategoryValidator;
