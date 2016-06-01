"use strict";
var Joi = require('joi');
var Hoek = require('hoek');
var ObjectPath = require('object-path');
var Schema = require('../schema/schema');
var MethodLoader = (function () {
    function MethodLoader() {
    }
    MethodLoader.prototype.loadMethods = function (cls, methodConfigs) {
        cls = Joi.attempt(cls, Joi.object().required(), 'Invalid class supplied');
        methodConfigs = methodConfigs || [];
        methodConfigs = Joi.attempt(methodConfigs, Schema.default.MethodSchemas, 'Invalid method configs');
        for (var i = 0; i < methodConfigs.length; i++) {
            this.loadMethod(cls, methodConfigs[i]);
        }
    };
    MethodLoader.prototype.loadMethod = function (cls, methodConfig) {
        cls = Joi.attempt(cls, Joi.object().required(), 'Invalid class supplied');
        methodConfig = Joi.attempt(methodConfig, Schema.default.MethodSchema, 'Invalid method config');
        var methodName = methodConfig.methodName;
        var options = methodConfig.options;
        var name = methodConfig.name;
        Hoek.assert(typeof cls[methodName] === 'function', 'Invalid service method');
        var func = ObjectPath.get(cls, methodName);
        this.server.method(name, func, options);
    };
    MethodLoader.prototype.setServer = function (server) {
        this.server = server;
    };
    return MethodLoader;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MethodLoader;
