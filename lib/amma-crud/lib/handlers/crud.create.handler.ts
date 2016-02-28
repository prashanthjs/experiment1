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
    payload:Object;
}

interface IOptions extends CrudCoreHandler.IOptions {
    idExistsMessage?: string;
    projections?: string|Object;
}

class CrudCreateHandler extends CrudCoreHandler.default {

    protected options:IOptions;
    private defaultIdExistsMessage = 'Id exists already';


    handler = (request:IRequest, reply:Hapi.IReply) => {
        const model = this.getModel();
        const payload:any = request.payload;
        model.create(payload, (err?:any, result?:any):any => {
            if (err) {
                if ([11000, 11001].indexOf(err.code) !== -1) {
                    const message = ObjectPath.get(this.options, 'idExistsMessage', this.defaultIdExistsMessage);
                    reply(Boom.forbidden(message));
                } else {
                    reply(Boom.forbidden(err));
                }
            }
            else {
                model.findById(result._id, this.options.projections, (err?:any, result?:any):any => {
                    if (err) {
                        reply(Boom.badImplementation(err));
                    }
                    else {
                        reply(result);
                    }
                });
            }
        });
    };


    getSchema = () => {
        return HandlerSchema.default.CoreCreateOption;
    }


}
export default CrudCreateHandler;