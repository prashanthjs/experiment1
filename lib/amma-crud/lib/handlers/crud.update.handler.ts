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
    idPath: string;
    projections?: string|Object;
    notFoundMessage?: string;
}

class CrudCreateHandler extends CrudCoreHandler.default {

    protected options:IOptions;
    private defaultNotFoundMessage = 'Not found';


    handler = (request:IRequest, reply:Hapi.IReply) => {
        const model = this.getModel();
        const payload:any = request.payload;
        const id = ObjectPath.get(request, this.options.idPath, null);

        model.findById(id, this.options.projections, (err?:any, result?:any):any => {
            if (err) {
                reply(Boom.badImplementation(err));
            }
            else if (!result) {
                const message = ObjectPath.get(this.options, 'notFoundMessage', this.defaultNotFoundMessage);
                reply(Boom.notFound(message));
            } else {
                this.update(id, payload, reply);
            }
        });


    };

    update = (id, payload, reply) => {
        const model = this.getModel();
        model.findByIdAndUpdate(id, payload, (err?:any, result?:any):any => {
            if (err) {
                reply(Boom.forbidden(err));
            }
            else {
                model.findById(id, this.options.projections, (err?:any, result?:any):any => {
                    if (err) {
                        reply(Boom.badImplementation(err));
                    }
                    else {
                        reply(result);
                    }
                });
            }
        });
    }


    getSchema = () => {
        return HandlerSchema.default.CoreUpdateOption;
    }


}
export default CrudCreateHandler;