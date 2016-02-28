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
}

class CrudRemoveHandler extends CrudCoreHandler.default {

    protected options:IOptions;


    handler = (request:IRequest, reply:Hapi.IReply) => {
        const model = this.getModel();
        const id = ObjectPath.get(request, this.options.idPath, null);
        model.findByIdAndRemove(id, (err?:any):any => {
            if (err) {
                reply(Boom.badImplementation(err));
            }
            else {
                reply({});
            }
        });


    };

    getSchema = () => {
        return HandlerSchema.default.CoreRemoveOption;
    }

}
export default CrudRemoveHandler;