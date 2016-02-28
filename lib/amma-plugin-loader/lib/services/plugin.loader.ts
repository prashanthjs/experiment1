import Hapi = require('hapi');
import Hoek = require('hoek');
import ServiceLoader = require('./service.loader');
import RouteLoader = require('./route.loader');
import Schema = require('../schema/schema');
import Joi = require('joi');
import IServiceLoader from "./service.loader";


export interface IConfig {
    app?: Object;
    config?: Object;
    services?: ServiceLoader.IServiceConfig[];
    routes?: any[];
    attributes: Object;
}

export interface ICallback {
    (err?:any, results?:any): any;
}


export interface IRegister {
    (server:Hapi.Server, options:any, next:(error?:any, result?:any) => any): void;
    attributes?: any;
}

export interface IPluginLoader {
    register(server:Hapi.Server, options:any, next:ICallback):void;
    setServer(server:Hapi.Server):void;
    setServiceLoader(serviceLoader:ServiceLoader.IServiceLoader):void;
    setRouteLoader(routeLoader:RouteLoader.IRouteLoader):void;
}

export class PluginLoader implements IPluginLoader {

    private server:Hapi.Server;
    private config:IConfig;
    private serviceLoader:ServiceLoader.IServiceLoader;
    private routeLoader:RouteLoader.IRouteLoader;

    constructor(config:IConfig) {
        this.config = Joi.attempt(config, Schema.default.ConfigSchema, 'Invalid config');
        this.register.attributes = this.config.attributes;
    }

    /**
     *
     * @param server
     * @param options
     * @param next
     */
    register:IRegister = (server:Hapi.Server, options:any, next:ICallback):void => {
        server.bind(this);
        this.setServer(server);
        this.config = Hoek.merge(this.config, options);
        server.expose('config', this.config);
        this.parseAppSettings();
        this.serviceLoader.loadServices(this.config.services, (err)=> {
            const routes = this.config.routes;
            this.routeLoader.loadRoutes(routes);
            next(err);
        });
    };

    protected parseAppSettings():void {
        const app = this.config.app;
        if (app) {
            if (this.server.settings.app) {
                this.server.settings.app = Hoek.merge(this.config.app, this.server.settings.app, false, true);

            }
            else {
                this.server.settings.app = app;
            }

        }
    }

    setServer(server:Hapi.Server):void {
        this.server = server;
        this.serviceLoader.setServer(server);
        this.routeLoader.setServer(server);
    }

    setServiceLoader(serviceLoader:ServiceLoader.IServiceLoader):void {
        this.serviceLoader = serviceLoader;
    }

    setRouteLoader(routeLoader:RouteLoader.IRouteLoader):void {
        this.routeLoader = routeLoader;
    }


}

export default PluginLoader;