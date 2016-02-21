import Hapi = require('hapi');
import Hoek = require('hoek');
import Items = require('items');
import ObjectPath = require('object-path');
import _ = require('lodash');

export interface IServiceConfig {
    cls(): any;
    methods?: IMethodConfig[]
}

export interface IMethodConfig {
    methodName: string;
    name:string;
    options?: Object;
}

export interface IConfig {
    app?: Object;
    config?: Object;
    services: Object;
    routes?: Hapi.IRouteConfiguration[];
    attributes: Object;
}

export interface ICallback {
    (err?:any, results?:any): any;
}


export interface IRegister {
    (server:Hapi.Server, options:any, next:(error?:any, result?:any) => any): void;
    attributes?: any;
}

export class PluginLoader {

    protected server:Hapi.Server;

    /**
     *
     * @param config
     */
    constructor(protected config:IConfig) {
        this.register.attributes = this.config.attributes;
    }

    /**
     *
     * @param server
     * @param options
     * @param next
     */
    register:IRegister = (server, options, next) => {
        server.bind(this);
        this.server = server;
        this.config = Hoek.merge(this.config, options);
        server.expose('config', this.config);
        this.parseAppSettings();

        this.loadServices((err) => {
            if (err) {
                next(err);
            }
            else {
                this.loadRoutes();
                next();
            }
        });
    };

    protected loadRoutes() {
        let routes = this.config.routes;
        if (routes) {
            this.server.route(routes);
        }
    }

    /**
     *
     */
    protected parseAppSettings() {
        const app = this.config.app;
        if (app) {
            Hoek.assert(typeof app === 'object' || typeof app === null || typeof app === "undefined", 'Config App setting should be an object or undefined or null');
            if (this.server.settings.app) {
                this.server.settings.app = Hoek.merge(this.config.app, this.server.settings.app);
            }
            else {
                this.server.settings.app = app;
            }

        }
    }

    /**
     *
     * @param next
     */
    protected loadServices(next:ICallback) {
        const services = this.config.services;
        if (services) {
            Hoek.assert(typeof services === 'object', 'services should be an object');
            let callBackArray = [];
            _.forEach(services, (service:IServiceConfig, key:string) => {
                this.loadService(service, key, callBackArray);
            });
            this.loadCallbacks(callBackArray, next);
        } else {
            next();
        }

    }

    /**
     *
     * @param service
     * @param callBackArray
     */
    protected loadService(service:IServiceConfig, key:string, callBackArray) {
        Hoek.assert(typeof service.cls === 'function', 'Invalid service class');
        let ServiceClass:any = service.cls;
        let cls = new ServiceClass();

        if (ObjectPath.has(cls, 'setServer')) {
            cls.setServer(this.server);
        }
        if (ObjectPath.has(cls, 'init')) {
            callBackArray.push(cls.init);
        }
        if (service.methods) {
            let methods = service.methods;
            Hoek.assert(Array.isArray(methods), 'service method should be an array');
            for (let i = 0; i < methods.length; i++) {
                this.loadMethod(methods[i], cls);
            }
        }
        this.server.expose(key, cls);
    }

    protected loadMethod(method:IMethodConfig, cls) {
        let methodName = method.methodName;
        let options = method.options;
        let name = method.name;
        Hoek.assert(typeof methodName === 'string', 'services method name should be a string');
        Hoek.assert(typeof name === 'string', 'service name should be a string');
        Hoek.assert(ObjectPath.has(cls, methodName), 'Invalid service method');
        let func:any = ObjectPath.get(cls, methodName);
        this.server.method(name, func, options);
    }

    /**
     *
     * @param callbackArray
     * @param next
     */
    protected loadCallbacks(callbackArray:any[], next:ICallback) {
        if (callbackArray && callbackArray.length) {
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
            return next();
        }
    }


}

export default PluginLoader;