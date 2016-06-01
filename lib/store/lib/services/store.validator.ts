import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Bcrypt = require('bcrypt');
import DbService = require('./store.db.service');

export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IStoreValidator {
    storeValidator(id, next:ICallback):void;
}

class StoreValidator implements IStoreValidator {

    private server:Hapi.Server;

    storeValidator = (id, next:ICallback) => {
        if (!id) {
            return next();
        }

        Joi.assert(id, Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())), 'Invalid data provided to hapi method');
        let ids = [];
        if (!Array.isArray(id)) {
           ids.push(id);
        } else {
            ids = id;
        }
        this.getDbService().getModel().find({
            _id: {
                $in: ids
            }
        }, (err, docs) => {
            if (err) {
                next(Boom.badImplementation(err));
            }
            else if(!docs){
                next(Boom.forbidden('Invalid store id(s) provided'));
            } else {
                if(docs.length === ids.length){
                    next();
                } else {
                    next(Boom.forbidden('Invalid store id(s) provided'));
                }
            }
        });
    };

    setServer(server:Hapi.Server):void {
        this.server = server;
    }

    getDbService():DbService.IStoreDbService {
        return this.server.settings.app.services.storeDbService;
    }

}

export default StoreValidator;
