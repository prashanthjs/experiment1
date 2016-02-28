import Hapi = require('hapi');
import Joi = require('joi');
import Hoek = require('hoek');
import ObjectPath = require('object-path');
import Schema = require('../schema/schema');

export interface IMethodConfig {
    methodName: string;
    name:string;
    options?: Object;
}

export interface IMethodLoader {
    setServer(server:Hapi.Server):void;
    loadMethods(cls, methodConfigs?:IMethodConfig[]):void;
    loadMethod(cls, methodConfig:IMethodConfig):void
}

class MethodLoader implements IMethodLoader {
    private server:Hapi.Server;

    loadMethods(cls, methodConfigs?:IMethodConfig[]):void {
        cls = Joi.attempt(cls, Joi.object().required(), 'Invalid class supplied');
        methodConfigs = methodConfigs || [];
        methodConfigs = Joi.attempt(methodConfigs, Schema.default.MethodSchemas, 'Invalid method configs');
        for (let i = 0; i < methodConfigs.length; i++) {
            this.loadMethod(cls, methodConfigs[i]);
        }
    }

    loadMethod(cls, methodConfig:IMethodConfig):void {
        cls = Joi.attempt(cls, Joi.object().required(), 'Invalid class supplied');
        methodConfig = Joi.attempt(methodConfig, Schema.default.MethodSchema, 'Invalid method config');
        const methodName = methodConfig.methodName;
        const options = methodConfig.options;
        const name = methodConfig.name;
        Hoek.assert(typeof cls[methodName] === 'function', 'Invalid service method');
        const func:any = ObjectPath.get(cls, methodName);
        this.server.method(name, func, options);
    }

    setServer(server:Hapi.Server):void {
        this.server = server;
    }

}

export default MethodLoader;