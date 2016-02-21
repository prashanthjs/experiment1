import Hapi = require("hapi");
import Boom = require("boom");
import FileManager = require('../services/file.manager');
import FileHelper = require('../services/file.helper');
import ObjectPath = require('object-path');
import Schema = require('../schema/schema');
import Joi = require('joi');


export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IOptions {
    fileOptions: FileHelper.IOptions;
    extPath?: string;
    tokenPath?:string;
}

class FileCoreHandler {

    protected server:Hapi.Server;
    protected name:string = '';
    protected route:Hapi.IRoute;
    protected options:IOptions;

    setServer(server:Hapi.Server) {
        this.server = server;
    }

    init(next:ICallback) {
        this.server.handler(this.name, this.handlerInit);
        next();
    }

    handlerInit = (route:Hapi.IRoute, options:IOptions):Hapi.ISessionHandler => {
        this.route = route;
        this.options = Joi.attempt(options, this.getSchema(), 'Invalid directory handler options (' + route.path + ')');
        const handler:any = this.handler;
        return handler;
    };

    handler = (request:Hapi.IRequestHandler<Hapi.Request>, reply:Hapi.IReply) => {
        reply({});
    };

    getExtpath(request:Hapi.IRequestHandler<Hapi.Request>) {
        if (ObjectPath.has(this.options, 'extPath')
            && ObjectPath.has(request, this.options.extPath)) {
            return ObjectPath.get(request, this.options.extPath);
        }
        return null;
    }

    getToken(request:Hapi.IRequestHandler<Hapi.Request>) {
        if (ObjectPath.has(this.options, 'tokenPath')
            && ObjectPath.has(request, this.options.tokenPath)) {
            return ObjectPath.get(request, this.options.tokenPath);
        }
        return null;
    }

    getSchema() {
        return Schema.default.FileHandlerSchema;
    }

    getFileHelperInstance(request:Hapi.IRequestHandler<Hapi.Request>):FileHelper.IFileHelper {
        return this.server.plugins['amma-file'].fileFactory.getInstance(this.options.fileOptions, this.getExtpath(request), this.getToken(request));
    }

}

export default FileCoreHandler;