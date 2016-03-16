var Joi = require('joi');
var Hoek = require('hoek');
var ObjectPath = require('object-path');
var Schema = require('../schema/schema');
var HandlerLoader = (function () {
    function HandlerLoader() {
    }
    HandlerLoader.prototype.loadHandlers = function (cls, handlerConfig) {
        cls = Joi.attempt(cls, Joi.object().required(), 'Invalid class supplied');
        handlerConfig = handlerConfig || [];
        handlerConfig = Joi.attempt(handlerConfig, Schema.default.HandlerSchemas, 'Invalid handlers config');
        for (var i = 0; i < handlerConfig.length; i++) {
            this.loadHandler(cls, handlerConfig[i]);
        }
    };
    HandlerLoader.prototype.loadHandler = function (cls, handlerConfig) {
        cls = Joi.attempt(cls, Joi.object().required(), 'Invalid class supplied');
        handlerConfig = Joi.attempt(handlerConfig, Schema.default.HandlerSchema, 'Invalid handler config');
        var methodName = handlerConfig.methodName;
        var name = handlerConfig.name;
        Hoek.assert(typeof cls[methodName] === 'function', 'Invalid handler method');
        var func = ObjectPath.get(cls, methodName);
        this.server.handler(name, func);
    };
    HandlerLoader.prototype.setServer = function (server) {
        this.server = server;
    };
    return HandlerLoader;
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = HandlerLoader;
