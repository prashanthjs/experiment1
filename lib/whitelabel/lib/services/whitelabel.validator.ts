import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Bcrypt = require('bcrypt');
import WhitelabelDbService = require('./whitelabel.db.service');

export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IWhitelabelValidator {
    parentChecker(id:string, next:ICallback):void;
}

class WhitelabelValidator implements IWhitelabelValidator {

    private server:Hapi.Server;

    parentChecker = (id:string, next:ICallback) => {
        if (!id) {
            return next();
        }
        Joi.assert(id, Joi.string().required(), 'Invalid data provided to hapi method');
        this.getWhitelabelDbService().findById(id, null, (err, result) => {
            if (err) {
                return next(Boom.badImplementation(err));
            }
            else {
                if (!result) {
                    return next(Boom.forbidden('Invalid parent whitelabel provided'));
                }
                return next();
            }
        });
    };

    setServer(server:Hapi.Server):void {
        this.server = server;
    }

    getWhitelabelDbService():WhitelabelDbService.IWhitelabelDbService {
        return this.server.settings.app.services.whitelabelDbService;
    }

}

export default WhitelabelValidator;
