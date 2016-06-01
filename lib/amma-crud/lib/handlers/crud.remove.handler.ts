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
        const model:any = this.getModel();
        const id = ObjectPath.get(request, this.options.idPath, null);
        model.findById(id, (err, result) => {
            if(err){
                reply(Boom.badImplementation(err));
            }
            else if(!result){
                reply({});
            }
            else if(ObjectPath.get(result,'isLocked', false)){
                reply(Boom.badImplementation('Cannot be deleted'));
            }
            else{
                result.remove(()=>{
                    reply({});
                });
            }
        });
    };

    getSchema = () => {
        return HandlerSchema.default.CoreRemoveOption;
    }

}
export default CrudRemoveHandler;