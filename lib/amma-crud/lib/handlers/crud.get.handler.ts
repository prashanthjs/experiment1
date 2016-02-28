import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Mongoose = require('mongoose');
import HandlerSchema = require('../schema/handler.schema');
import CrudCoreHandler = require('./crud.core.handler');
import Async = require('async');
import ObjectPath = require('object-path');


export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IRequest extends Hapi.IRequestHandler<Hapi.Request> {

}

interface IOptions extends CrudCoreHandler.IOptions {
    idPath: string;
    projections?: string|Object;
    notFoundMessage?: string;

}

class CrudGetHandler extends CrudCoreHandler.default {

    protected options:IOptions;
    private defaultNotFoundMessage = 'Not found';


    handler = (request:IRequest, reply:Hapi.IReply) => {
        const model = this.getModel();
        const id = ObjectPath.get(request, this.options.idPath, null);
        model.findById(id, this.options.projections, (err?:any, result?:any):any => {
            if (err) {
                reply(Boom.badImplementation(err));
            }
            else if (!result) {
                const message = ObjectPath.get(this.options, 'notFoundMessage', this.defaultNotFoundMessage);
                reply(Boom.notFound(message));
            } else {
                reply(result);
            }
        });

    };


    getSchema = () => {
        return HandlerSchema.default.CoreGetOption;
    }


}
export default CrudGetHandler;