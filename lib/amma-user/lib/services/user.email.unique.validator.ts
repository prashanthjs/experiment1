import Hapi = require('hapi');
import Boom = require('boom');
import Joi = require('joi');
import Bcrypt = require('bcrypt');
import UserDbService = require('./user.db.service');

export interface ICallback {
    (err?:any, results?:any): any;
}

export interface IUserEmailUniqueValidator {
    userEmailUniqueValidator(email, next:ICallback):void;
}

class UserEmailUniqueValidator implements IUserEmailUniqueValidator {

    private server:Hapi.Server;

    userEmailUniqueValidator = (email:string, next:ICallback) => {
        Joi.assert(email, Joi.string().required(), 'Invalid data provided to hapi method');
        this.getUserDbService().findByEmail(email, null, (err, result) => {
            if (err) {
                return next(err);
            }
            else {
                if (result) {
                    return next(Boom.forbidden('Email already exists'));
                }
                return next();
            }
        });
    };

    setServer(server:Hapi.Server):void {
        this.server = server;
    }

    getUserDbService():UserDbService.IUserDbService {
        return this.server.settings.app.services.userDbService;
    }

}

export default UserEmailUniqueValidator;
