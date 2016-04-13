import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Mongoose = require('mongoose');
import DocumentService = require('../services/document.service');
import DocumentServiceFactory = require('../services/document.service.factory');
import HandlerSchema = require('../schema/handler.schema');


export interface IOptions {
    collectionName: string;
    schema: Mongoose.Schema;

}

class CrudCoreHandler {

    protected server:Hapi.Server;
    protected route:Hapi.IRoute;
    protected options:IOptions;
    private model:DocumentService.IDocumentService;

    handlerInit = (route:Hapi.IRoute, options:IOptions):Hapi.ISessionHandler => {
        this.route = route;
        this.options = Joi.attempt(options, this.getSchema(), 'Invalid directory handler options (' + route.path + ')');
        const handler:any = this.handler;
        return handler;
    };

    handler = (request:Hapi.IRequestHandler<Hapi.Request>, reply:Hapi.IReply) => {
        reply({});
    };

    getModel():DocumentService.IDocumentService {
        if (!this.model) {
            const documentServiceFactory:DocumentServiceFactory.IDocumentServiceFactory = this.server.settings.app.services.documentServiceFactory;
            this.model = documentServiceFactory.getDocumentService(this.options.collectionName, this.options.schema);
        }
        return this.model;
    }

    getSchema = () => {
        return HandlerSchema.default.CoreHandlerOption;
    };

    setServer(server:Hapi.Server) {
        this.server = server;
    }

}
export default CrudCoreHandler;