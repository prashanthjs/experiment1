"use strict";
var Boom = require('boom');
var Joi = require('joi');
var RoleValidator = (function () {
    function RoleValidator() {
        var _this = this;
        this.roleValidator = function (id, next) {
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
                    next(Boom.forbidden('Invalid role id(s) provided'));
                }
                else {
                    if (docs.length === ids.length) {
                        next();
                    }
                    else {
                        next(Boom.forbidden('Invalid role id(s) provided'));
                    }
                }
            });
        };
        this.privilegeValidator = function (id, next) {
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
            var privileges = _this.getDbService().getAllPrivileges();
            var count = 0;
            for (var i = 0; i < ids.length; i++) {
                if (privileges.indexOf(ids[i]) != -1) {
                    count++;
                }
            }
            console.log(count);
            console.log('....');
            console.log(ids.length);
            if (count == ids.length) {
                console.log('prashanth');
                next();
            }
            else {
                next(Boom.forbidden('Invalid privilege(s) provided'));
            }
        };
    }
    RoleValidator.prototype.setServer = function (server) {
        this.server = server;
    };
    RoleValidator.prototype.getDbService = function () {
        return this.server.settings.app.services.roleDbService;
    };
    return RoleValidator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RoleValidator;
