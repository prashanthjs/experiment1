import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Bcrypt = require('bcrypt');
import DbService = require('./store.db.service');

export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IStoreValidator {
    parentChecker(id:string, next:ICallback):void;
}

class StoreValidator implements IStoreValidator {

    private server:Hapi.Server;

    parentChecker = (id:string, next:ICallback) => {
        if (!id) {
            return next();
        }
        Joi.assert(id, Joi.string().required(), 'Invalid data provided to hapi method');
        this.getDbService().findById(id, null, (err, result) => {
            if (err) {
                return next(Boom.badImplementation(err));
            }
            else {
                if (!result) {
                    return next(Boom.forbidden('Invalid parent store provided'));
                }
                return next();
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
