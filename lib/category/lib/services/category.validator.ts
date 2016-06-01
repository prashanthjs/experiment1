import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Bcrypt = require('bcrypt');
import DbService = require('./category.db.service');

export interface ICallback {
    (err?:any, results?:any): any;
}

export interface ICategoryValidator {
    parentChecker(id:string, next:ICallback):void;
}

class CategoryValidator implements ICategoryValidator {

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
                    return next(Boom.forbidden('Invalid parent category provided'));
                }
                return next();
            }
        });
    };

    setServer(server:Hapi.Server):void {
        this.server = server;
    }

    getDbService():DbService.ICategoryDbService {
        return this.server.settings.app.services.categoryDbService;
    }

}

export default CategoryValidator;
