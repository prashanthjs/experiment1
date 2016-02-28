import Hapi = require('hapi');
import Joi = require('joi');
import Hoek = require('hoek');
import ObjectPath = require('object-path');
import Schema = require('../schema/schema');

export interface IHandlerConfig {
    methodName: string;
    name:string;
}


export interface IHandlerLoader {
    setServer(server:Hapi.Server):void;
    loadHandlers(cls, handlerConfig?:IHandlerConfig[]) :void;
    loadHandler(cls, handlerConfig:IHandlerConfig):void;
}


class HandlerLoader implements IHandlerLoader {
    private server:Hapi.Server;

    loadHandlers(cls, handlerConfig?:IHandlerConfig[]):void {
        cls = Joi.attempt(cls, Joi.object().required(), 'Invalid class supplied');
        handlerConfig = handlerConfig || [];
        handlerConfig = Joi.attempt(handlerConfig, Schema.default.HandlerSchemas, 'Invalid handlers config');
        for (let i = 0; i < handlerConfig.length; i++) {
            this.loadHandler(cls, handlerConfig[i]);
        }

    }

    loadHandler(cls, handlerConfig:IHandlerConfig):void {
        cls = Joi.attempt(cls, Joi.object().required(), 'Invalid class supplied');
        handlerConfig = Joi.attempt(handlerConfig, Schema.default.HandlerSchema, 'Invalid handler config');
        const methodName = handlerConfig.methodName;
        const name = handlerConfig.name;
        Hoek.assert(typeof cls[methodName] === 'function', 'Invalid handler method');
        const func:any = ObjectPath.get(cls, methodName);
        this.server.handler(name, func);
    }

    setServer(server:Hapi.Server):void {
        this.server = server;
    }

}

export default HandlerLoader;