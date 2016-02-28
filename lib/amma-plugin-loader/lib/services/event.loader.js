var Joi = require('joi');
var Hoek = require('hoek');
var ObjectPath = require('object-path');
var Schema = require('../schema/schema');
var EventLoader = (function () {
    function EventLoader() {
    }

    EventLoader.prototype.loadEvents = function (cls, eventConfig) {
        cls = Joi.attempt(cls, Joi.object().required(), 'Invalid class supplied');
        eventConfig = eventConfig || [];
        eventConfig = Joi.attempt(eventConfig, Schema.default.EventSchemas, 'Invalid event configs');
        for (var i = 0; i < eventConfig.length; i++) {
            this.loadEvent(cls, eventConfig[i]);
        }
    };
    EventLoader.prototype.loadEvent = function (cls, event) {
        cls = Joi.attempt(cls, Joi.object().required(), 'Invalid class supplied');
        event = Joi.attempt(event, Schema.default.EventSchema, 'Invalid event config');
        var methodName = event.methodName;
        var type = event.type;
        var options = event.options;
        Hoek.assert(typeof cls[methodName] === 'function', 'Invalid event handler');
        var func = ObjectPath.get(cls, methodName);
        this.server.ext(type, func, options);
    };
    EventLoader.prototype.setServer = function (server) {
        this.server = server;
    };
    return EventLoader;
})();
Object.defineProperty(exports, "__esModule", {value: true});
exports.default = EventLoader;
