var Items = require('items');
var ObjectPath = require('object-path');
var Schema = require('../schema/schema');
var Joi = require('joi');
var ServiceLoader = (function () {
    function ServiceLoader() {
    }
    ServiceLoader.prototype.loadServices = function (serviceConfig, next) {
        var callBackArray = [];
        serviceConfig = Joi.attempt(serviceConfig, Schema.default.ServiceSchemas, 'Invalid service configs');
        if (serviceConfig && serviceConfig.length) {
            for (var i = 0; i < serviceConfig.length; i++) {
                this.loadService(serviceConfig[i], callBackArray);
            }
        }
        this.loadCallbacks(callBackArray, next);
    };
    ServiceLoader.prototype.loadService = function (serviceConfig, callBackArray) {
        serviceConfig = Joi.attempt(serviceConfig, Schema.default.ServiceSchema, 'Invalid service config');
        var ServiceClass = serviceConfig.cls;
        var cls = new ServiceClass();
        if (typeof cls.setServer === 'function') {
            cls.setServer(this.server);
        }
        if (typeof cls.init === 'function') {
            callBackArray.push(cls.init);
        }
        this.methodLoader.loadMethods(cls, serviceConfig.methods);
        this.handlerLoader.loadHandlers(cls, serviceConfig.handlers);
        this.eventLoader.loadEvents(cls, serviceConfig.events);
        if (serviceConfig.name) {
            ObjectPath.ensureExists(this.server, 'settings.app.services', {});
            ObjectPath.set(this.server, 'settings.app.services.' + serviceConfig.name, cls);
        }
    };
    ServiceLoader.prototype.loadCallbacks = function (callbackArray, next) {
        callbackArray = Joi.attempt(callbackArray, Joi.array().items(Joi.func()), 'Invalid callback array');
        if (callbackArray.length) {
            Items.serial(callbackArray, function (item, done) {
                item(done);
            }, function (error) {
                if (error) {
                    next(error);
                }
                else {
                    next();
                }
            });
        }
        else {
            next();
        }
    };
    ServiceLoader.prototype.setServer = function (server) {
        this.server = server;
        this.methodLoader.setServer(server);
        this.handlerLoader.setServer(server);
        this.eventLoader.setServer(server);
    };
    ServiceLoader.prototype.setMethodLoader = function (methodLoader) {
        this.methodLoader = methodLoader;
    };
    ServiceLoader.prototype.setEventLoader = function (eventLoader) {
        this.eventLoader = eventLoader;
    };
    ServiceLoader.prototype.setHandlerLoader = function (handlerLoader) {
        this.handlerLoader = handlerLoader;
    };
    return ServiceLoader;
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = ServiceLoader;
