import Hapi = require('hapi');
import Joi = require('joi');
import Hoek = require('hoek');
import ObjectPath = require('object-path');
import Schema = require('../schema/schema');

export interface IEventConfig {
    methodName: string;
    type:string;
    options?:Object;
}

export interface IEventLoader {
    setServer(server:Hapi.Server):void;
    loadEvents(cls, eventConfig?:IEventConfig[]):void;
    loadEvent(cls, event:IEventConfig):void;
}

class EventLoader implements IEventLoader {
    private server:Hapi.Server;

    loadEvents(cls, eventConfig?:IEventConfig[]):void {
        cls = Joi.attempt(cls, Joi.object().required(), 'Invalid class supplied');
        eventConfig = eventConfig || [];
        eventConfig = Joi.attempt(eventConfig, Schema.default.EventSchemas, 'Invalid event configs');
        for (let i = 0; i < eventConfig.length; i++) {
            this.loadEvent(cls, eventConfig[i]);
        }
    }

    loadEvent(cls, event:IEventConfig):void {
        cls = Joi.attempt(cls, Joi.object().required(), 'Invalid class supplied');
        event = Joi.attempt(event, Schema.default.EventSchema, 'Invalid event config');
        const methodName = event.methodName;
        const type = event.type;
        const options:any = event.options;
        Hoek.assert(typeof cls[methodName] === 'function', 'Invalid event handler');
        const func:any = ObjectPath.get(cls, methodName);
        this.server.ext(type, func, options);
    }

    setServer(server:Hapi.Server):void {
        this.server = server;
    }

}

export default EventLoader;