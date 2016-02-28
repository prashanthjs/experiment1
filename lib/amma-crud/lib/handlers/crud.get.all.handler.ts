import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Mongoose = require('mongoose');
import HandlerSchema = require('../schema/handler.schema');
import CrudCoreHandler = require('./crud.core.handler');
import Async = require('async');


export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IRequest extends Hapi.IRequestHandler<Hapi.Request> {
    query?:Object;
}

interface IOptions extends CrudCoreHandler.IOptions {
    projections?: string|Object
}

class CrudGetAllHandler extends CrudCoreHandler.default {

    protected options:IOptions;


    handler = (request:IRequest, reply:Hapi.IReply) => {
        const model = this.getModel();
        Async.series({
            results: (callback:ICallback) => {
                model.findAll(request.query, this.options.projections, callback);
            },
            total: (callback:ICallback) => {
                model.findAllCount(request.query, callback);
            }
        }, (err?:any, results?:any):any => {
            if (err) {
                return reply(Boom.badImplementation(err));
            }
            else {
                const res = {
                    results: results.results,
                    meta: {
                        total: results.total
                    }
                };
                reply(res);
            }
        });

    };


    getSchema = () => {
        return HandlerSchema.default.CoreGetAllOption;
    }


}
export default CrudGetAllHandler;