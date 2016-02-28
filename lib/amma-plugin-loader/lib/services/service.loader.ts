import Hapi = require('hapi');
import Hoek = require('hoek');
import Items = require('items');
import ObjectPath = require('object-path');
import Schema = require('../schema/schema');
import Joi = require('joi');
import MethodLoader = require('./method.loader');
import EventLoader = require('./event.loader');
import HandlerLoader = require('./handler.loader');


export interface IServiceConfig {
    cls: any;
    name?: string;
    methods?: MethodLoader.IMethodConfig[];
    handlers?: HandlerLoader.IHandlerConfig[];
    events?: EventLoader.IEventConfig[];
}

export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IServiceLoader {
    setServer(server:Hapi.Server):void;
    loadServices(serviceConfig:IServiceConfig[], next:ICallback):void;
    loadCallbacks(callbackArray:any[], next:ICallback): void;
    setMethodLoader(methodLoader:MethodLoader.IMethodLoader):void;
    setEventLoader(eventLoader:EventLoader.IEventLoader):void;
    setHandlerLoader(handlerLoader:HandlerLoader.IHandlerLoader):void;
}

class ServiceLoader implements IServiceLoader {

    private server:Hapi.Server;
    private methodLoader:MethodLoader.IMethodLoader;
    private eventLoader:EventLoader.IEventLoader;
    private handlerLoader:HandlerLoader.IHandlerLoader;


    loadServices(serviceConfig:IServiceConfig[], next:ICallback):void {
        const callBackArray = [];
        serviceConfig = Joi.attempt(serviceConfig, Schema.default.ServiceSchemas, 'Invalid service configs');
        if (serviceConfig && serviceConfig.length) {
            for (let i = 0; i < serviceConfig.length; i++) {
                this.loadService(serviceConfig[i], callBackArray);
            }
        }

        this.loadCallbacks(callBackArray, next);
    }

    private loadService(serviceConfig:IServiceConfig, callBackArray:any[]):void {
        serviceConfig = Joi.attempt(serviceConfig, Schema.default.ServiceSchema, 'Invalid service config');
        const ServiceClass:any = serviceConfig.cls;
        const cls = new ServiceClass();
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
    }

    loadCallbacks(callbackArray:any[], next:ICallback):void {
        callbackArray = Joi.attempt(callbackArray, Joi.array().items(Joi.func()), 'Invalid callback array');
        if (callbackArray.length) {
            Items.serial(callbackArray, (item, done:ICallback) => {
                item(done)
            }, (error?:any) => {
                if (error) {
                    next(error);
                } else {
                    next();
                }

            });
        } else {
            next();
        }
    }

    setServer(server:Hapi.Server):void {
        this.server = server;
        this.methodLoader.setServer(server);
        this.handlerLoader.setServer(server);
        this.eventLoader.setServer(server);
    }

    setMethodLoader(methodLoader:MethodLoader.IMethodLoader):void {
        this.methodLoader = methodLoader;
    }

    setEventLoader(eventLoader:EventLoader.IEventLoader):void {
        this.eventLoader = eventLoader;
    }

    setHandlerLoader(handlerLoader:HandlerLoader.IHandlerLoader):void {
        this.handlerLoader = handlerLoader;
    }

}
export default ServiceLoader;